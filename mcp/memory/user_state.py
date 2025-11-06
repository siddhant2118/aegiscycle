from __future__ import annotations

from typing import Any, Dict


class UserStateStore:
    """In-memory scratchpad for user-specific facts."""

    def __init__(self) -> None:
        self._state: Dict[str, Any] = {}

    def get(self, key: str, default: Any = None) -> Any:
        return self._state.get(key, default)

    def update(self, values: Dict[str, Any]) -> None:
        self._state.update(values)
