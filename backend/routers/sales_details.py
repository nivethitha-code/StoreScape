from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.sales_details import SalesDetail
from models.products import Product
from schemas.sales_details import SalesDetailBase, SalesDetailCreate

router = APIRouter()

@router.get("/sales_details/")
def get_sales_details(db: Session = Depends(get_db)):
    return db.query(SalesDetail).all()

@router.post("/sales_details/")
def create_sales_detail(sales_detail: SalesDetailCreate, db: Session = Depends(get_db)):
    # Check if product_id exists
    product = db.query(Product).filter(Product.product_id == sales_detail.product_id).first()
    if not product:
        raise HTTPException(status_code=400, detail="Product ID does not exist")
    
    # Check if sufficient stock is available
    if product.stock < sales_detail.quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. Available: {product.stock}, Requested: {sales_detail.quantity}"
        )
    
    # Reduce the stock
    product.stock -= sales_detail.quantity
    
    # Create the sales detail record
    new_sales_detail = SalesDetail(**sales_detail.dict())
    db.add(new_sales_detail)
    
    # Commit both the stock update and sales detail creation
    db.commit()
    db.refresh(new_sales_detail)
    db.refresh(product)  # Refresh product to get updated stock
    
    return new_sales_detail

'''from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.sales_details import SalesDetail
from models.products import Product
from schemas.sales_details import SalesDetailBase, SalesDetailCreate

router = APIRouter()

@router.get("/sales_details/")
def get_sales_details(db: Session = Depends(get_db)):
    return db.query(SalesDetail).all()

@router.post("/sales_details/")
def create_sales_detail(sales_detail: SalesDetailCreate, db: Session = Depends(get_db)):
    # Check if product_id exists
    product = db.query(Product).filter(Product.product_id == sales_detail.product_id).first()
    if not product:
        raise HTTPException(status_code=400, detail="Product ID does not exist")
    
    new_sales_detail = SalesDetail(**sales_detail.dict())
    db.add(new_sales_detail)
    db.commit()
    db.refresh(new_sales_detail)
    return new_sales_detail'''