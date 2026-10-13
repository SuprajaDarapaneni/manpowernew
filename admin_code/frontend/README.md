# ManPowerLink — Admin Operations Web Console

Standalone React + Vite + Tailwind CSS administrator dashboard for platform operations, live dispatch monitoring, worker KYC verification, and commission control.

## Quick Commands to Run Admin Console

```bash
# 1. Navigate to admin_dashboard directory
cd admin_dashboard

# 2. Install dependencies
npm install

# 3. Run development server (Port 3001)
npm run dev

# Open in browser:
# http://localhost:3001
```

## Production Build & Preview
```bash
npm run build
npm run preview
```

## Features
- **Operations Cockpit**: Real-time Gross Merchandise Value (GMV), active bookings, and verified workforce counters.
- **Worker Verification Queue**: Review Aadhaar, trade background, and approve/reject worker accounts.
- **Dynamic Commission Engine**: Switch between percentage retention (e.g. 10%) and flat fee per shift (₹150/worker).
- **Live Dispatches & Arrival OTP Status**: Audit active shift progression and completion statuses.
- **Admin Test Credentials**:
  - Super Admin: `admin@gmail.com` (password: `admin`)
  - Platform Admin: `admin@manpowerlink.com` (password: `admin123`)
