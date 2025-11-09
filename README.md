# AegisCycle: Agentic AI for Reproductive Longevity

**AegisCycle** is a web application demonstrating an agentic AI copilot designed to proactively manage PCOS, Endometriosis, and Menopause. Its mission is to extend female reproductive longevity and safeguard long-term health through early detection and adaptive management.

This is not just a symptom tracker or a chatbot—it's a proof-of-concept for a lifelong health copilot that works 24/7 to analyze health data, create personalized plans, and bridge the communication gap between patients and clinicians.

## ✨ Key Features

- **Agentic AI Pipeline**: A multi-agent system that continuously ingests, analyzes, and acts on health data.
- **Personalized Dashboards**: A user-friendly interface that visualizes risks, focus areas, and actionable plans.
- **Evidence-Based Risk Scoring**: Quantifies risk for PCOS, Endometriosis, and Menopause-related conditions using mock data based on clinical biomarkers.
- **Adaptive Action Plans**: Generates personalized lifestyle interventions (diet, exercise, sleep) that adapt over time.
- **Clinician Escalation**: Autonomously identifies when clinical thresholds are met and prepares a concise "Clinician Pack" to streamline appointments.
- **Dual Demo Modes**: Includes a user-friendly **Dashboard Demo** for showcasing the end-user experience and a **Technical Demo** for developers to inspect the JSON data and agent outputs.

## 🚀 How to Run the Demo

### Frontend (Vite + PNPM)

```bash
cd frontend
pnpm install
pnpm dev
```

Then open http://localhost:5173/ to explore the UI:
- The **User Demo** (`/demo`) is the best place to start for an overview of the user experience.
- The **Technical Demo** (`/technical-demo`) allows you to see the underlying JSON data and the direct inputs/outputs of the AI agents.

## 🔧 Configuration (Mock vs. Live API)

AegisCycle is designed to work in two modes:

-   **Mock Mode (Default)**: Uses local mock functions from `frontend/src/lib/mock.ts` to simulate the AI agent's responses. This allows the demo to run without a backend.
-   **Live API Mode**: Makes live HTTP requests to a configured backend. This is disabled by default.

### Backend service

The repository now includes a FastAPI backend scaffold under `backend/`. It mirrors the mock logic by default and can proxy to a Dedalus deployment when `DEDALUS_API_BASE` is set.

To run it locally:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Configure environment variables by copying `backend/.env.example` to `backend/.env` and inserting your Dedalus deployment values once you have them.

Edit `frontend/src/lib/config.local.ts` (or create a compatible env file) to point `API_BASE` at the running backend, then disable mock mode inside the technical demo to test live calls.

To enable Live API mode, you would configure the `API_BASE` constant in `frontend/src/lib/api.ts` with your API's URL.

```typescript
// in frontend/src/lib/api.ts
const API_BASE = "https://your-api.com/v1"; // Set to a URL to enable live mode
```

## 📂 Project Structure

-   `frontend/`: Vite + React UI
    -   `src/components`: Reusable UI components, such as `Card`, `Button`, and `RiskGauge`.
    -   `src/pages`: Route-level pages for the marketing + demo experiences.
    -   `src/lib`: Mock data, API helper, and shared utilities.
    -   `src/hooks` / `src/contexts`: Theme + toast providers.
    -   `src/types.ts`: TypeScript interfaces for the data models (Intake, RiskResult, etc.).
    -   `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`: Frontend entrypoint + tooling.
-   `backend/`: FastAPI service that can mirror the mock logic locally or proxy to Dedalus.

---

*This application is for demonstration purposes only and does not constitute medical advice.*
