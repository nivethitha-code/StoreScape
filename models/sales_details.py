from sqlalchemy import Column, String, Integer, Numeric, ForeignKey
from database import Base

class SalesDetail(Base):
    __tablename__ = "sales_details"

    sales_id = Column(String(4), ForeignKey("sales.sales_id"), primary_key=True)
    product_id = Column(String(4), ForeignKey("products.product_id"), primary_key=True)
    quantity = Column(Integer)
    total_amount = Column(Numeric(10,2))