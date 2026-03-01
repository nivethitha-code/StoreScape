from pydantic import BaseModel
from typing import Optional
from datetime import date

class CustomerBase(BaseModel):
    customer_id: str
    customer_name: str
    phone_number: str
    email: Optional[str] = None
    address: Optional[str] = None
    start_date: date
    expiry_date: date
    membership_status: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    class Config:
        from_attributes = True