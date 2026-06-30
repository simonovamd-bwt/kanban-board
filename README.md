# Kanban Project Manager

A full-stack Kanban board: Next.js frontend with a FastAPI + SQLite backend.
Cards, columns, and ordering persist in `backend/data/kanban.db`.

## Running the App

Start the backend (terminal 1):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Start the frontend (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. See `backend/README.md` and `frontend/README.md` for details.
