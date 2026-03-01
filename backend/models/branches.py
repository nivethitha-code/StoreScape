from sqlalchemy import Column, String, ForeignKey
from database import Base

class Branch(Base):
    __tablename__ = "branches"

    branch_id = Column(String(8), primary_key=True)
    warehouse_id = Column(String(4), ForeignKey("warehouse.warehouse_id"))
    location = Column(String(200))