from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.sales import Sale
from models.customer import Customer
from schemas.sales import SaleBase, SaleCreate

router = APIRouter()

@router.get("/sales/")
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()

@router.post("/sales/")
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    # Check if sales_id already exists
    existing_sale = db.query(Sale).filter(Sale.sales_id == sale.sales_id).first()
    if existing_sale:
        raise HTTPException(status_code=400, detail="Sale ID already exists")
    
    # Check if customer_id exists
    customer = db.query(Customer).filter(Customer.customer_id == sale.customer_id).first()
    if not customer:
        raise HTTPException(status_code=400, detail="Customer ID does not exist")
    
    new_sale = Sale(**sale.dict())
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale