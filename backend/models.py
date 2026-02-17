from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlmodel import Column
from sqlalchemy import DateTime, Boolean, String


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True, index=True)
    email: Optional[str] = Field(default=None, sa_column=Column(String, unique=True, index=True))
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskBase(SQLModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = Field(default=False, sa_column=Column(Boolean, nullable=False, index=True))


class Task(TaskBase, table=True):
    __tablename__ = "tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    due_date: Optional[datetime] = Field(default=None, sa_column=Column(DateTime, nullable=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime, default=datetime.utcnow))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow))


class TaskCreate(SQLModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    due_date: Optional[datetime] = None


class TaskRead(SQLModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    user_id: str
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None


# Chat Models
class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    conversation_id: int = Field(foreign_key="chat_conversations.id", index=True)
    content: str = Field(..., min_length=1, max_length=2000)
    sender: str = Field(..., regex="^(user|bot)$")
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime, default=datetime.utcnow))


class ChatMessageCreate(SQLModel):
    content: str = Field(..., min_length=1, max_length=2000)


class ChatMessageRead(SQLModel):
    id: int
    conversation_id: int
    content: str
    sender: str
    created_at: datetime


class ChatConversation(SQLModel, table=True):
    __tablename__ = "chat_conversations"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(default="New Conversation", max_length=200)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime, default=datetime.utcnow))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow))


class ChatConversationCreate(SQLModel):
    title: Optional[str] = Field(None, max_length=200)


class ChatConversationRead(SQLModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
