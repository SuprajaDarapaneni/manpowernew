# ManPowerLink — Multi-Application Architecture

> Clean, Zero-Confusion Code Structure:
> 1. `customer_app/` — Dedicated Flutter Mobile App for Customers & Employers (Android APK Ready)
> 2. `employee_app/` — Dedicated Flutter Mobile App for Workers & Employees (Android APK Ready)
> 3. `admin_code/` — Separated Admin Code with Dedicated `frontend/` and `backend/` Folders

---

## 1. Quick Terminal Commands Cheat-Sheet

### A. Run Admin Backend Server (Port 4000)
```bash
cd admin_code/backend
npm install
npm run dev
# Running on http://localhost:4000 (Health check: http://localhost:4000/health)
```

### B. Run Admin Frontend Web Dashboard (Port 3001)
```bash
cd admin_code/frontend
npm install
npm run dev
# Open in browser: http://localhost:3001
```

### C. Run & Build APK for Customer Flutter App
```bash
cd customer_app
flutter pub get
flutter run
# Build production Android APK:
flutter build apk --release
# Built APK output: customer_app/build/app/outputs/flutter-apk/app-release.apk
```

### D. Run & Build APK for Employee / Worker Flutter App
```bash
cd employee_app
flutter pub get
flutter run
# Build production Android APK:
flutter build apk --release
# Built APK output: employee_app/build/app/outputs/flutter-apk/app-release.apk
```

---

## 2. Directory Layout

```
├── customer_app/                # 1. Complete Customer / Employer Mobile App
│   ├── android/                 # Android Gradle & Manifest configuration for APK
│   │   ├── app/src/main/AndroidManifest.xml
│   │   ├── app/build.gradle     # applicationId: com.manpowerlink.customer
│   │   ├── build.gradle
│   │   └── settings.gradle
│   ├── lib/                     # Complete Flutter codebase
│   │   ├── main.dart            # Navigation bar & entry point
│   │   ├── core/constants.dart  # API URLs, trade categories & base rates
│   │   └── features/
│   │       ├── auth/screens/    # Customer phone OTP login screen
│   │       ├── bookings/        # Shift booking, 6-digit Arrival OTP, active tracking
│   │       └── profile/screens/ # Company profile, GSTIN & escrow balance
│   ├── pubspec.yaml             # Standalone Flutter dependencies
│   ├── .env.example & .env      # API_BASE_URL
│   └── README.md                # Dedicated run & APK build guide
│
├── employee_app/                # 2. Complete Worker / Employee Mobile App
│   ├── android/                 # Android Gradle & Manifest configuration for APK
│   │   ├── app/src/main/AndroidManifest.xml
│   │   ├── app/build.gradle     # applicationId: com.manpowerlink.employee
│   │   ├── build.gradle
│   │   └── settings.gradle
│   ├── lib/                     # Complete Flutter codebase
│   │   ├── main.dart            # Worker navigation & entry point
│   │   ├── core/constants.dart  # API URLs & trade categories
│   │   └── features/
│   │       ├── auth/screens/    # Worker mobile login screen
│   │       ├── job_requests/    # 25km radius shift radar feed & spot acceptance
│   │       ├── active_job/      # Site Arrival OTP verification & Clock-In/Out
│   │       ├── earnings/        # Daily payouts, wallet balance, bank transfer
│   │       └── profile/         # KYC verification badge (Aadhaar & Police clearance)
│   ├── pubspec.yaml             # Standalone Flutter dependencies
│   ├── .env.example & .env      # API_BASE_URL
│   └── README.md                # Dedicated run & APK build guide
│
├── admin_code/                  # 3. Dedicated Admin System (Frontend + Backend)
│   ├── frontend/                # Standalone Admin Operations Dashboard (React 19 + Vite)
│   │   ├── src/App.tsx          # Real-time GMV, worker KYC queue, commission slider
│   │   ├── src/main.tsx
│   │   ├── package.json
│   │   ├── vite.config.ts       # Runs on Port 3001
│   │   ├── .env.example & .env  # VITE_API_URL=http://localhost:4000/api
│   │   └── README.md
│   │
│   ├── backend/                 # Standalone Central REST API Server (Node.js + Express)
│   │   ├── src/index.ts         # Server entry point (Runs on Port 4000)
│   │   ├── src/data/db.ts       # Clean in-memory data store with pre-seeded test data
│   │   ├── src/routes/          # Auth, Bookings (6-digit OTP), Employee radar, Admin KYC
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example & .env  # PORT=4000, JWT_SECRET
│   │   └── README.md
│   │
│   └── README.md                # Quick guide to run frontend and backend
│
└── src/                         # AI Studio Interactive Web Simulator (Port 3000)
```

---

## 3. Test Credentials Across All Applications

### Admin Management Console
- **Super Admin**: `admin@gmail.com` | Password: `admin`
- **Platform Admin**: `admin@manpowerlink.com` | Password: `admin123`

### Customer / Employer App
- **Kiran Transport & Co**: `+91 98450 11223` | OTP: `1234`
- **Apex Warehousing Ltd**: `+91 98450 44556` | OTP: `1234`

### Worker / Employee App
- **Ramesh Gowda**: `+91 98765 43210` | OTP: `1234` (Warehouse Helper, 4.9 ★)
- **Suresh Patil**: `+91 98765 11223` | OTP: `1234` (Construction Support, 4.8 ★)
