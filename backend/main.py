from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
import os

from .db import engine, create_db_and_tables
from .routes.tasks import router as tasks_router
from .routes.chat import router as chat_router

app = FastAPI(title="Task API")

# CORS configuration - allow both local development and production domains
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

# Add production origins from environment variable
prod_origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")
allowed_origins.extend([origin.strip() for origin in prod_origins if origin.strip()])

# Add wildcard for testing (remove in production)
if os.environ.get("ENV", "development") == "development":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(chat_router)


@app.on_event("startup")
def on_startup():
    # ensure DB and tables exist
    create_db_and_tables()

@app.get("/health")
def health_check():
    """Health check endpoint for deployment platforms."""
    return {"status": "healthy", "service": "Task API"}
