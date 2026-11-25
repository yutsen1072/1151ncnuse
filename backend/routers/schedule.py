from datetime import date, time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models import Booking, Classroom, Course, User

router = APIRouter(prefix="/api/courses", tags=["Schedule (志願排課模組)"])


# ==========================================
# Pydantic 請求 / 回應格式定義 (Schemas)
# ==========================================
class CourseCreate(BaseModel):
    course_code: str
    course_name: str
    teacher_id: int
    classroom_id: Optional[int] = None
    course_date: date
    start_time: time
    end_time: time
    status: str = "pending"  # 老師登記預設 'pending'，管理員指派可傳 'confirmed'


class CourseUpdate(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None
    teacher_id: Optional[int] = None
    classroom_id: Optional[int] = None
    course_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: Optional[str] = None


class CourseMove(BaseModel):
    course_date: date
    start_time: time
    end_time: time


# ==========================================
# 1. 取得課程清單 (支援依老師篩選，同時回傳 FullCalendar 格式欄位)
# ==========================================
@router.get("")
def get_courses(
    teacher_id: Optional[int] = Query(None, description="傳入老師ID則只回傳該老師的課程"),
    session: Session = Depends(get_session),
):
    statement = select(Course)
    if teacher_id is not None:
        statement = statement.where(Course.teacher_id == teacher_id)

    courses = session.exec(statement).all()

    # 預先撈出老師與教室對照表，方便組裝顯示名稱
    users_map = {u.id: u.name for u in session.exec(select(User)).all()}
    rooms_map = {r.id: r.room_code for r in session.exec(select(Classroom)).all()}

    result = []
    for c in courses:
        teacher_name = users_map.get(c.teacher_id, "未指派")
        room_code = rooms_map.get(c.classroom_id, "未定教室") if c.classroom_id else "未定教室"

        result.append({
            "id": c.id,
            "course_code": c.course_code,
            "course_name": c.course_name,
            "teacher_id": c.teacher_id,
            "teacher_name": teacher_name,
            "classroom_id": c.classroom_id,
            "room_code": room_code,
            "course_date": str(c.course_date),
            "start_time": str(c.start_time),
            "end_time": str(c.end_time),
            "status": c.status,
            # 以下三個欄位專供前端 FullCalendar 週日曆直接渲染使用
            "title": f"[{room_code}] {c.course_name} ({teacher_name})",
            "start": f"{c.course_date}T{c.start_time}",
            "end": f"{c.course_date}T{c.end_time}",
            "color": "#4f772d" if c.status == "confirmed" else "#d4a373",
        })
    return result


# ==========================================
# 2. 時間衝突偵測 API (管理員專用：檢查老師衝堂、教室衝堂、空間借用衝堂)
# ==========================================
@router.get("/conflicts")
def get_schedule_conflicts(session: Session = Depends(get_session)):
    courses = session.exec(select(Course)).all()
    bookings = session.exec(
        select(Booking).where(Booking.status.in_(["approved", "checked_out"]))
    ).all()

    users_map = {u.id: u.name for u in session.exec(select(User)).all()}
    rooms_map = {r.id: r.room_code for r in session.exec(select(Classroom)).all()}

    conflicts = []

    def is_overlap(s1: time, e1: time, s2: time, e2: time) -> bool:
        return s1 < e2 and e1 > s2

    # A. 檢查課程與課程之間的衝突 (同老師衝堂 / 同教室衝堂)
    for i in range(len(courses)):
        for j in range(i + 1, len(courses)):
            c1, c2 = courses[i], courses[j]
            if c1.course_date != c2.course_date:
                continue
            if not is_overlap(c1.start_time, c1.end_time, c2.start_time, c2.end_time):
                continue

            # 條件 1：同一位老師在同一時段排了兩門課
            if c1.teacher_id == c2.teacher_id:
                conflicts.append({
                    "type": "教師時間衝突",
                    "date": str(c1.course_date),
                    "detail": f"{users_map.get(c1.teacher_id)} 同時段有「{c1.course_name}」({c1.start_time}-{c1.end_time}) 與「{c2.course_name}」({c2.start_time}-{c2.end_time})",
                    "course_ids": [c1.id, c2.id],
                })

            # 條件 2：同一間教室在同一時段被兩門課佔用
            if c1.classroom_id and c2.classroom_id and c1.classroom_id == c2.classroom_id:
                conflicts.append({
                    "type": "教室排課衝突",
                    "date": str(c1.course_date),
                    "detail": f"教室 {rooms_map.get(c1.classroom_id)} 同時段有「{c1.course_name}」({c1.start_time}-{c1.end_time}) 與「{c2.course_name}」({c2.start_time}-{c2.end_time})",
                    "course_ids": [c1.id, c2.id],
                })

    # B. 完整款整合：檢查排課是否與「空間借用模組」已核准的借用衝突
    for c in courses:
        if not c.classroom_id:
            continue
        for b in bookings:
            if c.course_date == b.booking_date and c.classroom_id == b.classroom_id:
                if is_overlap(c.start_time, c.end_time, b.start_time, b.end_time):
                    conflicts.append({
                        "type": "空間借用衝突",
                        "date": str(c.course_date),
                        "detail": f"教室 {rooms_map.get(c.classroom_id)} 排課「{c.course_name}」({c.start_time}-{c.end_time}) 與活動借用「{b.purpose}」({b.start_time}-{b.end_time}) 衝堂",
                        "course_ids": [c.id],
                        "booking_id": b.id,
                    })

    return {"total_conflicts": len(conflicts), "conflicts": conflicts}


# ==========================================
# 3. 老師登記志願 / 管理員新增課程
# ==========================================
@router.post("")
def create_course(payload: CourseCreate, session: Session = Depends(get_session)):
    if payload.start_time >= payload.end_time:
        raise HTTPException(status_code=400, detail="結束時間必須晚於開始時間")

    new_course = Course(**payload.model_dump())
    session.add(new_course)
    session.commit()
    session.refresh(new_course)
    return {"message": "課程登記成功", "course": new_course}


# ==========================================
# 4. 修改課程 (老師僅能改自己課程 / 管理員可改全部並指派老師)
# ==========================================
@router.put("/{course_id}")
def update_course(
    course_id: int,
    payload: CourseUpdate,
    operator_id: int = Query(..., description="目前操作者的 user_id"),
    operator_role: str = Query(..., description="目前操作者的角色: teacher 或 admin"),
    session: Session = Depends(get_session),
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="找不到該課程")

    # 權限驗證：老師只能修改自己的課程
    if operator_role == "teacher" and course.teacher_id != operator_id:
        raise HTTPException(status_code=403, detail="權限不足：老師只能修改自己的課程")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(course, key, value)

    if course.start_time >= course.end_time:
        raise HTTPException(status_code=400, detail="結束時間必須晚於開始時間")

    session.add(course)
    session.commit()
    session.refresh(course)
    return {"message": "課程更新成功", "course": course}


# ==========================================
# 5. 管理員滑鼠 Drag & Drop 拖曳更新日期與時間
# ==========================================
@router.patch("/{course_id}/move")
def move_course_schedule(
    course_id: int,
    payload: CourseMove,
    session: Session = Depends(get_session),
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="找不到該課程")

    if payload.start_time >= payload.end_time:
        raise HTTPException(status_code=400, detail="結束時間必須晚於開始時間")

    course.course_date = payload.course_date
    course.start_time = payload.start_time
    course.end_time = payload.end_time
    course.status = "confirmed"  # 拖曳調整後自動標記為已排定

    session.add(course)
    session.commit()
    session.refresh(course)
    return {"message": "日曆拖曳排課時間已更新", "course": course}


# ==========================================
# 6. 刪除課程
# ==========================================
@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    operator_id: int = Query(..., description="目前操作者的 user_id"),
    operator_role: str = Query(..., description="目前操作者的角色: teacher 或 admin"),
    session: Session = Depends(get_session),
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="找不到該課程")

    if operator_role == "teacher" and course.teacher_id != operator_id:
        raise HTTPException(status_code=403, detail="權限不足：老師只能刪除自己的課程")

    session.delete(course)
    session.commit()
    return {"message": "課程已刪除"}