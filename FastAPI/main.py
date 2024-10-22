from fastapi import FastAPI
from Controllers.Controller import ConnectionController
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:8080'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)
controller = ConnectionController()
app.include_router(controller.router)
 