from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
import jwt
import os

from ..db import get_session
from sqlmodel import select
from ..models import ChatMessage, ChatMessageCreate, ChatMessageRead, ChatConversation, ChatConversationCreate, ChatConversationRead
from ..chatbot_service import ChatbotService

router = APIRouter()
chatbot = ChatbotService()


def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """Auth dependency.

    If `JWT_SECRET` env var is set, decode and verify JWT (expect `sub` claim as user id).
    Otherwise, for convenience in local dev, treat the token string as the user id.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = parts[1]

    secret = os.environ.get('JWT_SECRET')
    if secret:
        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            user_id = payload.get('sub') or payload.get('user_id')
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token payload")
            return user_id
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid JWT token")

    # Fallback: treat token as user_id (dev only)
    return token


@router.get('/api/chat/conversations', response_model=List[ChatConversationRead])
def list_conversations(user_id: str = Depends(get_current_user)):
    """List all chat conversations for the user."""
    with get_session() as session:
        stmt = select(ChatConversation).where(ChatConversation.user_id == user_id).order_by(ChatConversation.updated_at.desc())
        conversations = session.exec(stmt).all()
        return conversations


@router.post('/api/chat/conversations', response_model=ChatConversationRead, status_code=201)
def create_conversation(
    conversation_in: ChatConversationCreate,
    user_id: str = Depends(get_current_user)
):
    """Create a new chat conversation."""
    with get_session() as session:
        conversation = ChatConversation(
            user_id=user_id,
            title=conversation_in.title or "New Conversation"
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        return conversation


@router.get('/api/chat/conversations/{conversation_id}/messages', response_model=List[ChatMessageRead])
def get_messages(
    conversation_id: int,
    user_id: str = Depends(get_current_user)
):
    """Get all messages in a conversation."""
    with get_session() as session:
        # Verify conversation belongs to user
        conv = session.get(ChatConversation, conversation_id)
        if not conv or conv.user_id != user_id:
            raise HTTPException(status_code=404, detail="Conversation not found")

        stmt = select(ChatMessage).where(
            (ChatMessage.conversation_id == conversation_id) & (ChatMessage.user_id == user_id)
        ).order_by(ChatMessage.created_at.asc())
        messages = session.exec(stmt).all()
        return messages


@router.post('/api/chat/conversations/{conversation_id}/messages', response_model=ChatMessageRead, status_code=201)
def send_message(
    conversation_id: int,
    message_in: ChatMessageCreate,
    user_id: str = Depends(get_current_user)
):
    """Send a message and get a bot response."""
    try:
        with get_session() as session:
            # Verify conversation belongs to user
            conv = session.get(ChatConversation, conversation_id)
            if not conv or conv.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")

            # Validate message content
            if not message_in.content or not message_in.content.strip():
                raise HTTPException(status_code=400, detail="Message cannot be empty")

            # Save user message
            user_msg = ChatMessage(
                user_id=user_id,
                conversation_id=conversation_id,
                content=message_in.content.strip(),
                sender="user"
            )
            session.add(user_msg)
            session.commit()
            session.refresh(user_msg)

            # Generate bot response
            bot_response_text = chatbot.get_response(message_in.content)
            bot_msg = ChatMessage(
                user_id=user_id,
                conversation_id=conversation_id,
                content=bot_response_text,
                sender="bot"
            )
            session.add(bot_msg)
            session.commit()
            session.refresh(bot_msg)

            # Update conversation timestamp
            conv.updated_at = datetime.utcnow()
            session.add(conv)
            session.commit()

            # Return the bot message (latest in conversation)
            return bot_msg
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")


@router.delete('/api/chat/conversations/{conversation_id}', status_code=204)
def delete_conversation(
    conversation_id: int,
    user_id: str = Depends(get_current_user)
):
    """Delete a chat conversation."""
    with get_session() as session:
        conv = session.get(ChatConversation, conversation_id)
        if not conv or conv.user_id != user_id:
            raise HTTPException(status_code=404, detail="Conversation not found")

        session.delete(conv)
        session.commit()
        return None
