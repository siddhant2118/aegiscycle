# AegisCycle Backend

This folder contains a lightweight FastAPI service that exposes the three endpoints expected by the React demo:

- `POST /risk/score`
- `POST /plan/generate`
- `POST /escalate/check`

Out of the box the service uses a local mock pipeline that mirrors the deterministic logic in `lib/mock.ts`. At deploy time you can point it to a Dedalus instance by setting `DEDALUS_API_BASE` (and optionally `DEDALUS_API_KEY`). When those variables are present, the service simply forwards requests to the remote Dedalus workflows and returns their responses.

## Local development

1. Install dependencies:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r backend/requirements.txt
   ```
2. Run the API:
   ```bash
   uvicorn backend.main:app --reload
   ```
3. Visit http://localhost:8000/docs to try the endpoints or wire the frontend by pointing `lib/config.local.ts` at `http://localhost:8000`.

## Environment variables

- Copy `backend/.env.example` to `backend/.env` and fill in the values as needed.
- `DEDALUS_API_BASE` (optional): Base URL of the remote Dedalus server. When unset, the mock pipeline runs locally.
- `DEDALUS_API_KEY` (optional): Bearer token sent with requests to the remote Dedalus server.

Create a `.env` file alongside `backend/main.py` or provide variables through your deployment platform.
