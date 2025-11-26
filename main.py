from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from database import engine,Base
import models
from routers import warehouse, branches, store, employees, suppliers, purchase, products, purchase_details, customer, sales, sales_details
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse,JSONResponse,RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.mount("/static",StaticFiles(directory="static"),name="static")

'''@app.get("/products/")
async def get_admin_products():
    return FileResponse("static/html/admin_page.html")

@app.get("/suppliers/")
async def get_admin_suppliers():
    return FileResponse("static/html/admin_page.html")'''

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

# Hardcoded credentials (updated by signup in frontend for simplicity)
USERS = {
    "admin": {"password": "admin123", "role": "admin"},
    "cashier": {"password": "cashier123", "role": "cashier"},
}


@app.get("/")
async def get_login():
    return FileResponse("static/html/login_page.html")

@app.post("/")
async def login(login_request: LoginRequest):
    user = USERS.get(login_request.username)
    if not user or user["password"] != login_request.password or user["role"] != login_request.role:
        raise HTTPException(status_code=401, detail="Invalid credentials or role")
    
    if user["role"] == "admin":
        return RedirectResponse(url="/admin/", status_code=303)
    elif user["role"] == "cashier":
        return RedirectResponse(url="/cashier/", status_code=303)

@app.get("/signup/")
async def get_signup():
    return FileResponse("static/html/login_page.html")

'''@app.post("/signup/")
async def signup(login_request: LoginRequest):
    if login_request.username in USERS:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    USERS[login_request.username] = {
        "password": login_request.password,
        "role": login_request.role
    }
    return RedirectResponse(url="/", status_code=303)  # Redirect back to login after signup'''


@app.get("/admin/")
async def get_admin():
    return FileResponse("static/html/admin_page.html")

@app.get("/cashier/")
async def get_bill_page():
    return FileResponse("static/html/bill_page.html")


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
    uvicorn.run(app, host="127.0.0.1", port=8000)