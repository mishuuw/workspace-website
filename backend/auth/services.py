from fastapi.responses import JSONResponse
from fastapi import Request
from auth.schemas import UserAuth, RegisterResponse
from auth.models import User
from utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
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

async def logout_user(request: Request, db: Session):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise AccessForbiddenError()

    token = decode_token(auth_header.replace("Bearer ", ""))

    user_uuid = token.get("sub")
    token_version = token.get("iss")

    existing_user = db.query(User).filter(User.uuid == user_uuid).first()

    if not existing_user or existing_user.version != token_version:
        raise AccessForbiddenError()

    existing_user.version += 1
    db.commit()
    db.refresh(existing_user)
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.set_cookie("refreshToken",
                        '',
                        secure=True,
                        httponly=True,
                        samesite="strict",
                        expires=0)
    return response


async def refresh_tokens(db: Session, request: Request):
    refresh_token = decode_token(request.cookies.get("refreshToken"))
    if not refresh_token:
        raise AccessForbiddenError()

    existing_user = db.query(User).filter(User.uuid == refresh_token.get("sub")).first()
    if (not existing_user) or (existing_user.version != refresh_token.get("iss")):
        raise AccessForbiddenError()

    access_token = create_access_token(existing_user)
    refresh_token = create_refresh_token(existing_user)

    response = JSONResponse(content={"accessToken": access_token})
    response.set_cookie("refreshToken",
                        refresh_token,
                        secure=True,
                        httponly=True,
                        samesite="strict")

    return response