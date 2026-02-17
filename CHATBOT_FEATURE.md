# Chatbot Feature Documentation

## Overview

The application now includes an AI-powered chatbot assistant to help users manage their tasks. The chatbot is integrated seamlessly with the task management system.

## Features

### Backend Features

1. **Chat Models** - SQLModel-based database models for:
   - Chat conversations
   - Chat messages (user and bot)

2. **Chat API Endpoints** (`/api/chat/`):
   - `GET /api/chat/conversations` - List all conversations for the current user
   - `POST /api/chat/conversations` - Create a new conversation
   - `GET /api/chat/conversations/{id}/messages` - Retrieve messages in a conversation
   - `POST /api/chat/conversations/{id}/messages` - Send a message and get bot response
   - `DELETE /api/chat/conversations/{id}` - Delete a conversation

3. **Chatbot Service** - Rule-based chatbot (`chatbot_service.py`):
   - Responds to natural language queries about task management
   - Provides helpful information about creating, updating, and managing tasks
   - Recognizes keywords and provides relevant suggestions

### Frontend Features

1. **ChatBot Component** (`ChatBot.tsx`):
   - Main interface combining all chat UI elements
   - Manages message loading and sending
   - Auto-scrolls to newest messages

2. **ChatConversations Component** (`ChatConversations.tsx`):
   - Sidebar showing list of chat conversations
   - Create new conversations
   - Delete old conversations
   - Switch between conversations

3. **ChatMessage Component** (`ChatMessage.tsx`):
   - Displays individual chat messages
   - Distinguishes between user and bot messages
   - Shows timestamp for each message

4. **ChatInput Component** (`ChatInput.tsx`):
   - Text input field for sending messages
   - Send button with loading state
   - Input validation and disabled states

5. **Chat Page** (`/app/chat/page.tsx`):
   - Dedicated page for the chat interface
   - Full-screen layout with sidebar navigation

## Project Structure

### Backend

```
backend/
├── models.py              # Chat data models
├── chatbot_service.py     # Chatbot logic
├── routes/
│   └── chat.py           # Chat API endpoints
└── main.py               # Updated to include chat router
```

### Frontend

```
frontend/
├── lib/
│   └── api.ts            # Updated with chat endpoints
├── components/
│   ├── ChatBot.tsx       # Main chatbot interface
│   ├── ChatMessage.tsx   # Individual message component
│   ├── ChatInput.tsx     # Message input form
│   └── ChatConversations.tsx # Conversation sidebar
├── app/
│   ├── layout.tsx        # Updated with navigation
│   ├── page.tsx          # Tasks page
│   └── chat/
│       └── page.tsx      # Chat page
```

## Usage

### Creating a Conversation

1. Navigate to the Chat page via the navigation menu
2. Click "New Chat" button in the sidebar
3. A new conversation will be created and opened

### Sending Messages

1. Type your message in the input field
2. Press Enter or click "Send"
3. The bot will respond based on your query

### Switching Conversations

1. Click on any conversation in the sidebar
2. The conversation's messages will be loaded
3. You can continue the conversation or start a new one

## API Integration

### API Client Methods

The `api.ts` file now includes:

- `listConversations()` - Fetch all conversations
- `createConversation(title?)` - Create new conversation
- `getConversationMessages(conversationId)` - Load messages
- `sendMessage(conversationId, content)` - Send message
- `deleteConversation(conversationId)` - Delete conversation

### Authentication

All chat endpoints require the `Authorization: Bearer {token}` header, same as task endpoints.

## Chatbot Capabilities

The chatbot recognizes the following topics:

- **Help** - General assistance with the app
- **Create/Tasks** - How to create and manage tasks
- **Complete** - How to mark tasks as done
- **Delete** - How to remove tasks
- **Filter** - How to use filters and sorting

The chatbot provides friendly, helpful responses tailored to assist users with task management.

## Database Schema

### ChatConversation Table

```sql
CREATE TABLE chat_conversations (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    title VARCHAR(200) DEFAULT 'New Conversation',
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### ChatMessage Table

```sql
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('user', 'bot')),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## Future Enhancements

Potential improvements:

1. Integrate with LLM APIs (OpenAI, Anthropic) for more advanced responses
2. Add conversation search and filtering
3. Export conversation history
4. Chatbot personality customization
5. Integration of task suggestions from chat context
6. Voice input/output support
7. Real-time message streaming
