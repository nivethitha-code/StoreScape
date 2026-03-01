from pydantic import BaseModel
from decimal import Decimal

class PurchaseBase(BaseModel):
    purchase_id: str
    branch_id: str
    supplier_id: str
    payment: Decimal

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    class Config:
        from_attributes = True