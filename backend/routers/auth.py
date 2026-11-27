from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from passlib.context import CryptContext
from database import get_session
from models import User

router = APIRouter(prefix="/api/auth", tags=["Auth 帳號驗證"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    email: str
    role: str = "student"

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(req: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == req.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="此帳號已被註冊")
    
    new_user = User(
        username=req.username,
        password_hash=pwd_context.hash(req.password),
        name=req.name,
        email=req.email,
        role=req.role,
        status="pending"
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "註冊成功，請等待管理員審核", "user_id": new_user.id}

@router.post("/login")
def login(req: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == req.username)).first()
    if not user or not pwd_context.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="帳號或密碼錯誤")
    if user.status != "active":
        raise HTTPException(status_code=403, detail=f"帳號目前狀態為 {user.status}，尚未啟用")
    
    return {
        "message": "登入成功",
        "user": {"id": user.id, "username": user.username, "name": user.name, "role": user.role}
    }