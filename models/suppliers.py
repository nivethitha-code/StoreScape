from sqlalchemy import Column, String
from database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    supplier_id = Column(String(4), primary_key=True)
    supplier_name = Column(String(100), nullable=False)
    contact = Column(String(12))
    address = Column(String(200))