from fastapi import APIRouter
from Controllers.Routes import router as document_router

class ConnectionController:
    def __init__(self):
        self.router = APIRouter()
        self.router.include_router(document_router)