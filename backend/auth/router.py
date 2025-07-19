import os
from fastapi import APIRouter, Depends, HTTPException, status, Request
from auth.schemas import UserAuth, RegisterResponse, LoginResponse, LogoutResponse
from database.session import get_db
from utils.exceptions import *
from auth.services import register_user, login_user, refresh_tokens, logout_user
from sqlalchemy.orm import Session

router = APIRouter(tags=["Auth"])

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserAuth, db: Session = Depends(get_db)):
    try:
        return await register_user(db, user)
    except UserAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(user: UserAuth, db: Session = Depends(get_db)):
    try:
        return await login_user(db, user)
    except UserDoesNotExistError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    except WrongPasswordError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")

@router.post("/refresh", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def refresh(request: Request, db: Session = Depends(get_db)):
    try:
        return await refresh_tokens(db, request)
    except AccessForbiddenError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")

@router.post("/logout", response_model=LogoutResponse, status_code=status.HTTP_200_OK)
async def logout(request: Request, db: Session = Depends(get_db)):
    try:
        return await logout_user(request, db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")