from __future__ import annotations

from mcp import MCPRuntime
from mcp.utils import load_config


def main() -> None:
    config = load_config("mcp/config.yaml")
    runtime = MCPRuntime(config)

    event = {
        "intake": {
            "labs": [
                {
                    "date": "2024-07-15",
                    "fasting_glucose": 104,
                    "fasting_insulin": 18,
                    "tg": 180,
                    "hdl": 42,
                    "total_chol": 220,
                    "hs_crp": 3.0,
                }
            ],
            "vitals": [
                {
                    "date": "2024-07-15",
                    "sleep_eff": 0.82,
                    "hrv": 40,
                    "rhr": 72,
                }
            ],
            "cycles": [
                {
                    "start": "2024-06-01",
                    "length": 45,
                    "bleed_days": 5,
                    "pain_max": 7,
                }
            ],
            "bmi": 28.5,
        },
        "user_feedback": {"adherence": 0.75},
    }

    outputs = runtime.trigger(event_name="new_data", payload=event)
    print("Final runtime outputs:", outputs)


if __name__ == "__main__":
    main()
