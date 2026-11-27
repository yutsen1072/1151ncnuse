from datetime import date, datetime, time, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=50)
    password_hash: str = Field(max_length=255)
    name: str = Field(max_length=50)
    email: str = Field(unique=True, max_length=100)
    role: str = Field(default="student", max_length=20)  # student / teacher / admin
    status: str = Field(default="pending", max_length=20)  # pending / active / rejected
    created_at: datetime = Field(default_factory=utc_now)


class Classroom(SQLModel, table=True):
    __tablename__ = "classrooms"
    id: Optional[int] = Field(default=None, primary_key=True)
    room_code: str = Field(unique=True, index=True, max_length=20)
    name: str = Field(max_length=100)
    floor: int
    capacity: int
    equipment_desc: Optional[str] = None
    panorama_url: Optional[str] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None
    created_at: datetime = Field(default_factory=utc_now)


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    classroom_id: int = Field(foreign_key="classrooms.id")
    booking_date: date
    start_time: time
    end_time: time
    purpose: Optional[str] = None
    status: str = Field(default="pending", max_length=20)
    admin_comment: Optional[str] = None
    checked_out_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=utc_now)


class Course(SQLModel, table=True):
    __tablename__ = "courses"
    id: Optional[int] = Field(default=None, primary_key=True)
    course_code: str = Field(max_length=20)
    course_name: str = Field(max_length=100)
    teacher_id: int = Field(foreign_key="users.id")
    classroom_id: Optional[int] = Field(default=None, foreign_key="classrooms.id")
    course_date: date
    start_time: time
    end_time: time
    status: str = Field(default="pending", max_length=20)  # pending / confirmed
    created_at: datetime = Field(default_factory=utc_now)