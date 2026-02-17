import random
from typing import List


class ChatbotService:
    """Simple rule-based chatbot service for task management assistance."""

    def __init__(self):
        self.responses = {
            "hello": [
                "Hello! I'm your task assistant. How can I help you today?",
                "Hi there! Need help managing your tasks?",
                "Hey! What can I do for you?",
            ],
            "help": [
                "I can help you with tasks! You can:\n- Create new tasks\n- Mark tasks as complete\n- Delete tasks\n- Filter and sort tasks\nWhat would you like to do?",
                "I'm here to assist with your task management. Ask me about creating, updating, or managing your tasks!",
            ],
            "create": [
                "To create a task, use the form at the top of the page. You can add a title, description, and due date. Would you like any other help?",
                "Creating tasks is easy! Just fill in the task form with a title (required), description (optional), and due date (optional).",
            ],
            "task": [
                "You can manage your tasks easily! Check the main page to view all your tasks, mark them complete, or delete them.",
                "Tasks can be created, completed, and deleted. Use the form to create new ones!",
            ],
            "complete": [
                "To mark a task as complete, click the checkbox next to it!",
                "Just click the checkbox on the task to mark it as done.",
            ],
            "delete": [
                "Click the 'Delete' button on a task to remove it. You'll be asked to confirm.",
                "To delete a task, use the delete button and confirm the action.",
            ],
            "filter": [
                "You can filter tasks by status (All, Pending, Completed) and sort by (Created, Title, Due date). Check the filter options above the task list!",
                "Use the filter and sort dropdowns to organize your view of tasks.",
            ],
            "default": [
                "I can help with task management! Ask me about creating, completing, or managing tasks.",
                "Sorry, I'm not sure about that. I'm here to help with your tasks!",
                "Feel free to ask me about your tasks!",
            ],
        }

    def get_response(self, user_message: str) -> str:
        """Generate a response based on user message."""
        try:
            message_lower = (user_message or "").lower().strip()

            # If message is empty after trimming, prompt user
            if not message_lower:
                return "Please type a question about tasks so I can help. For example: 'How do I create a task?'"

            # Only allow task-related topics. If user asks unrelated questions, politely decline.
            task_keywords = [
                "task",
                "create",
                "delete",
                "complete",
                "done",
                "due",
                "deadline",
                "filter",
                "sort",
                "help",
                "how",
                "add",
                "update",
                "edit",
            ]

            # Quick check: if none of the task keywords appear, respond that bot only handles tasks
            if not any(k in message_lower for k in task_keywords):
                return "I can only help with task management. Please ask about creating, completing, deleting, or managing tasks."

            # Check for different keywords (task-focused)
            for keyword, responses in self.responses.items():
                if keyword == "default":
                    continue
                if keyword in message_lower or self._similar_key(keyword, message_lower):
                    return random.choice(responses)

            # If nothing matched but message contains a task keyword, return a helpful generic task response
            return random.choice(self.responses["task"]) if "task" in self.responses else "I can help with tasks. What would you like to do?"
        except Exception:
            # Fail-safe fallback to avoid raising inside the web request
            return "Sorry, I couldn't process that. Please ask a question about tasks."

    def _similar_key(self, keyword: str, message: str) -> bool:
        """Check for semantic similarity between keyword and message."""
        # Simple similarity check based on common words
        keyword_words = set(keyword.split())
        message_words = set(message.split())
        overlap = len(keyword_words & message_words)
        return overlap > 0
