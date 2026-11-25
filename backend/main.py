from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import get_session
from models import Classroom, User
from routers import schedule

app = FastAPI(title="管院空間與排課整合系統 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載你的志願排課模組
app.include_router(schedule.router)


# 提供下拉選單所需的老師與教室基本清單
@app.get("/api/options")
def get_form_options(session: Session = Depends(get_session)):
    teachers = session.exec(select(User).where(User.role == "teacher")).all()
    classrooms = session.exec(select(Classroom)).all()
    return {
        "teachers": [{"id": t.id, "name": t.name} for t in teachers],
        "classrooms": [{"id": c.id, "room_code": c.room_code, "name": c.name} for c in classrooms],
    }