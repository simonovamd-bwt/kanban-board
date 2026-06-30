import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine, get_db
from app.models import Card, Column
from app.schemas import BoardOut, CardCreate, CardMove, CardOut, ColumnRename
from app.seed import seed

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed(db)

app = FastAPI(title="Kanban API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def renumber(db: Session, column_id: str) -> None:
    cards = (
        db.query(Card)
        .filter(Card.column_id == column_id)
        .order_by(Card.position)
        .all()
    )
    for index, card in enumerate(cards):
        card.position = index


@app.get("/api/board", response_model=BoardOut)
def get_board(db: Session = Depends(get_db)):
    columns = db.query(Column).order_by(Column.position).all()
    return BoardOut(columns=columns)


@app.post("/api/reset", status_code=204)
def reset_board(db: Session = Depends(get_db)):
    db.query(Card).delete()
    db.query(Column).delete()
    db.commit()
    seed(db)


@app.patch("/api/columns/{column_id}", response_model=ColumnRename)
def rename_column(column_id: str, payload: ColumnRename, db: Session = Depends(get_db)):
    column = db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    column.title = payload.title
    db.commit()
    return payload


@app.post("/api/columns/{column_id}/cards", response_model=CardOut, status_code=201)
def add_card(column_id: str, payload: CardCreate, db: Session = Depends(get_db)):
    column = db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")

    position = (
        db.query(Card).filter(Card.column_id == column_id).count()
    )
    card = Card(
        id=f"card-{uuid.uuid4().hex[:12]}",
        title=payload.title,
        details=payload.details,
        position=position,
        column_id=column_id,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@app.delete("/api/cards/{card_id}", status_code=204)
def delete_card(card_id: str, db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    column_id = card.column_id
    db.delete(card)
    db.flush()
    renumber(db, column_id)
    db.commit()


@app.patch("/api/cards/{card_id}/move", response_model=CardOut)
def move_card(card_id: str, payload: CardMove, db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    if not db.get(Column, payload.column_id):
        raise HTTPException(status_code=404, detail="Column not found")

    source_column_id = card.column_id

    # Detach from source and close the gap.
    card.position = -1
    db.flush()
    renumber(db, source_column_id)

    # Make room in the target column at the requested position.
    target_cards = (
        db.query(Card)
        .filter(Card.column_id == payload.column_id, Card.id != card_id)
        .order_by(Card.position)
        .all()
    )
    position = max(0, min(payload.position, len(target_cards)))
    target_cards.insert(position, card)
    card.column_id = payload.column_id
    for index, item in enumerate(target_cards):
        item.position = index

    db.commit()
    db.refresh(card)
    return card
