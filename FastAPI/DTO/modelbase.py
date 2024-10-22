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
    date_insert: str
    date_update: str

class TopicModel(TopicBase):
    id: int
    class Config:
        orm_mode = True
        
class UserBase(BaseModel):
    username: str

class MessageBase(BaseModel):
    topic_id: int
    message_position: int
    message: str
    user_id: int
    date_insert: str
    date_update: str

class MessageModel(MessageBase):
    id: int
    class Config:
        orm_mode = True