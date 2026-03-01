from sqlalchemy import Column, String
from database import Base

class Warehouse(Base):
    __tablename__ = "warehouse"

    warehouse_id = Column(String(4), primary_key=True)
    location = Column(String(200))