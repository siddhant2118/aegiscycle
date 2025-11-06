from __future__ import annotations

from math import fabs
from typing import Any, Dict, List

from mcp.base import Node


class SignalAnalyzer(Node):
    """Transforms multimodal signals into clinical markers and drivers."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        labs: Dict[str, Any] = inputs.get("parsed_labs", {}) or {}
        cycle: Dict[str, Any] = inputs.get("normalized_cycle", {}) or {}
        wearable: Dict[str, Any] = inputs.get("clean_wearable", {}) or {}
        menopause: Dict[str, Any] | None = inputs.get("menopause_data")

        markers: Dict[str, float] = {}
        drivers: List[str] = []

        fg = labs.get("fasting_glucose")
        fi = labs.get("fasting_insulin")
        if fg is not None and fi is not None:
            homa_ir = (fg * fi) / 405
            markers["homa_ir"] = round(homa_ir, 2)
            if homa_ir >= 2.5:
                drivers.append(f"Insulin Resistance (HOMA-IR: {homa_ir:.2f})")

        tg = labs.get("triglycerides")
        hdl = labs.get("hdl")
        if tg is not None and hdl not in (None, 0):
            tg_hdl = tg / hdl
            markers["tg_hdl"] = round(tg_hdl, 2)
            if tg_hdl >= 3.0:
                drivers.append(f"Dyslipidemia (TG/HDL Ratio: {tg_hdl:.2f})")

        total_chol = labs.get("total_chol")
        if total_chol is not None and hdl is not None:
            non_hdl = total_chol - hdl
            markers["non_hdl"] = round(non_hdl, 2)
            if non_hdl >= 160:
                drivers.append(f"High Non-HDL Cholesterol ({non_hdl:.0f} mg/dL)")

        hs_crp = labs.get("hs_crp")
        if hs_crp is not None:
            markers["hs_crp"] = round(hs_crp, 2)
            if hs_crp >= 3.0:
                drivers.append(f"Systemic Inflammation (hs-CRP: {hs_crp:.1f} mg/L)")

        sleep_eff = wearable.get("sleep_eff")
        if sleep_eff is not None and sleep_eff < 0.85:
            drivers.append(f"Poor Sleep Efficiency ({sleep_eff * 100:.0f}%)")

        menopause_indicators = {
            "transition_risk": 0.0,
            "bone_risk": 0.0,
            "vms_burden": 0.2,
        }

        if menopause:
            cycle_length = cycle.get("average_length")
            if cycle_length and cycle_length > 45:
                menopause_indicators["transition_risk"] += 0.4

            night_spikes = menopause.get("night_temp_spikes")
            if night_spikes:
                menopause_indicators["transition_risk"] += 0.3

            fsh = labs.get("fsh")
            if fsh is not None and fsh > 25:
                menopause_indicators["transition_risk"] += 0.25

            vms = menopause.get("vms_per_day")
            if vms is not None:
                menopause_indicators["vms_burden"] = min(1.0, (vms / 10) * 0.75)
                if vms >= 8:
                    drivers.append("Severe Vasomotor Symptoms")

            dexas = menopause.get("dexas") or []
            t_score = dexas[0].get("t_score_spine") if dexas and isinstance(dexas[0], dict) else None
            if t_score is not None:
                menopause_indicators["bone_risk"] = min(1.0, (fabs(t_score) / 2.5) * 0.85)
                if t_score <= -2.0:
                    drivers.append("Osteopenia/Bone Risk")

        return {
            "risk_markers": markers,
            "drivers": drivers,
            "menopause_indicators": menopause_indicators,
        }
