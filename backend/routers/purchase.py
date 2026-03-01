from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.purchase import Purchase
from schemas.purchase import PurchaseBase, PurchaseCreate

router = APIRouter()

@router.get("/purchases/")
def get_purchases(db: Session = Depends(get_db)):
    return db.query(Purchase).all()

@router.post("/purchases/")
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    new_purchase = Purchase(**purchase.dict())
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase