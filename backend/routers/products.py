from fastapi import APIRouter, Depends, HTTPException, status, Form, Path
from sqlalchemy.orm import Session
from database import get_db
from models.products import Product
from schemas.products import ProductBase, ProductCreate, Product as ProductSchema
from typing import List, Optional
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/products/", response_model=List[ProductSchema])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()  # Fetch products from DB
    #return JSONResponse(content=[product.__dict__ for product in products])
    return products

'''@router.get("/products/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()'''

@router.post("/products/", status_code=status.HTTP_201_CREATED, response_model=ProductSchema)
def create_product(
    product_id: str = Form(...),
    product_name: str = Form(...),
    warehouse_id: str = Form(...),
    rate_per_unit: float = Form(...),
    stock: int = Form(...),
    db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(Product.product_id == product_id).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product ID already exists")

    new_product = Product(
        product_id=product_id,
        product_name=product_name,
        warehouse_id=warehouse_id,
        stock=stock,
        rate_per_unit=rate_per_unit
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product

@router.get("/products/{product_id}", response_model=ProductSchema)
def get_product(product_id: str = Path(...), db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: str = Path(...),
    product_name: Optional[str] = Form(None),
    warehouse_id: Optional[str] = Form(None),
    stock: Optional[int] = Form(None),
    rate_per_unit: Optional[float] = Form(None),
    db: Session = Depends(get_db)
):
    """Update an existing product"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields if provided
    if product_name is not None:
        product.product_name = product_name
    if warehouse_id is not None:
        product.warehouse_id = warehouse_id
    if stock is not None:
        product.stock = stock
    if rate_per_unit is not None:
        product.rate_per_unit = rate_per_unit
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str = Path(...), db: Session = Depends(get_db)):
    """Delete a product"""
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None