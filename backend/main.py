from __future__ import annotations

from functools import lru_cache
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .models import Escalation, IntakeRequest, Plan, RiskResult
from .services.pipeline import PipelineService


@lru_cache()
def get_pipeline() -> PipelineService:
    return PipelineService()


app = FastAPI(title="AegisCycle Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    settings = get_settings()
    mode = "remote" if settings.dedalus_api_base else "mock"
    return {"status": "ok", "mode": mode}


@app.post("/risk/score", response_model=RiskResult)
async def score_risk(
    request: IntakeRequest, pipeline: PipelineService = Depends(get_pipeline)
) -> RiskResult:
    return await pipeline.score_risk(request.intake)


@app.post("/plan/generate", response_model=Plan)
async def generate_plan(
    request: IntakeRequest, pipeline: PipelineService = Depends(get_pipeline)
) -> Plan:
    return await pipeline.generate_plan(request.intake)


@app.post("/escalate/check", response_model=Escalation)
async def check_escalation(
    request: IntakeRequest, pipeline: PipelineService = Depends(get_pipeline)
) -> Escalation:
    return await pipeline.check_escalation(request.intake)

