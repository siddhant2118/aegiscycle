from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class Notifier(Node):
    """Produces a notification payload delivered to end users."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        plan: Dict[str, Any] = inputs.get("plan", {}) or {}
        actions: List[Dict[str, Any]] = plan.get("actions", []) or []
        message = "Agent update ready."
        if actions:
            message = f"Agent prepared {len(actions)} recommendations."
        notification = {"message": message, "items": [action.get("name") for action in actions]}
        return {"notification": notification}
