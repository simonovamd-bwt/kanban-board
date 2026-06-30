from sqlalchemy.orm import Session

from app.models import Card, Column

DUMMY_COLUMNS = [
    {
        "id": "col-1",
        "title": "To Do",
        "cards": [
            ("card-1", "Design user interface", "Create wireframes and mockups for the main dashboard"),
            ("card-2", "Set up project structure", "Initialize Next.js project and configure dependencies"),
        ],
    },
    {
        "id": "col-2",
        "title": "In Progress",
        "cards": [
            ("card-3", "Implement drag and drop", "Add @dnd-kit library and implement card movement between columns"),
            ("card-4", "Create card components", "Build reusable card component with title and details fields"),
            ("card-5", "Style the board", "Apply color scheme and ensure responsive design"),
        ],
    },
    {
        "id": "col-3",
        "title": "Review",
        "cards": [
            ("card-6", "Code review", "Review all components for code quality and best practices"),
        ],
    },
    {
        "id": "col-4",
        "title": "Testing",
        "cards": [
            ("card-7", "Write unit tests", "Create tests for all components and utility functions"),
            ("card-8", "Integration testing", "Set up Playwright and write end-to-end tests"),
        ],
    },
    {
        "id": "col-5",
        "title": "Done",
        "cards": [
            ("card-9", "Project setup", "Completed initial project scaffolding and configuration"),
        ],
    },
]


def seed(db: Session) -> None:
    if db.query(Column).count() > 0:
        return

    for col_pos, col in enumerate(DUMMY_COLUMNS):
        db.add(Column(id=col["id"], title=col["title"], position=col_pos))
        for card_pos, (card_id, title, details) in enumerate(col["cards"]):
            db.add(
                Card(
                    id=card_id,
                    title=title,
                    details=details,
                    position=card_pos,
                    column_id=col["id"],
                )
            )
    db.commit()
