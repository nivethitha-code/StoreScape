from sqlalchemy import Column, String, ForeignKey, Numeric
from database import Base

class Purchase(Base):
    __tablename__ = "purchase"

    purchase_id = Column(String(4), primary_key=True)
    branch_id = Column(String(8), ForeignKey("branches.branch_id"))
    supplier_id = Column(String(4), ForeignKey("suppliers.supplier_id"))
    payment = Column(Numeric(10,2))