from fastapi import APIRouter, Depends, HTTPException, status, Form, Path
from sqlalchemy.orm import Session
from database import get_db
from models.warehouse import Warehouse
from schemas.warehouse import WarehouseBase, WarehouseCreate
from typing import List, Optional

router = APIRouter()

@router.get("/warehouses/", response_model=List[WarehouseBase])
def get_warehouses(db: Session = Depends(get_db)):
    warehouses = db.query(Warehouse).all()
    return warehouses

@router.post("/warehouses/", status_code=status.HTTP_201_CREATED, response_model=WarehouseBase)
def create_warehouse(
    warehouse_id: str = Form(...),
    location: str = Form(...),
    db: Session = Depends(get_db)
):
    existing_warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    if existing_warehouse:
        raise HTTPException(status_code=400, detail="Warehouse ID already exists")

    new_warehouse = Warehouse(
        warehouse_id=warehouse_id,
        location=location,
    )
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

@router.get("/warehouses/{warehouse_id}", response_model=WarehouseBase)
def get_warehouse(warehouse_id: str = Path(...), db: Session = Depends(get_db)):
    """Get a specific warehouse by ID"""
    warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse

@router.put("/warehouses/{warehouse_id}", response_model=WarehouseBase)
def update_warehouse(
    warehouse_id: str = Path(...),
    location: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Update an existing warehouse"""
    warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    # Update fields if provided
    if location is not None:
        warehouse.location = location
    
    db.commit()
    db.refresh(warehouse)
    return warehouse


@router.delete("/warehouses/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_warehouse(warehouse_id: str = Path(...), db: Session = Depends(get_db)):
    warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    db.delete(warehouse)
    db.commit()
    return None