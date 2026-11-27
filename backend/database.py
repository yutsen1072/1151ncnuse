import os
from pathlib import Path
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("找不到 DATABASE_URL，請確認 .env 檔案已正確設定")

engine = create_engine(DATABASE_URL, echo=False)


def get_session():
    with Session(engine) as session:
        yield session