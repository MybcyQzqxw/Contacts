from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class ContactBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    is_favorite: Optional[bool] = False


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_favorite: Optional[bool] = None


class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ContactStats(BaseModel):
    total_contacts: int
    favorite_contacts: int
    contacts_with_email: int
    contacts_with_address: int
