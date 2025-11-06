from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class ClinicianPackMaker(Node):
    """Compiles escalation-ready summary artifacts for clinicians."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        risk = inputs.get("risk_result", {}) or {}
        patterns: List[Dict[str, Any]] = inputs.get("patterns", []) or []
        drivers: List[str] = inputs.get("drivers", []) or []

        reasons = self._derive_reasons(risk, patterns, drivers)
        triggered = bool(reasons)

        pack = {
            "summary": "Escalation recommended based on elevated risk markers." if triggered else "Monitoring continued.",
            "highlights": [p.get("name", "unknown") for p in patterns if p.get("score", 0.0) >= 0.6],
            "drivers": drivers,
            "next_steps": ["Order confirmatory labs", "Prepare clinician briefing"] if triggered else ["Reassess in 8 weeks"],
        }
        escalation = {
            "triggered": triggered,
            "reasons": reasons,
            "pack_url": "/docs/clinician_pack_demo.pdf" if triggered else None,
        }
        return {"clinician_pack": pack, "escalation": escalation}

    def _derive_reasons(
        self,
        risk: Dict[str, Any],
        patterns: List[Dict[str, Any]],
        drivers: List[str],
    ) -> List[str]:
        reasons: List[str] = []
        if risk.get("pcos_risk", 0.0) >= 0.75:
            reasons.append("Metabolic markers exceed safe thresholds.")
        pelvic = next((p for p in patterns if p.get("name") == "pelvic_pain"), None)
        if pelvic and pelvic.get("score", 0.0) >= 0.7:
            reasons.append("Severe pelvic pain trend detected.")
        if risk.get("bone_risk", 0.0) >= 0.6:
            reasons.append("Bone density decline requires intervention.")
        if risk.get("menopause_transition_risk", 0.0) >= 0.7:
            reasons.append("Late menopausal transition signals escalation.")
        if "Systemic Inflammation" in " ".join(drivers):
            reasons.append("Chronic inflammation persists despite lifestyle plan.")
        return reasons
