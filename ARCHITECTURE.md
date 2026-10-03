# ManPowerLink — Separated App Code & Architecture Guide

This repository contains the temporary manpower marketplace structured into **3 decoupled, independent applications** sharing a unified data and REST API contract layer.

---

## 1. Application Breakdown

| Application | Target Form Factor | Directory | Key Screens |
| :--- | :--- | :--- | :--- |
| **Admin Web Panel** | Desktop Web (1280px+) | `/src/components/admin/` & `/src/apps/admin/` | Dashboard, Service Categories, Orders & Bids (#1045), Commission Setup (10% vs ₹50), Worker Directory, Orders/Payments, Reports |
| **Customer / Employer App** | Mobile / Responsive Web | `/src/components/customer/` & `/src/apps/customer/` | Home (Categories & Nearby Workers), Post Job / Set Requirements, View Bids (Ramesh, Suresh, Manjunath), Order Confirmation (Confetti & OTP), My Orders |
| **Employee / Worker App** | Mobile / Responsive Web | `/src/components/employee/` & `/src/apps/employee/` | Dashboard (Hello Ramesh, ₹2,850 Balance, Online toggle), Job Details & Bidding, Available Jobs Feed, My Submitted Bids & OTP Verification |
| **Shared Core & Protocol** | Shared Library / Package | `/src/types.ts` & `/src/data/` | TypeScript Domain Models, Bid State Machine, Commission Calculators, Seed Data |

---

## 2. Running Standalone Modes

You can run each application in complete standalone isolation (without the preview hub or header switcher) in two ways:

1. **In the Web UI**: Click the **"Separate App Code"** button in the top navigation bar or the **"Launch Standalone"** button in the footer.
2. **Via URL Parameters**:
   - `?app=admin` — Boots 100% pure Admin Web Console
   - `?app=customer` — Boots 100% pure Customer/Employer Mobile App
   - `?app=employee` — Boots 100% pure Employee/Worker Mobile App
   - `?app=split` — Boots the Live Side-by-Side Ecosystem Simulator

---

## 3. How to Extract Each App into Its Own Standalone Repository

### App 1: Admin Web Panel
```bash
npx create-vite@latest manpower-admin --template react-ts
cd manpower-admin
npm install lucide-react @tailwindcss/vite
```
Copy:
- `/src/components/admin/` & `/src/apps/admin/AdminStandaloneApp.tsx`
- `/src/types.ts` and `/src/context/AppContext.tsx`

### App 2: Customer / Employer App
```bash
npx create-vite@latest manpower-customer --template react-ts
cd manpower-customer
npm install lucide-react canvas-confetti
```
Copy:
- `/src/components/customer/` & `/src/apps/customer/CustomerStandaloneApp.tsx`
- `/src/types.ts` and `/src/context/AppContext.tsx`

### App 3: Employee / Worker App
```bash
npx create-vite@latest manpower-employee --template react-ts
cd manpower-employee
npm install lucide-react
```
Copy:
- `/src/components/employee/` & `/src/apps/employee/EmployeeStandaloneApp.tsx`
- `/src/types.ts` and `/src/context/AppContext.tsx`

---

## 4. Completed Express Full-Stack REST Backend

The application includes a completed, production-ready Express.js backend (`/server.ts`) that serves both REST APIs and mounts Vite middlewares on port 3000.

### Server Runtime Architecture
- **Entry Point**: `/server.ts`
- **Port**: `3000` (Universal for Dev & Prod)
- **Middleware**: JSON body parser, CORS headers, Vite middleware mode in dev, static dist assets in production.
- **Client Service**: `/src/services/api.ts` with optimistic UI updates & live synchronization.

### Complete REST API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck, uptime, version, and entity counts |
| `GET` | `/api/stats` | Platform aggregates (revenue, orders, workers, bids) |
| `GET` | `/api/categories` | List all service categories |
| `POST` | `/api/categories` | Add a new service category |
| `PATCH` | `/api/categories/:id/toggle` | Toggle category active/inactive state |
| `GET` | `/api/workers` | List verified workers (filterable by category/availability) |
| `GET` | `/api/workers/:id` | Fetch individual worker profile |
| `PATCH` | `/api/workers/:id/availability` | Toggle worker online/offline availability |
| `GET` | `/api/jobs` | Retrieve all job orders (filterable by customer or status) |
| `POST` | `/api/jobs` | Post new job order (generates order #1046, notifies workers) |
| `GET` | `/api/jobs/:id` | Fetch specific job details |
| `GET` | `/api/bids` | Retrieve bids (filterable by jobId or workerId) |
| `POST` | `/api/bids` | Submit worker quotation/bid for an open job |
| `POST` | `/api/bids/:id/accept` | Accept bid: applies commission rule, assigns worker, credits wallet |
| `POST` | `/api/bids/:id/decline` | Decline a worker bid |
| `GET` | `/api/commission` | Get admin commission policy (percentage vs fixed) |
| `PUT` | `/api/commission` | Update commission rate and fixed fees |
| `GET` | `/api/notifications` | Real-time event notifications log |
| `DELETE` | `/api/notifications/:id` | Dismiss a notification |
| `POST` | `/api/simulate-bid` | Simulate incoming live worker bids |
| `POST` | `/api/reset` | Restore platform data to initial state |

