from typing import Annotated
from sqlalchemy import select
from fastapi import APIRouter,HTTPException,status,Query,Depends
from Entities.models import User,Topic,Message
from DTO.modelbase import TopicBase, UserBase
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
    

@router.get("/topics/{page}")
async def getTopics(page:int, db:db_dependency,
    limit: Annotated[int, Query(le=100)] = 100): 
    topics = db.execute(select(Topic).offset((page-1)*limit).limit(limit)).mappings().all()
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
    
@router.delete("/user/{id}",status_code=status.HTTP_200_OK)
async def delete_User(id:int, db:db_dependency):
    user = db.query(User).filter(User.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='Usuário não encontrado.')
    db.delete(user)
    db.commit()    

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