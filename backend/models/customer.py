from sqlalchemy import Column, String, Date
from database import Base

class Customer(Base):
    __tablename__ = "customer"

    customer_id = Column(String(4), primary_key=True)
    customer_name = Column(String(100), nullable=False)
    phone_number = Column(String(12),unique=True)
    email = Column(String(100))
    address = Column(String(200))
    start_date = Column(Date)
    expiry_date = Column(Date)
    membership_status = Column(String(50))