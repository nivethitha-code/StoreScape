from pydantic import BaseModel

class SupplierBase(BaseModel):
    supplier_id: str
    supplier_name: str
    contact: str
    address: str

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    class Config:
        from_attributes = True