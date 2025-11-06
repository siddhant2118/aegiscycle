from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


ALL_ACTIONS = [
    {
        "name": "Low-GI / DASH meal plan",
        "burden": "Medium",
        "rationale": "Improves glycemic control and insulin sensitivity.",
        "expected_delta": "-10% HOMA-IR",
    },
    {
        "name": "Mediterranean + lower-carb",
        "burden": "Medium",
        "rationale": "Reduces inflammation and improves lipid profiles.",
        "expected_delta": "-8% HOMA-IR, -5% TG/HDL",
    },
    {
        "name": "Higher-protein (isocaloric)",
        "burden": "Low",
        "rationale": "Enhances satiety and preserves lean mass during metabolic improvement.",
        "expected_delta": "Improved body composition",
    },
    {
        "name": "Aerobic 180 min/wk + 2–3× resistance",
        "burden": "High",
        "rationale": "Maximizes insulin sensitivity and cardiovascular health benefits.",
        "expected_delta": "-15% HOMA-IR",
    },
    {
        "name": "Sleep regularity + wind-down routine",
        "burden": "Low",
        "rationale": "Improves hormonal regulation and reduces cortisol levels.",
        "expected_delta": "+5% Sleep Efficiency, -5% hs-CRP",
    },
    {
        "name": "Time-restricted eating (8–10h window)",
        "burden": "Medium",
        "rationale": "May improve circadian rhythm and insulin sensitivity. Opt-in.",
        "expected_delta": "Variable, monitor closely",
    },
]

ALL_MENO_ACTIONS = [
    {
        "name": "Resistance training (2-3x/wk)",
        "burden": "Medium",
        "rationale": "Stimulates bone density and preserves lean muscle mass.",
        "expected_delta": "Maintain/improve T-score",
    },
    {
        "name": "Increase Protein Intake (~1.2g/kg)",
        "burden": "Low",
        "rationale": "Supports muscle protein synthesis and bone health.",
        "expected_delta": "Improved body composition",
    },
    {
        "name": "Cooling strategies & paced breathing",
        "burden": "Low",
        "rationale": "Manages vasomotor symptoms (VMS) and improves sleep onset.",
        "expected_delta": "-15% VMS frequency",
    },
    {
        "name": "Pelvic floor exercise program",
        "burden": "Medium",
        "rationale": "Improves genitourinary symptoms of menopause (GSM) and supports core stability.",
        "expected_delta": "Reduced GSM symptoms",
    },
]


class LifestyleRecommender(Node):
    """Generates first-line lifestyle recommendations based on risk level."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        risk = inputs.get("risk_result", {}) or {}
        drivers: List[str] = inputs.get("drivers", []) or []

        if risk.get("menopause_transition_risk") is not None:
            plan = self._plan_menopause(risk)
        else:
            plan = self._plan_reproductive(drivers)

        recommendations = [action["name"] for action in plan["actions"]]
        return {"plan": plan, "recommendations": recommendations}

    def _plan_reproductive(self, drivers: List[str]) -> Dict[str, Any]:
        actions: List[Dict[str, Any]] = []
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

        return {"actions": actions[:3], "next_review_days": 28}

    def _plan_menopause(self, risk: Dict[str, Any]) -> Dict[str, Any]:
        actions: List[Dict[str, Any]] = []
        if risk.get("bone_risk", 0.0) >= 0.5:
            actions.extend([ALL_MENO_ACTIONS[0], ALL_MENO_ACTIONS[1]])
        if risk.get("vms_burden", 0.0) >= 0.4:
            actions.append(ALL_MENO_ACTIONS[2])
        actions.append(ALL_MENO_ACTIONS[3])
        return {"actions": actions[:3], "next_review_days": 45}
