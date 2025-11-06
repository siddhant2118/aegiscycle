from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

from mcp import MCPRuntime
from mcp.utils import load_config

from ..models import Escalation, Intake, Plan, RiskResult


@lru_cache()
def _get_runtime() -> MCPRuntime:
    root_dir = Path(__file__).resolve().parents[2]
    config_path = root_dir / "mcp" / "config.yaml"
    config = load_config(config_path)
    return MCPRuntime(config)


def run_dedalus_pipeline(intake: Intake) -> Dict[str, Any]:
    runtime = _get_runtime()
    payload = {
        "intake": intake.model_dump(by_alias=True),
        "user_feedback": {"adherence": 0.8},
    }
    outputs = runtime.trigger(event_name="intake_update", payload=payload)

    risk = outputs.get("risk_result")
    plan = outputs.get("plan")
    escalation = outputs.get("escalation")

    if not (risk and plan and escalation):
        raise RuntimeError("MCP pipeline did not produce the expected outputs.")

    return {
        "risk": RiskResult.model_validate(risk),
        "plan": Plan.model_validate(plan),
        "escalation": Escalation.model_validate(escalation),
    }
