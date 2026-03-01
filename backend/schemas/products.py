from pydantic import BaseModel
from decimal import Decimal

class ProductBase(BaseModel):
    product_id: str
    product_name: str
    warehouse_id: str
    stock: int
    rate_per_unit: Decimal

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    class Config:
        from_attributes = True