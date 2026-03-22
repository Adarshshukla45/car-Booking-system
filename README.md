# 🚗 DriveRentSystem — Full MERN Car Rental App

India's #1 Self-Drive Car Rental Platform built with **MongoDB + Express + React + Node.js**

---

## 📁 Project Structure

```
driveindia/
├── backend/                    ← Node.js + Express API
│   ├── server.js               ← Entry point
│   ├── package.json
│   ├── .env.example            ← Copy to .env
│   ├── models/
│   │   ├── User.js             ← User schema (bcrypt password)
│   │   ├── Car.js              ← Car schema
│   │   └── Booking.js          ← Booking schema
│   ├── routes/
│   │   ├── auth.js             ← Register, Login, /me
│   │   ├── cars.js             ← CRUD for cars
│   │   └── bookings.js         ← Create, list, cancel bookings
│   ├── middleware/
│   │   └── auth.js             ← JWT protect + adminOnly
│   └── utils/
│       └── seed.js             ← Seeds 12 cars + admin user
│
└── frontend/                   ← React + Vite UI
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             ← Router + all routes
        ├── index.css           ← Design tokens
        ├── context/
        │   └── AuthContext.jsx ← Auth state (JWT)
        ├── hooks/
        │   └── index.js        ← useToast, useCars, useBookings...
        ├── services/
        │   └── api.js          ← Axios + mock data fallback
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── CarCard.jsx
        │   ├── AuthModal.jsx
        │   ├── BookingModal.jsx
        │   └── Toast.jsx
        └── pages/
            ├── Home.jsx        ← Landing page
            ├── Cars.jsx        ← Car listing + filters
            ├── CarDetail.jsx   ← Full car detail page
            ├── Checkout.jsx    ← 3-step booking checkout
            └── Dashboard.jsx   ← User dashboard
```

---

## 🚀 Setup & Run

### Step 1 — Backend

```bash
cd backend
npm install

# .env file setup
cp .env.example .env
# .env mein apna MongoDB URI daalo

# Database seed karo (12 cars + admin user)
node utils/seed.js

# Server start karo
npm run dev
# → http://localhost:5000
```

### Step 2 — Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> ✅ Frontend bina backend ke bhi kaam karta hai — mock data use karta hai!

---

## 🔗 API Endpoints

### Auth
| Method | Route                 | Description        | Auth |
|--------|-----------------------|--------------------|------|
| POST   | /api/auth/register    | Register new user  | ❌   |
| POST   | /api/auth/login       | Login → JWT token  | ❌   |
| GET    | /api/auth/me          | Get current user   | ✅   |

### Cars
| Method | Route          | Description              | Auth   |
|--------|----------------|--------------------------|--------|
| GET    | /api/cars      | List cars (with filters) | ❌     |
| GET    | /api/cars/:id  | Single car details       | ❌     |
| POST   | /api/cars      | Add new car              | Admin  |
| PUT    | /api/cars/:id  | Update car               | Admin  |
| DELETE | /api/cars/:id  | Delete car               | Admin  |

### Bookings
| Method | Route                       | Description         | Auth |
|--------|-----------------------------|---------------------|------|
| POST   | /api/bookings               | Create booking      | ✅   |
| GET    | /api/bookings/my            | My bookings         | ✅   |
| GET    | /api/bookings/:id           | Single booking      | ✅   |
| PUT    | /api/bookings/:id/cancel    | Cancel booking      | ✅   |

---

## 🔍 Car Filters (Query Params)

```
GET /api/cars?city=Delhi&type=suv&fuel=Diesel&minPrice=1000&maxPrice=3000&seats=5
```

---

## 🔑 Demo Credentials

| What          | Value                          |
|---------------|--------------------------------|
| Admin Email   | admin@driveindia.com           |
| Admin Password| Admin@123                      |
| Coupon Code   | DRIVEIN500 → ₹500 off          |
| Pickup OTP    | Generated randomly on booking  |

---

## 🎨 Design System

| Token             | Value          |
|-------------------|----------------|
| Primary Color     | #FF6B00        |
| Dark Background   | #0A0A0A        |
| Display Font      | Bebas Neue     |
| UI Font           | Syne           |
| Body Font         | DM Sans        |

---

## 🏗️ Production Build

```bash
# Frontend build
cd frontend
npm run build    # → /dist folder

# Deploy backend to Railway/Render
# Deploy frontend to Vercel
```

---

## 📦 Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 18 + Vite + React Router |
| Backend   | Node.js + Express 4            |
| Database  | MongoDB + Mongoose             |
| Auth      | JWT + bcryptjs                 |
| Payments  | Razorpay (Indian UPI/Card/EMI) |

---

Built with ❤️ for India 🇮🇳
