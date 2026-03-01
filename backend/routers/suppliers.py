from fastapi import APIRouter, Depends, HTTPException, status, Form, Path
from sqlalchemy.orm import Session
from database import get_db
from models.suppliers import Supplier
from schemas.suppliers import SupplierBase, SupplierCreate
from typing import List,Optional
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/suppliers/",response_model=List[SupplierBase])
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()  # Fetch suppliers from DB
    #return JSONResponse(content=[supplier.__dict__ for supplier in suppliers])
    return suppliers

'''@router.get("/suppliers/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Supplier).all()'''

@router.post("/suppliers/", status_code=status.HTTP_201_CREATED,response_model=SupplierBase)
def create_supplier(
    supplier_id: str = Form(...),
    supplier_name: str = Form(...),
    contact: str = Form(...),
    address: str = Form(...),
    db: Session = Depends(get_db)
):
    """Create a new supplier from form data"""
    existing_supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if existing_supplier:
        raise HTTPException(status_code=400, detail="Supplier ID already exists")

    new_supplier = Supplier(
        supplier_id=supplier_id,
        supplier_name=supplier_name,
        contact=contact,
        address=address
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    
    return new_supplier

@router.get("/suppliers/{supplier_id}", response_model=SupplierBase)
def get_supplier(supplier_id: str = Path(...), db: Session = Depends(get_db)):
    """Get a specific supplier by ID"""
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.put("/suppliers/{supplier_id}", response_model=SupplierBase)
def update_supplier(
    supplier_id: str = Path(...),
    supplier_name: Optional[str] = Form(None),
    contact: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Update an existing supplier"""
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    # Update fields if provided
    if supplier_name is not None:
        supplier.supplier_name = supplier_name
    if contact is not None:
        supplier.contact = contact
    if address is not None:
        supplier.address = address
    
    db.commit()
    db.refresh(supplier)
    return supplier

@router.delete("/suppliers/{supplier_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: str, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}