from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- TRANSACTION SCHEMAS ---
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- BUDGET SCHEMAS ---
class BudgetBase(BaseModel):
    category: str
    limit: float

class BudgetCreate(BudgetBase):
    pass

class Budget(BudgetBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True