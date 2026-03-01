from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from models import Branch, Customer, Employee, Product, Purchase, PurchaseDetail, Sale, SalesDetail, Store, Supplier, Warehouse
from routers import warehouse, branches, store, employees, suppliers, purchase, products, purchase_details, customer, sales, sales_details
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = FastAPI()
logger = logging.getLogger(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created successfully")
except Exception as e:
    print(f"\n❌ DATABASE ERROR: {e}\n")
    logger.error(f"Could not initialize database tables on startup: {e}")


class LoginRequest(BaseModel):
    employee_id: str   # ← changed from username to employee_id
    password: str
    role: str


@app.post("/login/")
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    # Step 1: Check if employee_id exists
    employee = db.query(Employee).filter(
        Employee.employee_id == login_request.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=401, detail="Employee ID not found")

    # Step 2: Check password
    if employee.password != login_request.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Step 3: Check role matches position
    if login_request.role.lower() not in employee.position.lower():
        raise HTTPException(status_code=401, detail="Role does not match your position")

    return {
        "message": "Login successful",
        "role": login_request.role,
        "employee_id": employee.employee_id,
        "name": employee.employee_name,
        "position": employee.position
    }


@app.get("/health/")
async def health_check():
    return {"status": "ok"}


@app.exception_handler(404)
def not_found_error(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Not Found"})


@app.exception_handler(500)
def internal_error(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


app.include_router(warehouse.router, tags=["Warehouse"])
app.include_router(branches.router, tags=["Branches"])
app.include_router(store.router, tags=["Store"])
app.include_router(employees.router, tags=["Employees"])
app.include_router(suppliers.router, tags=["Suppliers"])
app.include_router(purchase.router, tags=["Purchase"])
app.include_router(products.router, tags=["Products"])
app.include_router(purchase_details.router, tags=["Purchase Details"])
app.include_router(customer.router, tags=["Customer"])
app.include_router(sales.router, tags=["Sales"])
app.include_router(sales_details.router, tags=["Sales Details"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)