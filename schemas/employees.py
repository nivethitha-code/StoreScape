from pydantic import BaseModel

class EmployeeBase(BaseModel):
    employee_id: str
    branch_id: str
    employee_name: str
    position: str
    phone_number: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    class Config:
        orm_mode = True