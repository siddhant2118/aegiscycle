from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict

import httpx
from dotenv import load_dotenv

from config import Settings, get_settings
from models import Escalation, Intake, Plan, RiskResult
from pipeline.mock import mock_escalation, mock_plan, mock_risk


# Always load the backend-local .env so uvicorn can be started from the repo root.
ENV_PATH = (Path(__file__).resolve().parents[1] / ".env").resolve()
load_dotenv(ENV_PATH)


class PipelineService:
    """
    Provides the three pipeline operations required by the FastAPI routes.

    When DEDALUS_API_BASE is set the service forwards requests to that remote
    deployment; otherwise it mirrors the deterministic mock logic that powers
    the frontend demo.
    """

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self._remote_base = (
            self.settings.dedalus_api_base.rstrip("/")
            if self.settings.dedalus_api_base
            else None
        )
        self._headers: Dict[str, str] = {}
        api_key = self.settings.dedalus_api_key or os.getenv("DEDALUS_API_KEY")
        if api_key:
            self._headers["Authorization"] = f"Bearer {api_key}"

    def _using_remote(self) -> bool:
        return bool(self._remote_base)

    def _build_payload(self, intake: Intake) -> Dict[str, Any]:
        return {"intake": intake.model_dump(by_alias=True)}

    async def _post_remote(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self._remote_base:
            raise RuntimeError("Remote Dedalus pipeline is not configured.")

        url_path = path if path.startswith("/") else f"/{path}"
        async with httpx.AsyncClient(
            base_url=self._remote_base,
            headers=self._headers,
            timeout=30.0,
        ) as client:
            response = await client.post(url_path, json=payload)
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:  # pragma: no cover - passthrough
                status = exc.response.status_code
                body = exc.response.text
                raise RuntimeError(
                    f"Dedalus proxy request failed ({status}): {body}"
                ) from exc
            return response.json()

    async def score_risk(self, intake: Intake) -> RiskResult:
        if self._using_remote():
            data = await self._post_remote("/risk/score", self._build_payload(intake))
            return RiskResult.model_validate(data)
        return mock_risk(intake)

    async def generate_plan(self, intake: Intake) -> Plan:
        if self._using_remote():
            data = await self._post_remote("/plan/generate", self._build_payload(intake))
            return Plan.model_validate(data)
        return mock_plan(intake)

    async def check_escalation(self, intake: Intake) -> Escalation:
        if self._using_remote():
            data = await self._post_remote(
                "/escalate/check", self._build_payload(intake)
            )
            return Escalation.model_validate(data)
        return mock_escalation(intake)
