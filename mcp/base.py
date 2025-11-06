from __future__ import annotations

from dataclasses import dataclass
from importlib import import_module
from inspect import isclass
from typing import Any, Dict, Iterable


class Node:
    """Base class for all MCP nodes."""

    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Node subclasses must implement `run`.")


@dataclass
class NodeConfig:
    node_id: str
    module: str
    inputs: Iterable[str]
    outputs: Iterable[str]
    condition: str | None = None


class MCPRuntime:
    """Minimal runtime that executes nodes in declaration order."""

    def __init__(self, config: Dict[str, Any]) -> None:
        self._config = config
        self._node_configs = self._parse_node_configs(config.get("nodes", []))
        self._nodes = self._load_nodes()

    def _parse_node_configs(self, raw_nodes: Iterable[Dict[str, Any]]) -> Dict[str, NodeConfig]:
        node_configs: Dict[str, NodeConfig] = {}
        for raw in raw_nodes:
            node_configs[raw["id"]] = NodeConfig(
                node_id=raw["id"],
                module=raw["module"],
                inputs=raw.get("inputs", []),
                outputs=raw.get("outputs", []),
                condition=raw.get("condition"),
            )
        return node_configs

    def _load_nodes(self) -> Dict[str, Node]:
        nodes: Dict[str, Node] = {}
        for node_id, cfg in self._node_configs.items():
            module = import_module(cfg.module)
            node_cls = self._find_node_class(module)
            if node_cls is None:
                raise RuntimeError(f"No Node subclass found in module {cfg.module}.")
            nodes[node_id] = node_cls()
        return nodes

    def _find_node_class(self, module: Any) -> type[Node] | None:
        for attr_name in dir(module):
            candidate = getattr(module, attr_name)
            if (
                isclass(candidate)
                and issubclass(candidate, Node)
                and candidate is not Node
            ):
                return candidate
        return None

    def trigger(self, event_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Execute nodes sequentially using the provided payload."""
        _ = event_name  # Placeholder: hook for routing events in future revisions.
        data: Dict[str, Any] = dict(payload)
        for node_id, node in self._nodes.items():
            cfg = self._node_configs[node_id]
            if cfg.condition and not self._evaluate_condition(cfg.condition, data):
                continue

            inputs = {key: data[key] for key in cfg.inputs if key in data}
            outputs = node.run(inputs)
            if not isinstance(outputs, dict):
                raise RuntimeError(f"Node {node_id} must return a dict, got {type(outputs)}.")
            data.update(outputs)
        return data

    def _evaluate_condition(self, expression: str, context: Dict[str, Any]) -> bool:
        try:
            return bool(eval(expression, {}, context))  # noqa: S307 - trusted config
        except Exception:
            return False
