# Kanban Project Manager

A full-stack Kanban board: Next.js frontend with a FastAPI + SQLite backend.
Cards, columns, and ordering persist in `backend/data/kanban.db`.

## Setup

```bash
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
cd ../frontend && npm install
```

## Running the App

Both servers at once (from `frontend/`):

```bash
npm run dev:all
```

Or in two terminals:

```bash
# terminal 1
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload
# terminal 2
cd frontend && npm run dev
```

Open http://localhost:3000. See `backend/README.md` and `frontend/README.md` for details.
