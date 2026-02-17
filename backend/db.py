import os
from contextlib import contextmanager
from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///./dev.db"

# Simple, synchronous engine (SQLModel uses SQLAlchemy)
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
    with Session(engine) as session:
        yield session
