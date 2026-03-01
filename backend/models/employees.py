from sqlalchemy import Column, String, ForeignKey
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String(4), primary_key=True)
    branch_id = Column(String(8), ForeignKey("branches.branch_id"))
    employee_name = Column(String(100), nullable=False)
    position = Column(String(20))
    password = Column(String(100), nullable=True)
    phone_number = Column(String(15))