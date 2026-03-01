from pydantic import BaseModel

class StoreBase(BaseModel):
    store_id: str
    branch_id: str
    address: str
    contact_number: str

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    class Config:
        from_attributes = True