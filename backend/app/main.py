from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.router import router as auth_router
import logging
logging.getLogger('asyncio').setLevel(logging.CRITICAL)
app = FastAPI()
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# TODO: Setup NGINX for production later, setup SSL certificate.s

@app.get("/")
async def root():
    return {"message": "hello, wanderer."}
