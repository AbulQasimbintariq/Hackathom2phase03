import os
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from typing import List, Optional
from sqlmodel import select
import jwt

from ..db import get_session
from ..models import Task, TaskCreate, TaskRead, TaskUpdate

router = APIRouter()


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


@router.get('/api/tasks', response_model=List[TaskRead])
def list_tasks(
    status: Optional[str] = Query('all', regex=r'^(all|pending|completed)$'),
    sort: Optional[str] = Query('created', regex=r'^(created|title|due_date)$'),
    user_id: str = Depends(get_current_user),
):
    with get_session() as session:
        stmt = select(Task).where(Task.user_id == user_id)
        if status == 'pending':
            stmt = stmt.where(Task.completed == False)
        elif status == 'completed':
            stmt = stmt.where(Task.completed == True)

        if sort == 'title':
            stmt = stmt.order_by(Task.title)
        elif sort == 'due_date':
            # sort earliest due date first
            stmt = stmt.order_by(Task.due_date.asc())
        else:
            stmt = stmt.order_by(Task.created_at.desc())

        results = session.exec(stmt).all()
        return results


@router.post('/api/tasks', response_model=TaskRead, status_code=201)
def create_task(task_in: TaskCreate, user_id: str = Depends(get_current_user)):
    # Build Task explicitly to ensure fields and defaults are set
    task = Task(**task_in.dict())
    task.user_id = user_id
    with get_session() as session:
        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@router.put('/api/tasks/{task_id}', response_model=TaskRead)
def update_task(task_id: int, task_in: TaskUpdate, user_id: str = Depends(get_current_user)):
    with get_session() as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            raise HTTPException(status_code=404, detail='Task not found')

        task_data = task_in.dict(exclude_unset=True)
        for key, value in task_data.items():
            setattr(task, key, value)

        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@router.delete('/api/tasks/{task_id}', status_code=204)
def delete_task(task_id: int, user_id: str = Depends(get_current_user)):
    with get_session() as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            raise HTTPException(status_code=404, detail='Task not found')
        session.delete(task)
        session.commit()
        return None
