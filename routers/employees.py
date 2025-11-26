from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.employees import Employee
from schemas.employees import EmployeeBase, EmployeeCreate

router = APIRouter()

@router.get("/employees/")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.post("/employees/")
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    new_employee = Employee(**employee.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee