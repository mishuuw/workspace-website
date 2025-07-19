from sqlalchemy import Column, Integer, String
from database.base import Base, engine
from uuid import uuid4

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    version = Column(Integer, default=0)
    uuid = Column(String, index = True, default = str(uuid4()))

Base.metadata.create_all(engine)