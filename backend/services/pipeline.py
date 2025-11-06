from __future__ import annotations

import httpx
from typing import Any, Dict

from ..config import get_settings
from ..models import Intake, Plan, RiskResult, Escalation
from ..pipeline import mock
from .mcp_adapter import run_dedalus_pipeline


class PipelineService:
    """
    Orchestrates calls to either the local mock pipeline or a remote Dedalus instance.

    This keeps the FastAPI routes agnostic of the execution mode.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._remote_base = settings.dedalus_api_base
        self._remote_headers: Dict[str, str] = {}
        if settings.dedalus_api_key:
            self._remote_headers["Authorization"] = f"Bearer {settings.dedalus_api_key}"

    @property
    def is_remote(self) -> bool:
        return bool(self._remote_base)

    async def _call_remote(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self._remote_base:
            raise RuntimeError("Remote pipeline requested but DEDALUS_API_BASE is not set.")

        async with httpx.AsyncClient(base_url=self._remote_base, timeout=30.0) as client:
            response = await client.post(path, json=payload, headers=self._remote_headers)
            response.raise_for_status()
            return response.json()

    async def score_risk(self, intake: Intake) -> RiskResult:
        if self.is_remote:
            data = await self._call_remote("/risk/score", {"intake": intake.model_dump(by_alias=True)})
            return RiskResult.model_validate(data)
        try:
            outputs = run_dedalus_pipeline(intake)
        except Exception:
            return mock.mock_risk(intake)
        return outputs["risk"]

    async def generate_plan(self, intake: Intake) -> Plan:
        if self.is_remote:
            data = await self._call_remote("/plan/generate", {"intake": intake.model_dump(by_alias=True)})
            return Plan.model_validate(data)
        try:
            outputs = run_dedalus_pipeline(intake)
        except Exception:
            return mock.mock_plan(intake)
        return outputs["plan"]

    async def check_escalation(self, intake: Intake) -> Escalation:
        if self.is_remote:
            data = await self._call_remote("/escalate/check", {"intake": intake.model_dump(by_alias=True)})
            return Escalation.model_validate(data)
        try:
            outputs = run_dedalus_pipeline(intake)
        except Exception:
            return mock.mock_escalation(intake)
        return outputs["escalation"]
