from pydantic import BaseModel
from typing import Optional

class EmployeeBase(BaseModel):
    employee_id: str
    employee_name: str
    position: str
    phone_number: str
    branch_id: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    password: Optional[str] = None

class Employee(EmployeeBase):
    class Config:
        from_attributes = True