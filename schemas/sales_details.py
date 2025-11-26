from pydantic import BaseModel
from decimal import Decimal

class SalesDetailBase(BaseModel):
    sales_id: str
    product_id: str
    quantity: int
    total_amount: Decimal

class SalesDetailCreate(SalesDetailBase):
    pass

class SalesDetail(SalesDetailBase):
    class Config:
        orm_mode = True