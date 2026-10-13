# Admin Code — Frontend & Backend

This folder contains the complete Admin system separated cleanly into two independent, standalone modules:

```
admin_code/
├── frontend/    # Standalone Admin Operations Web Console (React + Vite + Tailwind)
└── backend/     # Standalone Centralized REST API Server (Node.js + Express + TypeScript)
```

---

## 1. How to Run Admin Backend API (Port 4000)

```bash
# 1. Navigate to backend directory
cd admin_code/backend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# The backend API runs cleanly on http://localhost:4000
# Health check: http://localhost:4000/health
```

---

## 2. How to Run Admin Frontend Dashboard (Port 3001)

```bash
# 1. Navigate to frontend directory
cd admin_code/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Open your browser at http://localhost:3001
```

---

## 3. Environment Variables (.env)

Both `frontend/` and `backend/` have their own `.env` and `.env.example` files:

* **Backend (`admin_code/backend/.env`)**:
  ```env
  PORT=4000
  NODE_ENV=development
  JWT_SECRET=super_secret_manpowerlink_key_2026
  CORS_ORIGIN=*
  ```

* **Frontend (`admin_code/frontend/.env`)**:
  ```env
  VITE_API_URL=http://localhost:4000/api
  VITE_PORT=3001
  ```

---

## 4. Test Admin Credentials
* **Super Admin**: `admin@gmail.com` | Password: `admin`
* **Platform Admin**: `admin@manpowerlink.com` | Password: `admin123`
