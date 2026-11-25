import os
from pathlib import Path
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

# 明確指向專案根目錄 (1151ncnuse/.env)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError(f"找不到 DATABASE_URL，請確認 {env_path} 檔案設定")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def get_session():
    with Session(engine) as session:
        yield session