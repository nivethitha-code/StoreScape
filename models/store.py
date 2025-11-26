from sqlalchemy import Column, String, ForeignKey
from database import Base

class Store(Base):
    __tablename__ = "store"

    store_id = Column(String(4), primary_key=True)
    branch_id = Column(String(8), ForeignKey("branches.branch_id"), unique=True)
    address = Column(String(200))
    contact_number = Column(String(15))