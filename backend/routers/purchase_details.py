from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.purchase_details import PurchaseDetail
from schemas.purchase_details import PurchaseDetailBase, PurchaseDetailCreate

router = APIRouter()

@router.get("/purchase_details/")
def get_purchase_details(db: Session = Depends(get_db)):
    return db.query(PurchaseDetail).all()

@router.post("/purchase_details/")
def create_purchase_detail(purchase_detail: PurchaseDetailCreate, db: Session = Depends(get_db)):
    new_purchase_detail = PurchaseDetail(**purchase_detail.dict())
    db.add(new_purchase_detail)
    db.commit()
    db.refresh(new_purchase_detail)
    return new_purchase_detail