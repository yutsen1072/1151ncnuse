from typing import Optional
from datetime import datetime, date, time
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=50, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    name: str = Field(max_length=50)
    email: str = Field(max_length=100, unique=True)
    role: str = Field(default="student", max_length=20)      # student / teacher / admin
    status: str = Field(default="pending", max_length=20)    # pending / active / rejected
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class Classroom(SQLModel, table=True):
    __tablename__ = "classrooms"
    id: Optional[int] = Field(default=None, primary_key=True)
    room_code: str = Field(max_length=50, unique=True)
    room_name: str = Field(max_length=100)
    capacity: int = Field(default=30)
    status: str = Field(default="available", max_length=20)

class Course(SQLModel, table=True):
    __tablename__ = "courses"
    id: Optional[int] = Field(default=None, primary_key=True)
    course_code: str = Field(max_length=50)
    course_name: str = Field(max_length=100)
    teacher_id: int = Field(foreign_key="users.id")
    classroom_id: int = Field(foreign_key="classrooms.id")
    course_date: date
    start_time: time
    end_time: time
    status: str = Field(default="scheduled", max_length=20)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)