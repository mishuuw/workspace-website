import os

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, UTC

from sentry_sdk.ai.monitoring import record_token_usage

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

def decode_token(token: str):
    try:
        data = jwt.decode(token, SECRET_KEY, ALGORITHM,
                          dict(verify_signature=True, verify_aud=True, verify_iat=True, verify_exp=True,
                               verify_nbf=True, verify_iss=True, verify_sub=True, verify_jti=True, verify_at_hash=True,
                               require_aud=False, require_iat=True, require_exp=True, require_nbf=False,
                               require_iss=True, require_sub=True, require_jti=False, require_at_hash=False,
                               leeway=120))
    except:
        return False

    #
    # Possible additional security checks
    #

    return data
