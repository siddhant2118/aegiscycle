from __future__ import annotations

from statistics import mean
from typing import Any, Dict, List

from mcp.base import Node


class SensorIngest(Node):
    """Cleans wearable telemetry into a harmonized structure."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        vitals: List[Dict[str, Any]] = inputs.get("wearable_data", []) or []
        if not vitals:
            return {"clean_wearable": {"rhr": None, "hrv": None, "sleep_eff": None, "available": 0}}

        def collect(key: str):
            values = [item.get(key) for item in vitals if item.get(key) is not None]
            return values

        rhr_values = collect("rhr")
        hrv_values = collect("hrv")
        sleep_values = collect("sleep_eff")

        cleaned = {
            "rhr": mean(rhr_values) if rhr_values else None,
            "hrv": mean(hrv_values) if hrv_values else None,
            "sleep_eff": mean(sleep_values) if sleep_values else None,
            "available": len(vitals),
        }
        return {"clean_wearable": cleaned}
