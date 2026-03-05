# 🏪 StoreScape — Retail Store Automation System

> A full-stack retail management web app that streamlines store operations — from inventory management to bill generation — all in one place.

---

## 🔗 Live Demo & Screenshots

🌐 **Deployed App:** [storescape.vercel.app](https://storescape-frontend.vercel.app)

| Login | Admin Dashboard | Bill Generation |
|-------|----------------|-----------------|
| <img width="1528" height="735" alt="image" src="https://github.com/user-attachments/assets/25900a02-1e51-46e4-88a9-ebe5a2a52ea8" /> | <img width="1300" height="607" alt="image" src="https://github.com/user-attachments/assets/79e86f56-429a-43a6-a075-31699344dcef" />   <img width="1300" height="607" alt="image" src="https://github.com/user-attachments/assets/cfa3623b-c0ca-4181-8645-51f9e814e488" />   <img width="1300" height="607" alt="image" src="https://github.com/user-attachments/assets/2694f20e-d395-4b77-af4a-32f87fca716c" /> | DFDHTF |

> 📁 Add your screenshots to a `screenshots/` folder in the repo root.

---

## 🧱 Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 Installation & Setup

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Environment Variables**

`backend/.env`
```
DATABASE_URL=your_supabase_postgresql_url
FRONTEND_URL=http://localhost:5173
```

`frontend/.env`
```
VITE_API_URL=http://localhost:8000
```

---

## 💡 Usage

- Login with your **Employee ID** and select your role (Admin / Cashier)
- **Admin** → manage products, suppliers, and warehouses with full CRUD
- **Cashier** → look up customer by phone, generate bill, apply discount, print receipt

---

## ✨ Features

**🔐 Authentication**
- Role-based login using Employee ID — validated against the employees table in DB
- Three separate validations: Employee ID exists → Password matches → Role matches position
- Signup saves new employee directly to Supabase with duplicate ID and name checks
- Forgot password resets via Employee ID validation — no hardcoded credentials anywhere

**🛠️ Admin Dashboard**
- Full CRUD for Products, Suppliers, and Warehouses across 3 tabbed sections
- Real-time search and filter on all tables
- Modal-based add/edit forms with pre-filled data for editing
- Error handling for failed API calls shown inline per section

**🧾 Bill Generation (Cashier)**
- Phone number lookup (validated as 10-digit) to fetch existing customer details
- If customer not found — inline new customer registration form appears automatically
- Membership status check — `Active Member` gets 5% discount applied automatically
- Dynamic bill rows — add/remove rows, auto-calculates amount per row (qty × rate)
- Product ID validation on each row — checks against database before allowing entry
- Auto-generated unique bill number using date + random suffix
- Payment method selection — Cash, Card, UPI
- On print — sale is saved to `sales` table, each row saved to `sales_details` table
- Stock auto-reduced per product on every successful sale
- Insufficient stock throws a clear error before saving

**⚙️ Backend**
- 11 database tables managed via SQLAlchemy ORM
- Alembic migrations — any model change auto-detected and applied, no manual SQL needed
- FastAPI with full CRUD routers for all 11 entities
- Pydantic schemas for strict request/response validation
- CORS configured for cross-origin requests between Vercel frontend and Render backend

---

## 📚 Key Learnings & Challenges

- **Inventory sync on billing**: Implementing real-time stock reduction on every sale required careful ordering — validate product ID → check sufficient stock → save sale → reduce stock, all in one transaction to avoid data inconsistency
- **Customer flow design**: Designing the cashier flow to handle both existing and new customers seamlessly — phone lookup first, then conditionally showing the registration form without navigating away
- **Membership discount logic**: The 5% discount needed to check `membership_status === 'Active Member'` specifically, since customers could also be `Non-Member` or have expired memberships
- **Role-based access**: Separating admin and cashier views completely based on the `position` column in the employees table, with three-step login validation ensuring no role mismatch
- **Database schema design**: Designing 11 interlinked tables with proper foreign key relationships — especially the `sales` → `sales_details` → `products` chain for billing and inventory tracking

---

## 🗂️ Project Structure

```
StoreScape/
├── backend/
│   ├── models/       # SQLAlchemy ORM (11 tables)
│   ├── routers/      # FastAPI route handlers
│   ├── schemas/      # Pydantic schemas
│   ├── alembic/      # DB migrations
│   ├── main.py       # Entry point + login
│   └── schema.sql    # Supabase setup
└── frontend/
    └── src/
        └── components/    # LoginPage, AdminPage, BillPage
```

---

## 📄 License & Author

MIT License © 2026

**D Nivethitha** — [LinkedIn](https://www.linkedin.com/in/nivethitha-d-306a46326/) · [GitHub](https://github.com/nivethitha-code) · nivethithadharmarajan25@gmail.com 
