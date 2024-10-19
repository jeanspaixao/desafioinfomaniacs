from fastapi import FastAPI,HTTPException, Depends, status
from fastapi.params import Query
from pydantic import BaseModel
from typing import Annotated

from sqlalchemy import select
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class TopicBase(BaseModel):
    title: str
    content: str
    user_id: int
    status_topic: str
    category: str

class UserBase(BaseModel):
    username: str

def get_db():
    db = SessionLocal()
    try:
       yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
def home():
    return "Olá. Seja bem-vindo ao nosso fórum!<br> "+ \
    "Criar um tópico <br>Ver todos os tópicos <br>Procurar um tópico"


@app.post("/topic/",status_code=status.HTTP_201_CREATED)
def create_topic(topic: TopicBase,db: db_dependency):
    try:
        db_topic = models.Topic(**topic.model_dump())
        db.add(db_topic)
        db.commit()
        return "Postagem adicionada com sucesso!"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)

@app.post("/users/",status_code=status.HTTP_201_CREATED)
def create_user(user: UserBase,db: db_dependency):
    try:
        db_user = models.User(**user.model_dump())
        db.add(db_user)
        db.commit()
        return "Usuário adicionado com sucesso!"
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)
    

@app.get("/topics/{page}")
def getTopics(page:int, db:db_dependency,
    limit: Annotated[int, Query(le=100)] = 100): 
    topics = db.execute(select(models.Topic).offset((page-1)*limit).limit(limit)).mappings().all()
    if topics is None:
        raise HTTPException(status_code=404, detail='Não existem postagens nessa página.')
    return topics    

@app.get("/topic/{id}")
def read_Topic(id:int, db:db_dependency):
    topic = db.query(models.Topic).filter(models.Topic.id == id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail='Postagem não encontrada.')
    return topic  
    
@app.get("/user/{id}")
def read_User(id:int, db:db_dependency):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='Usuário não encontrado.')
    return user    