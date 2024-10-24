from typing import Annotated, List
from sqlalchemy import select
from fastapi import APIRouter,HTTPException,status,Query,Depends
from Entities.models import User,Topic,Message
from DTO.modelbase import MessageBase, TopicBase, TopicModel, UserBase
from database import SessionLocal
from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
       yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

router = APIRouter()

@router.get('/')
async def home():
    return "Olá. Seja bem-vindo ao nosso fórum!<br> "+ \
    "Criar um tópico <br>Ver todos os tópicos <br>Procurar um tópico"

@router.post("/topic/",status_code=status.HTTP_201_CREATED)
async def create_topic(topic: TopicBase,db: db_dependency):
    try:
        db_topic = Topic(**topic.model_dump())
        db.add(db_topic)
        db.commit()
        db.refresh(db_topic)
        return "Postagem adicionada com sucesso!"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)

@router.post("/users/",status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase,db: db_dependency):
    try:
        db_user = User(**user.model_dump())
        db.add(db_user)
        db.commit()
        return "Usuário adicionado com sucesso!"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)
    

@router.get("/topics/{page}", response_model=List[TopicModel])
async def getTopics(page:int, db:db_dependency,
    limit: Annotated[int, Query(le=100)] = 100): 
    topics = db.query(Topic).offset((page-1)*limit).limit(limit).all()
    if topics is None:
        raise HTTPException(status_code=404, detail='Não existem postagens nessa página.')
    return topics    

@router.get("/topic/{id}")
async def read_Topic(id:int, db:db_dependency):
    topic = db.query(Topic).filter(Topic.id == id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail='Postagem não encontrada.')
    return topic  
    
@router.get("/user/{id}")
async def read_User(id:int, db:db_dependency):
    user = db.query(User).filter(User.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='Usuário não encontrado.')
    return user    

@router.delete("/topic/{id}",status_code=status.HTTP_200_OK)
async def delete_Topic(id:int, db:db_dependency):
    topic = db.query(Topic).filter(Topic.id == id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail='Postagem não encontrada.')
    db.delete(topic)
    db.commit()
    return "Postagem apagada com sucesso!"  
    
@router.delete("/user/{id}",status_code=status.HTTP_200_OK)
async def delete_User(id:int, db:db_dependency):
    user = db.query(User).filter(User.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='Usuário não encontrado.')
    db.delete(user)
    db.commit()
    return "Usuário removido com sucesso!"    

@router.put("/topic/{id}",status_code=status.HTTP_204_NO_CONTENT)
async def update_topic(id:int, updatedTopic: TopicBase,db: db_dependency):
    db_topic = db.query(Topic).filter(Topic.id == id).first()
    if db_topic is None:
        raise HTTPException(status_code=404, detail='Postagem não encontrada.')
    db_topic.category = updatedTopic.category
    db_topic.content = updatedTopic.content
    db_topic.status_topic = updatedTopic.status_topic
    db_topic.title = updatedTopic.title
    db_topic.user_id = updatedTopic.user_id
    db_topic.date_update = updatedTopic.date_update
    
    
    db.flush()
    db.commit()
    return "Postagem atualizada com sucesso!"

@router.put("/users/{id}",status_code=status.HTTP_204_NO_CONTENT)
async def update_user(id:int,updatedUser: UserBase,db: db_dependency):
    db_user = db.query(User).filter(User.id == id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail='Usuário não encontrado.')
    db_user.username = updatedUser.username  
    db.flush()
    db.commit()
    return "Usuário atualizado com sucesso!"       


@router.get("/messages/{topic_id}")
async def read_Messages(topic_id:int, db:db_dependency):
    messages = db.query(Message).filter(Message.topic_id == topic_id).all()
    if messages is None:
        return "Esse tópico ainda não foi respondido."
    return messages  

@router.post("/message/{topic_id}",status_code=status.HTTP_201_CREATED)
async def create_message(topic: MessageBase,db: db_dependency):
    try:
        db_message = Message(**topic.model_dump())
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return "Mensagem adicionada com sucesso!"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)

@router.put("/topic/{topic_id}/message/{message_position}",status_code=status.HTTP_204_NO_CONTENT)
async def update_message(topic_id:int,message_position:int, updatedTopic: MessageBase,db: db_dependency):
    db_message = db.query(Message).filter(Message.topic_id == topic_id and
        Message.message_position == message_position).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail='Mensagem não encontrada.')
    db_message.message = updatedTopic.message
    db_message.date_update = updatedTopic.date_update
    db_message.user_id = updatedTopic.user_id
   
    db.flush()
    db.commit()
    return "Mensagem atualizada com sucesso!"

@router.delete("/topic/{topic_id}/message/{message_position}",status_code=status.HTTP_200_OK)
async def delete_Message(topic_id:int,message_position:int, db:db_dependency):
    message = db.query(Message).filter(Message.topic_id == topic_id and
        Message.message_position == message_position).first()
    if message is None:
        raise HTTPException(status_code=404, detail='Mensagem não encontrada.')
    db.delete(message)
    db.commit()
    return "Mensagem apagada com sucesso!"  