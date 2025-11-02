from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class Labs(BaseModel):
    date: str
    fasting_glucose: Optional[float] = None
    fasting_insulin: Optional[float] = None
    ogtt_60_glucose: Optional[float] = None
    insulin_auc: Optional[float] = None
    tg: Optional[float] = None
    hdl: Optional[float] = None
    total_chol: Optional[float] = None
    non_hdl: Optional[float] = None
    hs_crp: Optional[float] = None
    fsh: Optional[float] = None
    estradiol: Optional[float] = None
    amh: Optional[float] = None


class Vitals(BaseModel):
    date: str
    rhr: Optional[float] = None
    hrv: Optional[float] = None
    sleep_eff: Optional[float] = None
    steps: Optional[int] = None


class CycleEvent(BaseModel):
    start: str
    length: float
    bleed_days: float
    pain_max: Optional[float] = None


class DexaReading(BaseModel):
    date: str
    t_score_spine: Optional[float] = None
    t_score_hip: Optional[float] = None


class MenopauseIntake(BaseModel):
    vms_per_day: Optional[float] = None
    night_temp_spikes: Optional[float] = None
    abnormal_bleeding: Optional[bool] = None
    postmenopausal_bleeding: Optional[bool] = None
    dexas: Optional[List[DexaReading]] = None


class Intake(BaseModel):
    labs: List[Labs]
    vitals: List[Vitals]
    cycles: List[CycleEvent]
    bmi: Optional[float] = None
    phenotype: Optional[str] = None
    menopause: Optional[MenopauseIntake] = None


class PlanAction(BaseModel):
    name: str
    burden: str
    rationale: str
    expected_delta: str = Field(alias="expected_delta")

    class Config:
        allow_population_by_field_name = True


class Plan(BaseModel):
    actions: List[PlanAction]
    next_review_days: int


class RiskResult(BaseModel):
    pcos_risk: float
    endo_risk: float
    uncertainty: float
    drivers: List[str]
    menopause_transition_risk: Optional[float] = None
    bone_risk: Optional[float] = None
    vms_burden: Optional[float] = None


class Escalation(BaseModel):
    triggered: bool
    reasons: List[str]
    pack_url: Optional[str] = None


class IntakeRequest(BaseModel):
    intake: Intake

