from fastapi import APIRouter, Depends ,Query,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.customer import Customer
from schemas.customer import CustomerBase, CustomerCreate

router = APIRouter()

@router.get("/customers/")
def get_customers(
    phone_number: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Customer)
    if phone_number:
        query = query.filter(Customer.phone_number == phone_number)
    return query.all()

@router.post("/customers/")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Check for duplicate phone number
    existing_phone = db.query(Customer).filter(Customer.phone_number == customer.phone_number).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Customer with this phone number already exists")
    
    # Check for duplicate customer_id
    existing_id = db.query(Customer).filter(Customer.customer_id == customer.customer_id).first()
    if existing_id:
        raise HTTPException(status_code=400, detail="Customer ID already exists")

    new_customer = Customer(**customer.dict())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer