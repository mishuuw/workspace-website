from pydantic import BaseModel, EmailStr

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    message: str


class LoginResponse(BaseModel):
    accessToken: str

class LogoutResponse(BaseModel):
    message: str
