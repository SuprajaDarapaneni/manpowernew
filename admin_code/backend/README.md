# ManPowerLink — Centralized Node.js REST API Backend

High-performance, modular TypeScript / Express backend serving the entire ManPowerLink ecosystem (Customer Flutter App, Employee Flutter App, and Admin Web Console).

## Quick Commands to Run Backend

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Run development server (Port 4000)
npm run dev

# Backend will start cleanly at:
# http://localhost:4000
# Health check: http://localhost:4000/health
```

## Production Build & Start
```bash
npm run build
npm start
```

## API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status check |
| `POST` | `/api/auth/admin` | Admin dashboard authentication |
| `POST` | `/api/auth/customer` | Customer mobile OTP login |
| `POST` | `/api/auth/employee` | Worker mobile OTP login |
| `GET` | `/api/bookings` | List all orders & headcount |
| `POST` | `/api/bookings` | Post new shift (generates 6-digit Arrival OTP) |
| `POST` | `/api/bookings/:id/complete` | Complete shift & release escrow payment |
| `GET` | `/api/employee/available-shifts` | Worker 25km radius shift feed |
| `POST` | `/api/employee/shifts/:id/accept` | Worker reserves shift spot |
| `POST` | `/api/employee/shifts/:id/verify-arrival`| Verify worker arrival using customer OTP |
| `POST` | `/api/employee/shifts/:id/start` | Worker clocks in to start shift |
| `POST` | `/api/employee/shifts/:id/complete` | Worker clocks out |
| `GET` | `/api/admin/overview` | Platform metrics & GMV |
| `GET` | `/api/admin/workers` | Worker KYC audit queue |
| `POST` | `/api/admin/workers/:id/verify` | Approve/Reject worker KYC |
| `POST` | `/api/admin/commission` | Dynamic commission percentage/flat fee |
