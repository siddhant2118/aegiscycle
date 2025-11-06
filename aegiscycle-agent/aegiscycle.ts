/*
 AegisCycle: MCP-native multi-agent stack with a 5-layer process chain
 Runtime: Node 18+
 Editor: Cursor (MCP enabled)

 What this gives you:
 - Clear agent specs (roles, IO contracts, tools)
 - A 5-layer pipeline wired for MCP tools
 - Groq chat completions for reasoning + tool selection
 - Pluggable MCP servers (filesystem, http, pdf/csv, vector db, calendar, etc.)
 - Deterministic JSON outputs using JSON schema and function-calling style

 🔧 Env
 - GROQ_API_KEY=...
 - MCP_SERVERS=["filesystem","http","pdf","csv","sqlite","vector"]  // example; wire what you actually run
 - GROQ_MODEL=llama-3.3-70b-versatile  // change as needed

 🧩 References
 - MCP SDK (TypeScript): https://modelcontextprotocol.io/docs/sdk
 - MCP Node client tutorial: https://modelcontextprotocol.info/docs/tutorials/building-a-client-node/
 - Groq SDK: https://github.com/groq/groq-typescript
 - Groq chat completions: https://console.groq.com/docs/api-reference
*/

// ------------------------------
// Imports
// ------------------------------
import "dotenv/config"; // Load environment variables from .env file
import { Groq } from "groq-sdk";
import { v4 as uuid } from "uuid";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// For MCP, we treat tools as remote servers speaking the protocol.
// In Cursor, you configure MCP servers under Settings → Features → MCP Servers.
// This orchestration file assumes those servers are reachable via local transport or HTTP/WebSocket.

// Minimal MCP client shim. If you already use an MCP client, swap this for your client implementation.
// We keep a thin abstraction so we’re not locked into any particular SDK flavor.

type MCPToolCall = {
  server: string;              // server name, e.g., "filesystem", "pdf", "csv", "vector"
  tool: string;                // tool name on that server, e.g., "read_file", "parse_pdf"
  arguments: Record<string, any>;
};

type MCPResult = {
  ok: boolean;
  data?: any;
  error?: string;
};

interface MCPClient {
  call(t: MCPToolCall): Promise<MCPResult>;
}

class DummyMCPClient implements MCPClient {
  // Replace with a real MCP client. For now, this throws to force wiring in Cursor.
  async call(t: MCPToolCall): Promise<MCPResult> {
    throw new Error(
      `MCP call not wired. Tried ${t.server}.${t.tool} with args ${JSON.stringify(t.arguments)}`
    );
  }
}

// ------------------------------
// Models / LLM
// ------------------------------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function llmJSON<T>(system: string, user: string, schema: any): Promise<T> {
  // Ask Groq to emit strict JSON by describing the schema and instructing a JSON-only response.
  const messages = [
    { role: "system", content: `${system}\nYou must reply ONLY with minified JSON that matches this JSON Schema: ${JSON.stringify(schema)}` },
    { role: "user", content: user }
  ];

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    temperature: 0.1,
    response_format: { type: "json_object" }
  } as any);

  const txt = completion.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(txt) as T;
  } catch (e) {
    throw new Error(`Invalid JSON from model: ${txt}`);
  }
}

// ------------------------------
// Domain Contracts (AegisCycle)
// ------------------------------
// AegisCycle ingests cycle logs, wearable streams, and lab PDFs; outputs a clinician-ready packet + coaching tasks.
// We formalize IO so every layer/agent is testable.

export type CycleLog = {
  date: string;               // ISO date
  dayInCycle?: number;         // optional D1..Dxx
  symptoms?: string[];        // free-form or controlled vocab
  notes?: string;
};

export type WearableSample = {
  ts: string;                 // ISO timestamp
  hr?: number;                // bpm
  hrv?: number;               // ms
  temp?: number;              // degC delta
  sleepStage?: string;        // e.g., REM, deep, light
  steps?: number;
};

export type LabPanel = {
  source: string;             // file path or provider
  collectedAt?: string;
  markers: Record<string, { value: number; unit?: string; ref?: string }>; // e.g., E2, Prog, LH, FSH, TSH, Ferritin
};

export type Evidence = {
  id: string;
  kind: "cycle" | "wearable" | "lab" | "note" | "guideline" | "calc";
  summary: string;
  detail?: any;
  provenance?: { server?: string; tool?: string; uri?: string };
};

export type PlanItem = {
  id: string;
  type: "test" | "intervention" | "habit" | "referral" | "monitor";
  rationale: string;
  steps: string[];
  dependencies?: string[];
  risks?: string[];
};

export type ClinicianPacket = {
  executiveSummary: string;
  timelineHighlights: string[];
  flaggedFindings: string[];
  plan: PlanItem[];
  attachments: { title: string; path?: string; server?: string }[];
};

// ------------------------------
// 5-Layer Process Chain
// L1 Intake → L2 Normalize+Fuse → L3 Triage+Rules → L4 Plan → L5 QA+Packet
// ------------------------------

type L1_Intake_Out = {
  cycle: CycleLog[];
  wearable: WearableSample[];
  labs: LabPanel[];
  notes?: string[];
  evidence: Evidence[];
};

type L2_Fusion_Out = {
  fusedSignals: Evidence[]; // derived metrics, aligned timelines, windows around suspected ovulation, luteal phases, etc.
  evidence: Evidence[];
};

type L3_Triage_Out = {
  flags: string[];          // e.g., "luteal_phase_short", "irregular_cycles", "possible_thyroid_issue"
  priorities: string[];     // ordered
  evidence: Evidence[];
};

type L4_Plan_Out = {
  plan: PlanItem[];
  evidence: Evidence[];
};

type L5_Packet_Out = ClinicianPacket;

// ------------------------------
// Agent Specs (Roles, IO, Tools)
// ------------------------------

export const Agents = {
  L1_Intake: {
    role: "Intake Agent",
    input: "raw sources: CSV/JSON for cycle logs, wearable exports, lab PDFs",
    output: "normalized L1_Intake_Out",
    tools: ["filesystem.read_file", "csv.parse", "pdf.parse", "http.get"],
  },
  L2_Fusion: {
    role: "Fusion Agent",
    input: "L1_Intake_Out",
    output: "aligned signals + derived metrics",
    tools: ["vector.upsert", "vector.query", "sqlite.query"],
  },
  L3_Triage: {
    role: "Clinical Rules Agent",
    input: "L2_Fusion_Out",
    output: "flags + priority list",
    tools: ["sqlite.query", "filesystem.read_file"], // e.g., load rulesets
  },
  L4_Plan: {
    role: "Planning Agent",
    input: "L3_Triage_Out",
    output: "concrete plan items with rationale",
    tools: ["http.get", "calculator.eval", "vector.query"],
  },
  L5_QA: {
    role: "QA + Packet Agent",
    input: "L4_Plan_Out",
    output: "ClinicianPacket (markdown + attachments)",
    tools: ["filesystem.write_file", "pdf.render", "calendar.create_draft"],
  },
} as const;

// ------------------------------
// Schemas for strict JSON I/O
// ------------------------------

const L1_SCHEMA = {
  type: "object",
  properties: {
    cycle: { type: "array", items: { type: "object" } },
    wearable: { type: "array", items: { type: "object" } },
    labs: { type: "array", items: { type: "object" } },
    notes: { type: "array", items: { type: "string" }, nullable: true },
    evidence: { type: "array", items: { type: "object" } },
  },
  required: ["cycle", "wearable", "labs", "evidence"],
};

const L2_SCHEMA = {
  type: "object",
  properties: {
    fusedSignals: { type: "array", items: { type: "object" } },
    evidence: { type: "array", items: { type: "object" } },
  },
  required: ["fusedSignals", "evidence"],
};

const L3_SCHEMA = {
  type: "object",
  properties: {
    flags: { type: "array", items: { type: "string" } },
    priorities: { type: "array", items: { type: "string" } },
    evidence: { type: "array", items: { type: "object" } },
  },
  required: ["flags", "priorities", "evidence"],
};

const L4_SCHEMA = {
  type: "object",
  properties: {
    plan: { type: "array", items: { type: "object" } },
    evidence: { type: "array", items: { type: "object" } },
  },
  required: ["plan", "evidence"],
};

const L5_SCHEMA = {
  type: "object",
  properties: {
    executiveSummary: { type: "string" },
    timelineHighlights: { type: "array", items: { type: "string" } },
    flaggedFindings: { type: "array", items: { type: "string" } },
    plan: { type: "array", items: { type: "object" } },
    attachments: { type: "array", items: { type: "object" } },
  },
  required: [
    "executiveSummary",
    "timelineHighlights",
    "flaggedFindings",
    "plan",
    "attachments",
  ],
};

// ------------------------------
// Layer Implementations (LLM + MCP tools)
// ------------------------------

export class AegisCyclePipeline {
  constructor(private mcp: MCPClient = new DummyMCPClient()) {}

  async L1_Intake(context: { paths: string[] }): Promise<L1_Intake_Out> {
    // Sketch: read files via MCP servers, parse CSV/PDF, coerce into normalized JSON, return evidence.
    const system = `You are the Intake Agent. Tasks: read user-provided files (cycle logs CSV, wearable exports, lab PDFs), extract structured data, and normalize into CycleLog, WearableSample, LabPanel arrays. Provide concise Evidence entries summarizing each source.`;

    const user = `Files: ${JSON.stringify(context.paths)}. For CSV, infer headers; for PDFs, parse tabular lab markers. Return JSON per schema.`;

    return await llmJSON<L1_Intake_Out>(system, user, L1_SCHEMA);
  }

  async L2_Fusion(l1: L1_Intake_Out): Promise<L2_Fusion_Out> {
    const system = `You are the Fusion Agent. Align timelines, derive windows for follicular, ovulation, and luteal phases. Compute derived signals (e.g., HRV weekly z-score, temp deltas, luteal length estimate). Return fusedSignals as Evidence entries with clear summaries.`;
    const user = `Normalize and fuse: ${JSON.stringify(l1).slice(0, 10000)}...`; // truncate for safety
    return await llmJSON<L2_Fusion_Out>(system, user, L2_SCHEMA);
  }

  async L3_Triage(l2: L2_Fusion_Out): Promise<L3_Triage_Out> {
    const system = `You are the Clinical Rules Agent. Apply conservative, non-diagnostic rules to surface flags for reproductive longevity. Examples: luteal_phase_short (<10d for >=2 cycles), irregular_cycles (cycle length CV>0.2), possible_thyroid_issue (TSH out of ref), iron_deficiency_suspected (ferritin low). Rank priorities by potential impact and tractability. Avoid medical advice—just flags and priorities.`;
    const user = `Evidence: ${JSON.stringify(l2).slice(0, 10000)}...`;
    return await llmJSON<L3_Triage_Out>(system, user, L3_SCHEMA);
  }

  async L4_Plan(l3: L3_Triage_Out): Promise<L4_Plan_Out> {
    const system = `You are the Planning Agent. Generate plan items of types: test, intervention, habit, referral, monitor. Each needs rationale, concrete steps, and optional dependencies/risks. Source conservative guidelines where possible; attach citations as evidence entries. No diagnosis.`;
    const user = `Flags and priorities: ${JSON.stringify(l3).slice(0, 10000)}...`;
    return await llmJSON<L4_Plan_Out>(system, user, L4_SCHEMA);
  }

  async L5_QA(l4: L4_Plan_Out): Promise<L5_Packet_Out> {
    const system = `You are the QA + Packet Agent. Review internal consistency, remove speculative claims, and prepare a clinician-ready packet with exec summary, timeline highlights, flagged findings, and the plan. Suggest attachments like CSV extracts, plots, or lab tables (references only; file writing is handled by MCP tools upstream).`;
    const user = `Plan: ${JSON.stringify(l4).slice(0, 10000)}...`;
    return await llmJSON<L5_Packet_Out>(system, user, L5_SCHEMA);
  }

  async run(paths: string[]): Promise<ClinicianPacket> {
    const l1 = await this.L1_Intake({ paths });
    const l2 = await this.L2_Fusion(l1);
    const l3 = await this.L3_Triage(l2);
    const l4 = await this.L4_Plan(l3);
    const l5 = await this.L5_QA(l4);
    return l5;
  }
}

// ------------------------------
// Wiring in MCP tool calls (replace DummyMCPClient)
// ------------------------------
// In Cursor, configure your MCP servers. Then replace DummyMCPClient.call with real invocations.
// Example signatures you might expose and call during L1 (pseudocode):
//   mcp.call({ server: "filesystem", tool: "read_file", arguments: { path: "data/cycle.csv" }})
//   mcp.call({ server: "csv", tool: "parse", arguments: { content: "..." }})
//   mcp.call({ server: "pdf", tool: "parse", arguments: { path: "labs/lab1.pdf" }})
//   mcp.call({ server: "vector", tool: "upsert", arguments: { namespace: "aegis", items: [...] }})
// You can inject those results into the system/user prompts above for higher fidelity.

// ------------------------------
// CLI entry for local testing
// ------------------------------
// ES module equivalent of require.main === module
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
  process.argv[1]?.includes('aegiscycle.ts');
if (isMainModule) {
  (async () => {
    const files = process.argv.slice(2);
    if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
    if (files.length === 0) {
      console.error("Usage: ts-node aegiscycle.ts <file1> <file2> ...");
      process.exit(1);
    }

    const pipeline = new AegisCyclePipeline();
    const packet = await pipeline.run(files);
    const out = path.resolve("./out/clinician_packet.json");
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, JSON.stringify(packet, null, 2), "utf-8");
    console.log(`Wrote ${out}`);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

// ------------------------------
// Cursor MCP config sketch (place in .cursor/mcp.json or UI)
// ------------------------------
/*
{
  "mcpServers": {
    "filesystem": { "command": "mcp-filesystem", "args": ["--root", "/workspace"] },
    "csv": { "command": "mcp-csv" },
    "pdf": { "command": "mcp-pdf" },
    "vector": { "command": "mcp-vector", "env": { "DB_PATH": "./vector.db" } },
    "sqlite": { "command": "mcp-sqlite", "env": { "DB_FILE": "./rules.db" } },
    "http": { "command": "mcp-http" }
  }
}
*/

// ------------------------------
// Tests you should run in Cursor
// ------------------------------
// 1) Provide a sample cycle.csv, wearable.csv, lab.pdf
// 2) Run: GROQ_API_KEY=sk_... ts-node aegiscycle.ts data/cycle.csv data/wearable.csv data/lab.pdf
// 3) Inspect out/clinician_packet.json
// 4) Iterate: replace DummyMCPClient with your real client and plumb tool outputs into the prompts.
