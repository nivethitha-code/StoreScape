from sqlalchemy import Column, String, Integer, ForeignKey
from database import Base

class PurchaseDetail(Base):
    __tablename__ = "purchase_details"

    purchase_id = Column(String(4), ForeignKey("purchase.purchase_id"), primary_key=True)
    product_id = Column(String(4), ForeignKey("products.product_id"), primary_key=True)
    quantity = Column(Integer)