from pydantic import BaseModel

class BranchBase(BaseModel):
    branch_id: str
    warehouse_id: str
    location: str

class BranchCreate(BranchBase):
    pass

class Branch(BranchBase):
    class Config:
        orm_mode = True