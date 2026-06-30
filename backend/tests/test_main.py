"""Tests for the move/delete position bookkeeping (renumber + move_card)."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.seed import seed


@pytest.fixture
def client():
    # Isolated in-memory DB per test; StaticPool keeps one shared connection so
    # the schema/seed survive across the request handlers.
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False)
    Base.metadata.create_all(bind=engine)
    with TestingSession() as db:
        seed(db)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    # TestClient is used without a `with` block on purpose: that skips the app
    # lifespan, so the real on-disk database is never touched.
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def positions(client, column_id):
    """Return [(card_id, index)] for a column in server order."""
    board = client.get("/api/board").json()
    column = next(c for c in board["columns"] if c["id"] == column_id)
    return [card["id"] for card in column["cards"]]


def test_seed_columns_and_cards(client):
    board = client.get("/api/board").json()
    assert [c["id"] for c in board["columns"]] == ["col-1", "col-2", "col-3", "col-4", "col-5"]
    assert positions(client, "col-1") == ["card-1", "card-2"]


def test_move_within_column_reorders_and_renumbers(client):
    # col-1: [card-1, card-2] -> move card-1 to the end (position 1).
    res = client.patch("/api/cards/card-1/move", json={"column_id": "col-1", "position": 1})
    assert res.status_code == 200
    assert positions(client, "col-1") == ["card-2", "card-1"]


def test_move_to_end_clamps_overshoot_position(client):
    # Requesting a position past the end should clamp, not crash or leave a gap.
    res = client.patch("/api/cards/card-1/move", json={"column_id": "col-1", "position": 99})
    assert res.status_code == 200
    assert positions(client, "col-1") == ["card-2", "card-1"]


def test_move_across_columns_closes_source_gap_and_inserts(client):
    # col-1: [card-1, card-2] -> move card-1 into col-2 at position 0.
    # col-2 seeds as [card-3, card-4, card-5].
    res = client.patch("/api/cards/card-1/move", json={"column_id": "col-2", "position": 0})
    assert res.status_code == 200
    assert positions(client, "col-1") == ["card-2"]
    assert positions(client, "col-2") == ["card-1", "card-3", "card-4", "card-5"]


def test_delete_card_renumbers_remaining(client):
    # col-2: [card-3, card-4, card-5] -> delete the middle card.
    res = client.delete("/api/cards/card-4")
    assert res.status_code == 204
    assert positions(client, "col-2") == ["card-3", "card-5"]
    # A subsequent move relies on contiguous positions; verify it still works.
    res = client.patch("/api/cards/card-3/move", json={"column_id": "col-2", "position": 1})
    assert res.status_code == 200
    assert positions(client, "col-2") == ["card-5", "card-3"]


def test_move_missing_card_returns_404(client):
    res = client.patch("/api/cards/nope/move", json={"column_id": "col-1", "position": 0})
    assert res.status_code == 404


def test_move_to_missing_column_returns_404(client):
    res = client.patch("/api/cards/card-1/move", json={"column_id": "nope", "position": 0})
    assert res.status_code == 404
