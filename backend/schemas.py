from pydantic import BaseModel
from typing import Optional, List

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str # Changed from email to username to match the updated models

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- TRANSACTION SCHEMAS ---
class TransactionBase(BaseModel):
    description: str
    amount: float
    category: Optional[str] = "General"
    date: str  # Changed to str to match the 'YYYY-MM-DD' from your React frontend

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    owner_id: int # Updated to match 'owner_id' in your new models

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

# --- TOKEN SCHEMAS (Required for Login) ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None