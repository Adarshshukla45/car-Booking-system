# 🚗 DriveIndia — React + Vite Frontend

India's #1 Self-Drive Car Rental — Premium UI built with React 18, Vite, React Router v6.

---

## 📁 Project Structure

```
frontend/
├── index.html                 ← Vite HTML entry
├── package.json
├── vite.config.js             ← Vite + API proxy config
├── .env.example               ← Copy to .env
│
└── src/
    ├── main.jsx               ← React DOM root
    ├── App.jsx                ← Router + all routes + Layout
    ├── index.css              ← CSS variables + global styles
    │
    ├── context/
    │   └── AuthContext.jsx    ← JWT login/logout state
    │
    ├── hooks/
    │   └── index.js           ← useToast, useCars, useBookings,
    │                            useLocalStorage, useDebounce
    │
    ├── services/
    │   └── api.js             ← Axios instance + mock data fallback
    │
    ├── components/
    │   ├── Navbar.jsx         ← Fixed top nav
    │   ├── Footer.jsx         ← Site footer
    │   ├── CarCard.jsx        ← Reusable car card with SVG
    │   ├── AuthModal.jsx      ← Login / Register modal
    │   ├── BookingModal.jsx   ← 2-step booking flow
    │   └── Toast.jsx          ← Notification toasts
    │
    └── pages/
        ├── Home.jsx           ← Landing page
        ├── Cars.jsx           ← Car listing + sidebar filters
        ├── CarDetail.jsx      ← Full car detail page
        ├── Checkout.jsx       ← 3-step checkout
        └── Dashboard.jsx      ← User dashboard
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

> ✅ Works fully with mock data — no backend needed!

---

## 📄 Pages & Routes

| Route           | Page       | Description                        |
|-----------------|------------|------------------------------------|
| `/`             | Home       | Hero, search, features, cities, CTA|
| `/cars`         | Cars       | Listing with filters + sort        |
| `/cars/:id`     | CarDetail  | Full detail, reviews, FAQs         |
| `/checkout/:id` | Checkout   | 3-step booking + payment           |
| `/dashboard`    | Dashboard  | Bookings, stats, profile           |

---

## 🎨 Design System

| Token             | Value                    |
|-------------------|--------------------------|
| `--saffron`       | `#FF6B00`                |
| `--dark`          | `#0A0A0A`                |
| `--card`          | `#141414`                |
| `--border-accent` | `rgba(255,107,0,0.28)`   |
| Display font      | **Bebas Neue**           |
| UI font           | **Syne**                 |
| Body font         | **DM Sans**              |

---

## 🔑 Demo Credentials

| Feature       | Value                   |
|---------------|-------------------------|
| Coupon code   | `DRIVEIN500` → ₹500 off |
| Demo login    | Any email + password    |
| Pickup OTP    | `7384`                  |

---

## 🏗️ Build for Production

```bash
npm run build      # → /dist folder
npm run preview    # preview build locally
```

Deploy to **Vercel** in one command:
```bash
npx vercel --prod
```

---

## 🔗 Backend Connection

Backend runs on `http://localhost:5000`.  
Vite proxy in `vite.config.js` forwards `/api/*` → backend automatically.

When backend is **offline**, all API calls fall back to `MOCK_CARS` and `MOCK_BOOKINGS` in `src/services/api.js` — so the UI works 100% without it.

---

Built with ❤️ for India 🇮🇳
