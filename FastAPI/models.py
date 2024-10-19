from sqlalchemy import Boolean,Column,Integer,String
from database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer,primary_key=True, index=True)
    username = Column(String(50), unique=True)

class Topic(Base):
    __tablename__ = 'topics'

    id = Column(Integer, primary_key = True, index = True)
    title = Column(String(50))
    content = Column(String(1000))
    user_id = Column(Integer)
    status_topic = Column(String(20))
    category = Column(String(50))

class Message(Base):
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key = True, index = True)
    topic_id = Column(Integer)
    message_position = Column(Integer)
    user_id = Column(Integer)
    message = Column(String(1000))