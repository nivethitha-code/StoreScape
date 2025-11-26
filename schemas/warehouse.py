from pydantic import BaseModel

class WarehouseBase(BaseModel):
    warehouse_id: str
    location: str

class WarehouseCreate(WarehouseBase):
    pass

class Warehouse(WarehouseBase):
    class Config:
        orm_mode = True