from fastapi import FastAPI
from Controllers.Controller import ConnectionController

app = FastAPI()
controller = ConnectionController()
app.include_router(controller.router)