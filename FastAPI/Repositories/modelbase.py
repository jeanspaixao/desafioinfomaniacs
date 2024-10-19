from typing import Annotated
from pydantic import BaseModel
from database import engine
from Entities.models import Base


Base.metadata.create_all(bind=engine)

class TopicBase(BaseModel):
    title: str
    content: str
    user_id: int
    status_topic: str
    category: str

class UserBase(BaseModel):
    username: str
