import os

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, UTC
from auth.models import User
from dotenv import load_dotenv

ALGORITHM = "HS256"

load_dotenv("backend/settings/.env")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(user: User):
    expires = datetime.now(UTC) + timedelta(minutes=30)
    return jwt.encode(
        {
            "iss": user.version,
            "sub": user.uuid,
            "iat": datetime.now(UTC),
            "exp": expires,
        }, key=SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user: User):
    expires = datetime.now(UTC) + timedelta(days=30)
    return jwt.encode(
        {
            "iss": user.version,
            "sub": user.uuid,
            "iat": datetime.now(UTC),
            "exp": expires,
        }, key=SECRET_KEY, algorithm=ALGORITHM)