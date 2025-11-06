from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class PatternCorrelator(Node):
    """Maps risk markers to interpretable patterns."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        markers: Dict[str, float] = inputs.get("risk_markers", {}) or {}
        drivers: List[str] = inputs.get("drivers", []) or []
        cycle: Dict[str, Any] = inputs.get("normalized_cycle", {}) or {}
        menopause = inputs.get("menopause_data")

        patterns: List[Dict[str, Any]] = []

        homa_ir = markers.get("homa_ir")
        if homa_ir is not None:
            patterns.append({"name": "metabolic_instability", "score": min(1.0, homa_ir / 4.0)})

        tg_hdl = markers.get("tg_hdl")
        if tg_hdl is not None:
            patterns.append({"name": "lipid_disruption", "score": min(1.0, tg_hdl / 4.0)})

        hs_crp = markers.get("hs_crp")
        if hs_crp is not None:
            patterns.append({"name": "inflammation_signal", "score": min(1.0, hs_crp / 5.0)})

        pain_max = cycle.get("pain_max")
        if pain_max is not None:
            patterns.append({"name": "pelvic_pain", "score": min(1.0, pain_max / 10.0)})

        if menopause:
            indicators = inputs.get("menopause_indicators", {}) or {}
            patterns.append(
                {
                    "name": "menopause_transition",
                    "score": min(1.0, indicators.get("transition_risk", 0.0)),
                }
            )
            patterns.append(
                {"name": "bone_risk", "score": min(1.0, indicators.get("bone_risk", 0.0))}
            )
        else:
            indicators = inputs.get("menopause_indicators", {}) or {}

        return {
            "patterns": patterns,
            "drivers": drivers,
            "menopause_indicators": indicators,
        }
