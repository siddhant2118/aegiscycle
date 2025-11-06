from __future__ import annotations

from statistics import mean
from typing import Any, Dict, List

from mcp.base import Node


class CycleParser(Node):
    """Normalizes raw cycle tracking logs."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        cycles: List[Dict[str, Any]] = inputs.get("cycle_logs", []) or []
        if not cycles:
            return {"normalized_cycle": {"average_length": None, "bleed_days": None, "pain_max": None}}

        lengths = [cycle.get("length") for cycle in cycles if cycle.get("length") is not None]
        bleed_days = [cycle.get("bleed_days") for cycle in cycles if cycle.get("bleed_days") is not None]
        pain_scores = [cycle.get("pain_max") for cycle in cycles if cycle.get("pain_max") is not None]

        normalized = {
            "average_length": mean(lengths) if lengths else None,
            "bleed_days": mean(bleed_days) if bleed_days else None,
            "pain_max": max(pain_scores) if pain_scores else None,
        }
        return {"normalized_cycle": normalized}
