# AegisCycle: Agentic AI for Reproductive Longevity

**AegisCycle** is a web application demonstrating an agentic AI copilot designed to proactively manage PCOS, Endometriosis, and Menopause. Its mission is to extend female reproductive longevity and safeguard long-term health through early detection and adaptive management.

This is not just a symptom tracker or a chatbot—it's a proof-of-concept for a lifelong health copilot that works 24/7 to analyze health data, create personalized plans, and bridge the communication gap between patients and clinicians.

## ✨ Key Features

- **Agentic AI Pipeline**: A multi-agent system that continuously ingests, analyzes, and acts on health data.
- **Personalized Dashboards**: A user-friendly interface that visualizes risks, focus areas, and actionable plans.
- **Evidence-Based Risk Scoring**: Quantifies risk for PCOS, Endometriosis, and Menopause-related conditions using mock data based on clinical biomarkers.
- **Adaptive Action Plans**: Generates personalized lifestyle interventions (diet, exercise, sleep) that adapt over time.
- **Clinician Escalation**: Autonomously identifies when clinical thresholds are met and prepares a concise "Clinician Pack" to streamline appointments.
- **Dual Demo Modes**: Includes a user-friendly **Dashboard Demo** for showcasing the end-user experience and a **Technical Demo** for developers to inspect the JSON data and agent outputs.

## 🚀 How to Run the Demo

This is a static React application built with TypeScript and Tailwind CSS. There is no build step required.

1.  **Open the Application**: 
2.  **Explore**:
    - The **User Demo** (`/demo`) is the best place to start for an overview of the user experience.
    - The **Technical Demo** (`/technical-demo`) allows you to see the underlying JSON data and the direct inputs/outputs of the AI agents.

## 🔧 Configuration (Mock vs. Live API)

AegisCycle is designed to work in two modes:

-   **Mock Mode (Default)**: Uses local mock functions from `lib/mock.ts` to simulate the AI agent's responses. This allows the demo to run without a backend.
-   **Live API Mode**: Makes live HTTP requests to a configured backend. This is disabled by default.

To enable Live API mode, you would configure the `API_BASE` constant in `lib/api.ts` with your API's URL.

```typescript
// in lib/api.ts
const API_BASE = "https://your-api.com/v1"; // Set to a URL to enable live mode
```

## 📂 Project Structure

-   `pages/`: Contains the main React components for each page of the application.
-   `components/`: Contains reusable UI components, such as `Card`, `Button`, and `RiskGauge`.
-   `lib/`: Core logic, including:
    -   `mock.ts`: The mock data and simulation logic for the agent pipeline.
    -   `api.ts`: The fetch client for making live API calls.
    -   `utils.ts`: Utility functions.
-   `hooks/`: Custom React hooks, such as `useTheme`.
-   `contexts/`: React context providers for features like toasts.
-   `types.ts`: TypeScript interfaces for the data models (Intake, RiskResult, etc.).
-   `index.html`: The main entry point for the application.

---

*This application is for demonstration purposes only and does not constitute medical advice.*
