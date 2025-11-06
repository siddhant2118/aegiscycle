from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class LabReader(Node):
    """Extracts key biomarkers from lab documents."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        labs: List[Dict[str, Any]] = inputs.get("lab_results", []) or []
        if not labs:
            return {"parsed_labs": {"available": 0}}

        latest = labs[0]
        parsed = {
            "fasting_glucose": latest.get("fasting_glucose"),
            "fasting_insulin": latest.get("fasting_insulin"),
            "hdl": latest.get("hdl"),
            "triglycerides": latest.get("tg") or latest.get("triglycerides"),
            "total_chol": latest.get("total_chol"),
            "hs_crp": latest.get("hs_crp"),
            "fsh": latest.get("fsh"),
            "estradiol": latest.get("estradiol"),
            "amh": latest.get("amh"),
            "available": len([value for value in latest.values() if value is not None]),
        }
        return {"parsed_labs": parsed}
