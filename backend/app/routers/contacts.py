from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List
from app.database.database import get_db
from app.models.contact import Contact
from app.schemas.contact import (
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    ContactStats
)

router = APIRouter()


@router.get("/contacts/stats", response_model=ContactStats)
def get_contacts_stats(db: Session = Depends(get_db)):
    """获取联系人统计信息"""
    total_contacts = db.query(func.count(Contact.id)).scalar()
    favorite_contacts = db.query(func.count(Contact.id)).filter(
        Contact.is_favorite.is_(True)
    ).scalar()
    contacts_with_email = db.query(func.count(Contact.id)).filter(
        and_(Contact.email.isnot(None), Contact.email != "")
    ).scalar()
    contacts_with_address = db.query(func.count(Contact.id)).filter(
        and_(Contact.address.isnot(None), Contact.address != "")
    ).scalar()

    return ContactStats(
        total_contacts=total_contacts,
        favorite_contacts=favorite_contacts,
        contacts_with_email=contacts_with_email,
        contacts_with_address=contacts_with_address
    )


@router.get("/contacts", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    favorites_only: bool = False,
    db: Session = Depends(get_db)
):
    """获取联系人列表，支持只显示收藏"""
    query = db.query(Contact)
    if favorites_only:
        query = query.filter(Contact.is_favorite.is_(True))
    contacts = query.offset(skip).limit(limit).all()
    return contacts


@router.get("/contacts/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    """获取指定联系人"""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if contact is None:
        raise HTTPException(status_code=404, detail="联系人未找到")
    return contact


@router.post("/contacts", response_model=ContactResponse,
             status_code=status.HTTP_201_CREATED)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """创建新联系人"""
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.put("/contacts/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """更新联系人信息"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact is None:
        raise HTTPException(status_code=404, detail="联系人未找到")

    contact_data = contact.dict(exclude_unset=True)
    for field, value in contact_data.items():
        setattr(db_contact, field, value)

    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.patch("/contacts/{contact_id}/favorite",
              response_model=ContactResponse)
def toggle_favorite(contact_id: int, db: Session = Depends(get_db)):
    """切换联系人收藏状态"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact is None:
        raise HTTPException(status_code=404, detail="联系人未找到")

    db_contact.is_favorite = not db_contact.is_favorite
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    """删除联系人"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact is None:
        raise HTTPException(status_code=404, detail="联系人未找到")
    
    db.delete(db_contact)
    db.commit()
    return {"message": "联系人已删除"}


@router.get("/contacts/search/{query}", response_model=List[ContactResponse])
def search_contacts(query: str, db: Session = Depends(get_db)):
    """搜索联系人"""
    contacts = db.query(Contact).filter(
        or_(
            Contact.name.contains(query),
            Contact.phone.contains(query),
            Contact.email.contains(query)
        )
    ).all()
    return contacts
