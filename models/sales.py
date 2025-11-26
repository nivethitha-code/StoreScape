from sqlalchemy import Column, String, Date, ForeignKey
from database import Base

class Sale(Base):
    __tablename__ = "sales"

    sales_id = Column(String(4), primary_key=True)
    customer_id = Column(String(4), ForeignKey("customer.customer_id"))
    sales_date = Column(Date)
    payment_method = Column(String(20))