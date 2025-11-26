from pydantic import BaseModel
from datetime import date

class SaleBase(BaseModel):
    sales_id: str
    customer_id: str
    sales_date: date
    payment_method: str

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    class Config:
        orm_mode = True