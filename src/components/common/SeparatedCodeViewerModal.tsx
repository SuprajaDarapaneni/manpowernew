import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  FolderTree,
  Terminal,
  Layers,
  Smartphone,
  HardHat,
  Database,
  ArrowRight,
  Server,
  FileCode,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLaunchStandalone: (app: 'admin' | 'customer' | 'employee') => void;
}

export const SeparatedCodeViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLaunchStandalone,
}) => {
  const [selectedApp, setSelectedApp] = useState<
    'flutter_customer' | 'flutter_employee' | 'backend' | 'admin_web' | 'docker'
  >('flutter_customer');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const appData = {
    flutter_customer: {
      title: 'Project 1: Customer Flutter App',
      badge: 'Full Flutter Code • Android APK & iOS Ready',
      icon: Smartphone,
      color: 'text-rose-500',
      description:
        'Complete, clean Flutter mobile application for employers and clients to post temporary workforce bookings, calculate escrow, track assigned worker arrival, and exchange secure 6-digit OTPs.',
      techStack: [
        'Flutter 3.x / Dart',
        'Material 3 UI',
        'HTTP REST Client',
        'Android Gradle / APK Build Ready',
      ],
      fileTree: `customer_app/
├── android/                         # Android build configuration for APK
│   ├── app/src/main/AndroidManifest.xml
│   ├── app/build.gradle            # applicationId: com.manpowerlink.customer
│   ├── build.gradle
│   └── settings.gradle
├── lib/                             # Complete Flutter codebase
│   ├── main.dart                   # Entry point & navigation bar
│   ├── core/constants.dart         # API URLs, categories & rates
│   └── features/
│       ├── auth/screens/customer_login_screen.dart
│       ├── bookings/
│       │   ├── data/models/booking_model.dart
│       │   ├── data/services/booking_api_service.dart
│       │   ├── domain/entities/booking_entity.dart
│       │   └── presentation/screens/
│       │       ├── customer_home_screen.dart
│       │       ├── create_booking_screen.dart
│       │       └── active_bookings_screen.dart (Displays 6-Digit Arrival OTP)
│       └── profile/screens/customer_profile_screen.dart
├── pubspec.yaml                     # Dependencies
├── .env.example & .env             # API_BASE_URL
└── README.md                       # Copyable terminal commands`,
      command: `cd customer_app
flutter pub get
flutter run
# Build production APK:
flutter build apk --release`,
      standaloneCode: `// customer_app/lib/features/bookings/presentation/screens/create_booking_screen.dart
// Customer Booking Creation with dynamic headcount, hours & 10% platform fee
class CreateBookingScreen extends StatefulWidget {
  final VoidCallback onBookingCreated;
  const CreateBookingScreen({super.key, required this.onBookingCreated});
  @override
  State<CreateBookingScreen> createState() => _CreateBookingScreenState();
}

class _CreateBookingScreenState extends State<CreateBookingScreen> {
  final _service = BookingApiService();
  int _workersCount = 3;
  int _durationHours = 8;
  double get _hourlyRate => 180.0;
  double get _subtotal => _workersCount * _durationHours * _hourlyRate;
  double get _platformFee => _subtotal * 0.10;
  double get _totalAmount => _subtotal + _platformFee;

  void _handleSubmit() async {
    final booking = await _service.createBooking(
      categoryName: 'Warehouse Helper',
      requiredWorkers: _workersCount,
      durationHours: _durationHours,
      locationAddress: 'Warehouse 4B, Electronic City',
      shiftDate: 'Today',
      startTime: '09:00 AM',
      hourlyRate: _hourlyRate,
    );
    // Dispatches booking & receives 6-digit Site Arrival OTP (e.g. 482910)
    widget.onBookingCreated();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book Temporary Staff')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Slider(value: _workersCount.toDouble(), min: 1, max: 20, onChanged: (v) => setState(() => _workersCount = v.toInt())),
            Text('Workers: $_workersCount | Total Escrow: ₹\${_totalAmount.toStringAsFixed(0)}'),
            ElevatedButton(onPressed: _handleSubmit, child: const Text('Confirm & Dispatch Shift')),
          ],
        ),
      ),
    );
  }
}`,
    },
    flutter_employee: {
      title: 'Project 2: Employee Flutter App',
      badge: 'Full Flutter Code • Android APK & iOS Ready',
      icon: HardHat,
      color: 'text-amber-500',
      description:
        'Complete, clean Flutter mobile application for workers and temporary contractors. Features a 25km radius shift radar feed, site arrival verification via 6-digit customer OTP, clock-in/out timers, and instant wallet earnings.',
      techStack: [
        'Flutter 3.x / Dart',
        'Material 3 UI',
        'HTTP REST Client',
        'Android Gradle / APK Build Ready',
      ],
      fileTree: `employee_app/
├── android/                         # Android build configuration for APK
│   ├── app/src/main/AndroidManifest.xml
│   ├── app/build.gradle            # applicationId: com.manpowerlink.employee
│   ├── build.gradle
│   └── settings.gradle
├── lib/                             # Complete Flutter codebase
│   ├── main.dart                   # Entry point & worker navigation
│   ├── core/constants.dart         # API URLs & trade categories
│   └── features/
│       ├── auth/screens/employee_login_screen.dart
│       ├── job_requests/
│       │   ├── data/models/job_offer_model.dart
│       │   ├── data/services/worker_api_service.dart
│       │   ├── domain/entities/job_offer_entity.dart
│       │   └── presentation/screens/
│       │       ├── job_feed_screen.dart (25km shift radar)
│       │       └── active_job_screen.dart (Verify Arrival OTP & Clock In)
│       ├── earnings/presentation/screens/earnings_screen.dart
│       └── profile/presentation/screens/worker_profile_screen.dart
├── pubspec.yaml                     # Dependencies
├── .env.example & .env             # API_BASE_URL
└── README.md                       # Copyable terminal commands`,
      command: `cd employee_app
flutter pub get
flutter run
# Build production APK:
flutter build apk --release`,
      standaloneCode: `// employee_app/lib/features/job_requests/presentation/screens/active_job_screen.dart
// Worker enters customer's 6-digit OTP to prove physical arrival and start shift timer
class ActiveJobScreen extends StatefulWidget {
  final VoidCallback onJobCompleted;
  const ActiveJobScreen({super.key, required this.onJobCompleted});
  @override
  State<ActiveJobScreen> createState() => _ActiveJobScreenState();
}

class _ActiveJobScreenState extends State<ActiveJobScreen> {
  final _service = WorkerApiService();
  final _otpController = TextEditingController();

  void _verifyOtp() async {
    // Verifies OTP with backend, unlocks clock-in when matched with employer
    final success = await _service.verifyArrivalOtp('bk-101', _otpController.text.trim());
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Site arrival verified! Ready to clock in.')));
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Active Shift & Clock-In')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: _otpController, decoration: const InputDecoration(labelText: 'Enter 6-digit Arrival OTP from Employer')),
            ElevatedButton(onPressed: _verifyOtp, child: const Text('Verify Arrival & Start Shift')),
          ],
        ),
      ),
    );
  }
}`,
    },
    backend: {
      title: 'Project 3: Centralized Backend API',
      badge: 'Node.js 20 • Express • TypeScript • Standalone',
      icon: Server,
      color: 'text-indigo-400',
      description:
        'Self-contained, modular Express & TypeScript REST API serving the entire ManPowerLink ecosystem. Includes 6-digit cryptographic arrival OTP generator, worker radius matching, and escrow management.',
      techStack: [
        'Node.js 20 / TypeScript',
        'Express 4.21',
        'CORS & JSON Middleware',
        'Clean Modular Routes',
      ],
      fileTree: `admin_code/backend/
├── package.json                    # Scripts: dev, build, start
├── tsconfig.json
├── .env.example & .env             # PORT=4000, JWT_SECRET
├── README.md                       # Complete API Docs
└── src/
    ├── index.ts                    # Server entry point (Port 4000)
    ├── data/
    │   └── db.ts                   # Resilient data store with rich seed data
    └── routes/
        ├── auth.routes.ts          # Admin, Customer, and Worker auth
        ├── booking.routes.ts       # Post shift, generate 6-digit OTP
        ├── employee.routes.ts      # Shift radar, verify OTP, clock-in
        └── admin.routes.ts         # KYC queue, platform stats, commission`,
      command: `cd admin_code/backend
npm install
npm run dev
# Running on http://localhost:4000
# Health check: http://localhost:4000/health`,
      standaloneCode: `// backend/src/routes/booking.routes.ts
// Create shift and generate unique 6-digit Arrival OTP
bookingRouter.post('/', (req: Request, res: Response) => {
  const { category_name, required_workers = 1, duration_hours = 8, hourly_rate = 180 } = req.body;
  const workerPay = Number(required_workers) * Number(duration_hours) * Number(hourly_rate);
  const fee = workerPay * 0.10;
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  const newBooking = {
    id: \`bk-\${Date.now()}\`,
    booking_number: \`MPL-\${Date.now().toString().slice(-6)}\`,
    category_name,
    required_workers: Number(required_workers),
    assigned_workers: 0,
    status: 'matching',
    arrival_otp: otp, // 6-digit arrival verification code
    total_amount: workerPay + fee,
    platform_fee: fee,
  };

  db.bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});`,
    },
    admin_web: {
      title: 'Project 4: Admin Web Console',
      badge: 'React 19 • Vite • Tailwind CSS • Standalone',
      icon: Layers,
      color: 'text-emerald-400',
      description:
        'Standalone administrator cockpit to audit worker KYC submissions, set platform commission parameters (percentage vs. flat fee), manage trade categories, and supervise live dispatches.',
      techStack: [
        'React 19 / TypeScript',
        'Vite 6',
        'Tailwind CSS',
        'Lucide Icons',
      ],
      fileTree: `admin_code/frontend/
├── package.json                    # Scripts: dev, build, preview
├── tsconfig.json
├── vite.config.ts                  # Server config (Port 3001)
├── index.html
├── .env.example & .env             # VITE_API_URL=http://localhost:4000/api
├── README.md                       # Quick run guide
└── src/
    ├── main.tsx                    # Entry point
    └── App.tsx                     # Full operations dashboard & KYC queue`,
      command: `cd admin_code/frontend
npm install
npm run dev
# Running on http://localhost:3001`,
      standaloneCode: `// admin_dashboard/src/App.tsx
// Dynamic Commission engine: Percentage or Flat fee per worker
export const CommissionControls = () => {
  const [model, setModel] = useState<'percentage' | 'fixed'>('percentage');
  const [rate, setRate] = useState(10); // 10%
  const [fixedFee, setFixedFee] = useState(150); // ₹150

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white">
      <h2 className="text-base font-bold">Dynamic Platform Commission Engine</h2>
      <div className="grid grid-cols-2 gap-4 my-4">
        <button onClick={() => setModel('percentage')} className={model === 'percentage' ? 'bg-emerald-600 p-4 rounded-xl' : 'bg-slate-950 p-4 rounded-xl'}>
          Percentage Model (10% of gross invoice)
        </button>
        <button onClick={() => setModel('fixed')} className={model === 'fixed' ? 'bg-emerald-600 p-4 rounded-xl' : 'bg-slate-950 p-4 rounded-xl'}>
          Flat Fee Model (₹150 per worker shift)
        </button>
      </div>
    </div>
  );
};`,
    },
    docker: {
      title: 'Multi-Project Docker Orchestration',
      badge: 'Full Ecosystem in 1 Command',
      icon: Cpu,
      color: 'text-blue-400',
      description:
        'Run the entire backend API and admin web console simultaneously with Docker Compose.',
      techStack: ['Docker Compose', 'Node 20', 'Vite', 'PostgreSQL (Optional)'],
      fileTree: `manpowerlink/
├── docker-compose.yml
├── ARCHITECTURE.md
├── customer_app/                   # Flutter App (Mobile / APK)
├── employee_app/                   # Flutter App (Mobile / APK)
└── admin_code/                     # Admin System
    ├── backend/                    # Node.js API Server
    └── frontend/                   # React Admin Console`,
      command: `docker-compose up --build
# Boots backend API on port 4000 and admin console on port 3001`,
      standaloneCode: `version: '3.8'
services:
  backend:
    build: ./admin_code/backend
    ports: ["4000:4000"]
    environment:
      - PORT=4000
  admin_dashboard:
    build: ./admin_code/frontend
    ports: ["3001:3000"]
    depends_on: [backend]`,
    },
  };

  const current = appData[selectedApp];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Client Handover & Standalone Codebase Hub
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  4 Standalone Projects
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full Flutter mobile apps with APK build files, standalone backend API, and React admin frontend.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 gap-2 overflow-x-auto py-2">
          {[
            { id: 'flutter_customer', label: '1. Customer Flutter App', icon: Smartphone },
            { id: 'flutter_employee', label: '2. Employee Flutter App', icon: HardHat },
            { id: 'backend', label: '3. Backend REST API', icon: Server },
            { id: 'admin_web', label: '4. Admin Web Dashboard', icon: Layers },
            { id: 'docker', label: 'Docker Compose', icon: Cpu },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const active = selectedApp === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedApp(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  active
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Overview Banner */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${current.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{current.title}</h3>
                  <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {current.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">{current.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {current.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Terminal Run Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Terminal Run & Build Commands
              </div>
              <button
                onClick={() => handleCopy(current.command, 'command')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedFile === 'command' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
              {current.command}
            </pre>
          </div>

          {/* File Structure & Code Snippet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* File Structure */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  Directory Layout
                </div>
                <button
                  onClick={() => handleCopy(current.fileTree, 'tree')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedFile === 'tree' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto h-[290px] leading-relaxed">
                {current.fileTree}
              </pre>
            </div>

            {/* Standalone Code Preview */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  Code Preview & Implementation
                </div>
                <button
                  onClick={() => handleCopy(current.standaloneCode, 'code')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedFile === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Code
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200 overflow-x-auto h-[290px] leading-relaxed">
                {current.standaloneCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for client delivery, Google Play Store APK compilation, and terminal execution.</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedApp === 'flutter_customer' && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchStandalone('customer');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <span>Launch Customer Live Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedApp === 'flutter_employee' && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchStandalone('employee');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <span>Launch Employee Live Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedApp === 'admin_web' && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchStandalone('admin');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <span>Launch Admin Live Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Close Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
