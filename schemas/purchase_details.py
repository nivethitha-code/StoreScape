from pydantic import BaseModel

class PurchaseDetailBase(BaseModel):
    purchase_id: str
    product_id: str
    quantity: int

class PurchaseDetailCreate(PurchaseDetailBase):
    pass

class PurchaseDetail(PurchaseDetailBase):
    class Config:
        orm_mode = True
