# Kanban Backend

FastAPI + SQLite REST API for the Kanban board. Data persists in `data/kanban.db`.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

API runs on http://localhost:8000. The database is created and seeded with dummy
data on first start.

## Endpoints

- `GET /api/board` - full board with columns and cards
- `PATCH /api/columns/{column_id}` - rename a column
- `POST /api/columns/{column_id}/cards` - add a card
- `DELETE /api/cards/{card_id}` - delete a card
- `PATCH /api/cards/{card_id}/move` - move a card to a column at a position

To reset the data, delete `data/kanban.db` and restart.
