from __future__ import annotations

from typing import Any, Dict, List, Optional

from mcp.base import Node


class RiskClassifier(Node):
    """Aggregates pattern evidence into structured risk outputs."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        patterns: List[Dict[str, Any]] = inputs.get("patterns", []) or []
        drivers: List[str] = inputs.get("drivers", []) or []
        menopause_indicators: Dict[str, float] = inputs.get("menopause_indicators", {}) or {}
        labs: Dict[str, Any] = inputs.get("parsed_labs", {}) or {}
        wearable: Dict[str, Any] = inputs.get("clean_wearable", {}) or {}
        cycle: Dict[str, Any] = inputs.get("normalized_cycle", {}) or {}
        menopause = inputs.get("menopause_data")

        if menopause:
            risk_result = self._classify_menopause(drivers, menopause_indicators)
        else:
            risk_result = self._classify_reproductive(drivers, patterns, labs, wearable, cycle)

        return {"risk_result": risk_result}

    def _classify_reproductive(
        self,
        drivers: List[str],
        patterns: List[Dict[str, Any]],
        labs: Dict[str, Any],
        wearable: Dict[str, Any],
        cycle: Dict[str, Any],
    ) -> Dict[str, Any]:
        pcos_risk = 0.65 + (len(drivers) * 0.05)
        endo_risk = 0.30

        pelvic_pattern: Optional[Dict[str, Any]] = next(
            (p for p in patterns if p.get("name") == "pelvic_pain"), None
        )
        pain_max = cycle.get("pain_max")
        if pelvic_pattern and pelvic_pattern.get("score", 0.0) >= 0.6:
            endo_risk += 0.15
        elif pain_max is not None and pain_max > 6:
            endo_risk += 0.15

        labs_inputs = len(
            [
                key
                for key in ("fasting_glucose", "fasting_insulin", "hdl", "triglycerides", "total_chol", "hs_crp")
                if labs.get(key) is not None
            ]
        )
        vitals_inputs = len([value for value in (wearable.get("rhr"), wearable.get("hrv"), wearable.get("sleep_eff")) if value is not None])
        available_inputs = max(0, labs_inputs - 1) + max(0, vitals_inputs - 1)
        uncertainty = max(0.0, min(1.0, 1 - (available_inputs / 5)))

        return {
            "pcos_risk": min(0.95, pcos_risk),
            "endo_risk": min(0.9, endo_risk),
            "uncertainty": uncertainty,
            "drivers": drivers,
        }

    def _classify_menopause(
        self,
        drivers: List[str],
        indicators: Dict[str, float],
    ) -> Dict[str, Any]:
        transition = min(1.0, indicators.get("transition_risk", 0.0))
        bone_risk = min(1.0, indicators.get("bone_risk", 0.0))
        vms_burden = min(1.0, indicators.get("vms_burden", 0.2))

        return {
            "pcos_risk": 0.0,
            "endo_risk": 0.0,
            "uncertainty": 0.2,
            "drivers": drivers,
            "menopause_transition_risk": transition,
            "bone_risk": bone_risk,
            "vms_burden": vms_burden,
        }
