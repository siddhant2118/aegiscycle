from __future__ import annotations

from typing import Any, Dict, List

from mcp.base import Node


class FeedbackLoop(Node):
    """Applies user feedback to adjust downstream policy weights."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        recommendations: List[str] = inputs.get("recommendations", [])
        feedback = inputs.get("user_feedback", {"adherence": 0.8})
        policy_update = {
            "adherence": feedback.get("adherence", 1.0),
            "reinforce": [rec for rec in recommendations if feedback.get("adherence", 1.0) >= 0.7],
        }
        return {"policy_update": policy_update}
