from __future__ import annotations

from typing import List

from ..models import Intake, Plan, PlanAction, RiskResult, Escalation


ALL_ACTIONS: List[PlanAction] = [
    PlanAction(
        name="Low-GI / DASH meal plan",
        burden="Medium",
        rationale="Improves glycemic control and insulin sensitivity.",
        expected_delta="-10% HOMA-IR",
    ),
    PlanAction(
        name="Mediterranean + lower-carb",
        burden="Medium",
        rationale="Reduces inflammation and improves lipid profiles.",
        expected_delta="-8% HOMA-IR, -5% TG/HDL",
    ),
    PlanAction(
        name="Higher-protein (isocaloric)",
        burden="Low",
        rationale="Enhances satiety and preserves lean mass during metabolic improvement.",
        expected_delta="Improved body composition",
    ),
    PlanAction(
        name="Aerobic 180 min/wk + 2–3× resistance",
        burden="High",
        rationale="Maximizes insulin sensitivity and cardiovascular health benefits.",
        expected_delta="-15% HOMA-IR",
    ),
    PlanAction(
        name="Sleep regularity + wind-down routine",
        burden="Low",
        rationale="Improves hormonal regulation and reduces cortisol levels.",
        expected_delta="+5% Sleep Efficiency, -5% hs-CRP",
    ),
    PlanAction(
        name="Time-restricted eating (8–10h window)",
        burden="Medium",
        rationale="May improve circadian rhythm and insulin sensitivity. Opt-in.",
        expected_delta="Variable, monitor closely",
    ),
]

ALL_MENO_ACTIONS: List[PlanAction] = [
    PlanAction(
        name="Resistance training (2-3x/wk)",
        burden="Medium",
        rationale="Stimulates bone density and preserves lean muscle mass.",
        expected_delta="Maintain/improve T-score",
    ),
    PlanAction(
        name="Increase Protein Intake (~1.2g/kg)",
        burden="Low",
        rationale="Supports muscle protein synthesis and bone health.",
        expected_delta="Improved body composition",
    ),
    PlanAction(
        name="Cooling strategies & paced breathing",
        burden="Low",
        rationale="Manages vasomotor symptoms (VMS) and improves sleep onset.",
        expected_delta="-15% VMS frequency",
    ),
    PlanAction(
        name="Pelvic floor exercise program",
        burden="Medium",
        rationale="Improves genitourinary symptoms of menopause (GSM) and supports core stability.",
        expected_delta="Reduced GSM symptoms",
    ),
]


def _calculate_drivers(intake: Intake) -> List[str]:
    drivers: List[str] = []
    latest_labs = intake.labs[0] if intake.labs else None
    latest_vitals = intake.vitals[0] if intake.vitals else None

    if latest_labs:
        fg = latest_labs.fasting_glucose
        fi = latest_labs.fasting_insulin
        if fg is not None and fi is not None:
            homa_ir = (fg * fi) / 405
            if homa_ir >= 2.5:
                drivers.append(f"Insulin Resistance (HOMA-IR: {homa_ir:.2f})")

        tg = latest_labs.tg
        hdl = latest_labs.hdl
        if tg is not None and hdl is not None and hdl != 0:
            tg_hdl = tg / hdl
            if tg_hdl >= 3.0:
                drivers.append(f"Dyslipidemia (TG/HDL Ratio: {tg_hdl:.2f})")

        total_chol = latest_labs.total_chol
        if total_chol is not None and hdl is not None:
            non_hdl = total_chol - hdl
            if non_hdl >= 160:
                drivers.append(f"High Non-HDL Cholesterol ({non_hdl} mg/dL)")

        hs_crp = latest_labs.hs_crp
        if hs_crp is not None and hs_crp >= 3.0:
            drivers.append(f"Systemic Inflammation (hs-CRP: {hs_crp} mg/L)")

    if latest_vitals and latest_vitals.sleep_eff is not None:
        if latest_vitals.sleep_eff < 0.85:
            drivers.append(f"Poor Sleep Efficiency ({latest_vitals.sleep_eff * 100:.0f}%)")

    return drivers


def _calculate_menopause_drivers(intake: Intake) -> List[str]:
    drivers: List[str] = []
    first_cycle = intake.cycles[0] if intake.cycles else None
    if first_cycle and first_cycle.length > 60:
        drivers.append("Cycle Variability ↑")

    menopause = intake.menopause
    if menopause:
        if menopause.night_temp_spikes and menopause.night_temp_spikes > 1:
            drivers.append("Temp Spikes ↑")
        if menopause.vms_per_day and menopause.vms_per_day > 0:
            drivers.append("VMS Burden")
        if menopause.dexas and menopause.dexas[0].t_score_spine is not None:
            if menopause.dexas[0].t_score_spine <= -2.0:
                drivers.append("Osteopenia/Bone Risk")

    latest_vitals = intake.vitals[0] if intake.vitals else None
    if latest_vitals and latest_vitals.sleep_eff is not None:
        if latest_vitals.sleep_eff < 0.8:
            drivers.append("Sleep Fragmentation")

    return drivers


def mock_risk(intake: Intake) -> RiskResult:
    if intake.menopause:
        menopause = intake.menopause
        first_cycle = intake.cycles[0] if intake.cycles else None
        latest_dexa = menopause.dexas[0] if menopause.dexas else None

        bone_risk = 0.4
        if latest_dexa and latest_dexa.t_score_spine is not None:
            bone_risk = (abs(latest_dexa.t_score_spine) / 2.5) * 0.85

        vms_burden = 0.2
        if menopause.vms_per_day is not None:
            vms_burden = (menopause.vms_per_day / 10) * 0.75

        transition_risk = 0.0
        if first_cycle and first_cycle.length > 45:
            transition_risk += 0.4
        if menopause.night_temp_spikes:
            transition_risk += 0.3
        latest_labs = intake.labs[0] if intake.labs else None
        if latest_labs and latest_labs.fsh is not None and latest_labs.fsh > 25:
            transition_risk += 0.25

        return RiskResult(
            pcos_risk=0.0,
            endo_risk=0.0,
            uncertainty=0.2,
            drivers=_calculate_menopause_drivers(intake),
            menopause_transition_risk=min(1.0, transition_risk),
            bone_risk=min(1.0, bone_risk),
            vms_burden=min(1.0, vms_burden),
        )

    drivers = _calculate_drivers(intake)
    first_cycle = intake.cycles[0] if intake.cycles else None

    pcos_risk = 0.65 + (len(drivers) * 0.05)
    endo_risk = 0.30
    if first_cycle and first_cycle.pain_max is not None and first_cycle.pain_max > 6:
        endo_risk += 0.15

    labs_inputs = len([value for value in (intake.labs[0].dict(exclude_none=True) if intake.labs else {}).values()])
    vitals_inputs = len([value for value in (intake.vitals[0].dict(exclude_none=True) if intake.vitals else {}).values()])
    available_inputs = max(0, labs_inputs - 1) + max(0, vitals_inputs - 1)
    uncertainty = max(0.0, min(1.0, 1 - (available_inputs / 5)))

    return RiskResult(
        pcos_risk=min(0.95, pcos_risk),
        endo_risk=min(0.9, endo_risk),
        uncertainty=uncertainty,
        drivers=drivers,
    )


def mock_plan(intake: Intake) -> Plan:
    if intake.menopause:
        menopause = intake.menopause
        actions: List[PlanAction] = []
        if menopause and menopause.dexas and menopause.dexas[0].t_score_spine is not None:
            if menopause.dexas[0].t_score_spine <= -2.0:
                actions.extend([ALL_MENO_ACTIONS[0], ALL_MENO_ACTIONS[1]])
        if menopause and menopause.vms_per_day and menopause.vms_per_day > 5:
            actions.append(ALL_MENO_ACTIONS[2])
        actions.append(ALL_MENO_ACTIONS[3])
        return Plan(actions=actions[:3], next_review_days=45)

    drivers = _calculate_drivers(intake)
    actions: List[PlanAction] = []

    if any("Insulin Resistance" in driver for driver in drivers):
        actions.append(ALL_ACTIONS[0])
    if any("Dyslipidemia" in driver for driver in drivers):
        actions.append(ALL_ACTIONS[1])
    if any("Inflammation" in driver for driver in drivers):
        actions.append(ALL_ACTIONS[3])
    if any("Sleep" in driver for driver in drivers):
        actions.append(ALL_ACTIONS[4])

    if not actions:
        actions.extend([ALL_ACTIONS[0], ALL_ACTIONS[3]])

    return Plan(actions=actions[:3], next_review_days=28)


def mock_escalation(intake: Intake) -> Escalation:
    reasons: List[str] = []

    if intake.menopause:
        menopause = intake.menopause
        if menopause.postmenopausal_bleeding:
            reasons.append("Postmenopausal bleeding requires investigation.")
        if menopause.dexas and menopause.dexas[0].t_score_spine is not None:
            if menopause.dexas[0].t_score_spine <= -2.5:
                reasons.append("DEXA T-score indicates osteoporosis (T ≤ -2.5).")
        if menopause.vms_per_day and menopause.vms_per_day >= 8:
            reasons.append("Severe VMS / insomnia impacting quality of life.")

        return Escalation(triggered=bool(reasons), reasons=reasons, pack_url="/docs/clinician_pack_demo.pdf")

    latest_labs = intake.labs[0] if intake.labs else None
    latest_cycle = intake.cycles[0] if intake.cycles else None

    if latest_labs:
        fg = latest_labs.fasting_glucose
        fi = latest_labs.fasting_insulin
        if fg is not None and fi is not None:
            homa_ir = (fg * fi) / 405
            if homa_ir >= 3.0:
                reasons.append("Severe Insulin Resistance (HOMA-IR ≥ 3.0)")

        total_chol = latest_labs.total_chol
        hdl = latest_labs.hdl
        if total_chol is not None and hdl is not None:
            non_hdl = total_chol - hdl
            if non_hdl >= 160:
                reasons.append("High Atherogenic Risk (non-HDL-C ≥ 160 mg/dL)")

        hs_crp = latest_labs.hs_crp
        if hs_crp is not None and hs_crp >= 3.0:
            reasons.append("High Systemic Inflammation (hs-CRP ≥ 3.0 mg/L)")

    if latest_cycle and latest_cycle.pain_max is not None and latest_cycle.pain_max >= 7:
        reasons.append("Severe Dysmenorrhea (Pain ≥ 7/10)")

    return Escalation(triggered=bool(reasons), reasons=reasons, pack_url="/docs/clinician_pack_demo.pdf")
