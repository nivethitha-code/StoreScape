from fastapi import APIRouter, Depends, HTTPException
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
    existing_id = db.query(Employee).filter(Employee.employee_id == employee.employee_id).first()
    if existing_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    existing_name = db.query(Employee).filter(Employee.employee_name == employee.employee_name).first()
    if existing_name:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_employee = Employee(**employee.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@router.get("/employees/{employee_id}")
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/employees/{employee_id}")
def update_employee(employee_id: str, employee: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted successfully"}

@router.post("/employees/reset-password/")
def reset_password(
    employee_id: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    # Validate employee_id exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee ID not found")
    employee.password = new_password
    db.commit()
    return {"message": "Password reset successful"}