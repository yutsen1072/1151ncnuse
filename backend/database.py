import os
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("找不到 DATABASE_URL，請確認 .env 檔案已正確設定")

# 若使用 Supabase Pooler 或需要 SSL，可保留預設設定
engine = create_engine(DATABASE_URL, echo=False)


def get_session():
    with Session(engine) as session:
        yield session