
from fastapi.responses import JSONResponse
from auth.schemas import UserAuth, RegisterResponse
from auth.models import User
from utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from sqlalchemy.orm import Session
from utils.exceptions import *

async def register_user(db: Session, user: UserAuth):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise UserAlreadyExistsError()

    hashed_password = get_password_hash(user.password)

    user = User(email=user.email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return RegisterResponse(message="Registration successful")

async def login_user(db: Session, user: UserAuth):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise UserDoesNotExistError()

    if not verify_password(user.password, existing_user.hashed_password):
        raise WrongPasswordError()

    ###
    ### Possible additional checks
    ###

    access_token = create_access_token(existing_user)
    refresh_token = create_refresh_token(existing_user)

    response = JSONResponse(content = {"accessToken": access_token})
    response.set_cookie("refreshToken",
                        refresh_token,
                        secure=True,
                        httponly=True,
                        samesite="strict")

    return response