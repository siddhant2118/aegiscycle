from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class IntakeRouter(Node):
    """Splits the intake payload into the modalities consumed by the graph."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        intake: Dict[str, Any] = inputs.get("intake", {}) or {}
        cycles: List[Dict[str, Any]] = intake.get("cycles", []) or []
        vitals: List[Dict[str, Any]] = intake.get("vitals", []) or []
        labs: List[Dict[str, Any]] = intake.get("labs", []) or []
        menopause = intake.get("menopause")

        return {
            "cycle_logs": cycles,
            "wearable_data": vitals,
            "lab_results": labs,
            "menopause_data": menopause,
        }
