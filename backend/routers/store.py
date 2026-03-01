from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.store import Store
from schemas.store import StoreBase, StoreCreate

router = APIRouter()

@router.get("/stores/")
def get_stores(db: Session = Depends(get_db)):
    return db.query(Store).all()

@router.post("/stores/")
def create_store(store: StoreCreate, db: Session = Depends(get_db)):
    new_store = Store(**store.dict())
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    return new_store