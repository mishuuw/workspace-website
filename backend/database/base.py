import os
import tomllib

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv("backend/settings/.env")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

with open("backend/settings/config.toml", "rb") as f:
    data = tomllib.load(f).get("database")

sql = data.get("sql")
host = data.get("host")
user = data.get("user")
db = data.get("db")
port = data.get("port")
SQLALCHEMY_DATABASE_URL = f"{sql}://{user}:{DB_PASSWORD}@{host}:{port}/{db}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

