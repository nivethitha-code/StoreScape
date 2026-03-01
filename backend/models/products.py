from sqlalchemy import Column, String, Integer, ForeignKey, Numeric
from database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(String(4), primary_key=True)
    product_name = Column(String(100), nullable=False)
    warehouse_id = Column(String(4), ForeignKey("warehouse.warehouse_id"))
    stock = Column(Integer)
    rate_per_unit = Column(Numeric(10,2))