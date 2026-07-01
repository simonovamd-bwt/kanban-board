from pydantic import BaseModel, ConfigDict


class CardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    details: str


class ColumnOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    cards: list[CardOut]


class BoardOut(BaseModel):
    columns: list[ColumnOut]


class CardCreate(BaseModel):
    title: str
    details: str = ""


class CardUpdate(BaseModel):
    title: str
    details: str = ""


class ColumnRename(BaseModel):
    title: str


class CardMove(BaseModel):
    column_id: str
    position: int
