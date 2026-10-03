import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  FolderTree,
  Terminal,
  ExternalLink,
  Layers,
  Smartphone,
  HardHat,
  Database,
  ArrowRight,
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
  const [selectedApp, setSelectedApp] = useState<'admin' | 'customer' | 'employee' | 'shared'>('admin');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const appData = {
    admin: {
      title: 'Admin Web Panel Codebase',
      badge: 'Standalone Desktop Web App',
      icon: Layers,
      color: 'text-emerald-500',
      description:
        'Independent web management portal for platform administrators to control categories, view real-time orders, manage worker verification, and configure commission rules.',
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      fileTree: `
admin-portal/
├── index.html
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Standalone Admin Portal Root
│   ├── components/
│   │   ├── AdminLayout.tsx         # Sidebar & Sub-routing
│   │   ├── AdminDashboard.tsx      # Overview metrics & order curves
│   │   ├── ServiceCategoriesView.tsx # Add/toggle service categories
│   │   ├── OrdersBidsView.tsx      # Order #1045 quotes & assignments
│   │   ├── CommissionSetupView.tsx # Percentage/Fixed fee calculator
│   │   ├── WorkersManagementView.tsx # Worker directory & verifications
│   │   ├── OrdersPaymentsView.tsx  # Financial ledger & settlements
│   │   └── ReportsView.tsx         # Volume & analytics reports
│   └── types.ts                    # Shared entity definitions
`.trim(),
      command: 'npm create vite@latest manpower-admin -- --template react-ts\ncd manpower-admin && npm i lucide-react @tailwindcss/vite',
      standaloneCode: `
// src/App.tsx - Standalone Admin Web Panel Entry
import React from 'react';
import { AdminLayout } from './components/AdminLayout';
import { AppProvider } from './context/AppContext';

export default function AdminApp() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">MP</div>
            <span className="font-bold text-base">ManPowerLink &bull; Admin Web Panel</span>
          </div>
          <span className="text-xs text-slate-400">Production Console v2.4</span>
        </header>
        <AdminLayout />
      </div>
    </AppProvider>
  );
}
`.trim(),
    },
    customer: {
      title: 'Customer / Employer App Codebase',
      badge: 'Standalone Mobile Client App',
      icon: Smartphone,
      color: 'text-teal-500',
      description:
        'Client-side responsive application for employers and customers to search nearby workers, post temporary job requirements, review quotes, and confirm hired crew.',
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'canvas-confetti'],
      fileTree: `
customer-app/
├── index.html
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Customer App Shell & Bottom Nav
│   ├── components/
│   │   ├── CustomerHome.tsx        # Search & Nearby available workers
│   │   ├── PostJobView.tsx         # Job posting & employee counter
│   │   ├── ViewBidsView.tsx        # Real-time worker bid quotes list
│   │   ├── OrderConfirmationView.tsx # Confetti, OTP & crew contacts
│   │   └── MyOrdersView.tsx        # Active, completed, cancelled orders
│   └── types.ts                    # Shared entity definitions
`.trim(),
      command: 'npm create vite@latest manpower-customer -- --template react-ts\ncd manpower-customer && npm i lucide-react canvas-confetti',
      standaloneCode: `
// src/App.tsx - Standalone Customer App Entry
import React, { useState } from 'react';
import { CustomerHome } from './components/CustomerHome';
import { PostJobView } from './components/PostJobView';
import { ViewBidsView } from './components/ViewBidsView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { MyOrdersView } from './components/MyOrdersView';

export default function CustomerApp() {
  const [screen, setScreen] = useState('home');

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[750px] flex flex-col">
        {screen === 'home' && <CustomerHome onPostJob={() => setScreen('post')} />}
        {screen === 'post' && <PostJobView onDone={() => setScreen('bids')} />}
        {screen === 'bids' && <ViewBidsView onAccept={() => setScreen('confirm')} />}
        {screen === 'confirm' && <OrderConfirmationView onOrders={() => setScreen('orders')} />}
        {screen === 'orders' && <MyOrdersView />}
      </div>
    </div>
  );
}
`.trim(),
    },
    employee: {
      title: 'Employee / Worker App Codebase',
      badge: 'Standalone Mobile Worker App',
      icon: HardHat,
      color: 'text-amber-500',
      description:
        'Dedicated worker mobile portal for temporary laborers to toggle availability, receive job opportunities, submit custom bidding quotes, and verify employer OTPs for instant payouts.',
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      fileTree: `
employee-app/
├── index.html
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Employee App Shell & Bottom Nav
│   ├── components/
│   │   ├── EmployeeDashboard.tsx   # Balance (₹2,850), status toggle
│   │   ├── JobDetailsBidding.tsx   # Order #1045 custom quote submission
│   │   ├── AvailableJobsView.tsx   # Feed of open manpower demands
│   │   └── EmployeeBidsView.tsx    # Submitted quotes & OTP verification
│   └── types.ts                    # Shared entity definitions
`.trim(),
      command: 'npm create vite@latest manpower-worker -- --template react-ts\ncd manpower-worker && npm i lucide-react',
      standaloneCode: `
// src/App.tsx - Standalone Employee / Worker App Entry
import React, { useState } from 'react';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { JobDetailsBidding } from './components/JobDetailsBidding';
import { AvailableJobsView } from './components/AvailableJobsView';
import { EmployeeBidsView } from './components/EmployeeBidsView';

export default function EmployeeApp() {
  const [screen, setScreen] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[750px] flex flex-col">
        {screen === 'dashboard' && <EmployeeDashboard onSelectJob={() => setScreen('details')} />}
        {screen === 'details' && <JobDetailsBidding onSubmitted={() => setScreen('bids')} />}
        {screen === 'jobs' && <AvailableJobsView onSelectJob={() => setScreen('details')} />}
        {screen === 'bids' && <EmployeeBidsView />}
      </div>
    </div>
  );
}
`.trim(),
    },
    shared: {
      title: 'Shared Data Contracts & REST API Schema',
      badge: 'Backend & Data Protocol',
      icon: Database,
      color: 'text-blue-500',
      description:
        'The common TypeScript interfaces, order status state machine, commission fee calculation algorithms, and mock seed data connecting all three standalone applications.',
      techStack: ['TypeScript', 'REST API Contracts', 'JSON Schema'],
      fileTree: `
shared/
├── types.ts                        # JobOrder, Bid, Worker, CommissionSettings
├── initialData.ts                  # Seed records matching UI mockup
└── commissionUtils.ts              # Fee calculation (Percentage vs Fixed)
`.trim(),
      command: '// Import types.ts into any microservice or frontend app:\nimport { JobOrder, Bid, Worker } from "./types";',
      standaloneCode: `
// src/types.ts - Core Data Contracts
export interface JobOrder {
  id: string;
  orderNumber: string;         // e.g. "#1045"
  customerId: string;
  category: string;            // e.g. "Loading & Unloading"
  location: string;            // e.g. "Mangalore, Karnataka"
  scheduledDate: string;
  scheduledTime: string;
  workingHours: number;
  requiredWorkers: number;     // e.g. 4
  minBudget: number;
  maxBudget: number;
  status: 'open' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedWorkerIds: string[];
  totalAgreedAmount: number;
  commissionDeducted: number;
}

export interface Bid {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
}
`.trim(),
    },
  };

  const current = appData[selectedApp];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Separated App Code & Architecture</h2>
              <p className="text-xs text-slate-400">
                Independent repositories and standalone components for all 3 platform applications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Selector Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap gap-2">
          {[
            { id: 'admin', label: '1. Admin Web Panel', icon: Layers },
            { id: 'customer', label: '2. Customer App', icon: Smartphone },
            { id: 'employee', label: '3. Employee App', icon: HardHat },
            { id: 'shared', label: '4. Shared Core & Types', icon: Database },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = selectedApp === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedApp(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/70'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview Card */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Icon className={`w-5 h-5 ${current.color}`} />
                <h3 className="font-bold text-base text-white">{current.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                  {current.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {current.description}
              </p>
            </div>

            {selectedApp !== 'shared' && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchStandalone(selectedApp as any);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 shrink-0"
              >
                <span>Launch Standalone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Setup CLI */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Terminal Setup Command
            </span>
            <div className="relative group">
              <pre className="bg-slate-950 p-3 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
                {current.command}
              </pre>
              <button
                onClick={() => handleCopy(current.command, 'cli')}
                className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-300 flex items-center gap-1"
              >
                {copiedFile === 'cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'cli' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* File Structure */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
              Standalone Project Structure
            </span>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
              {current.fileTree}
            </pre>
          </div>

          {/* Code Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                Standalone Code Preview
              </span>
              <button
                onClick={() => handleCopy(current.standaloneCode, 'code')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1"
              >
                {copiedFile === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'code' ? 'Copied to Clipboard' : 'Copy Full Code'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-300/90 border border-slate-800 overflow-x-auto max-h-60 leading-relaxed">
              {current.standaloneCode}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>All 3 codebases are completely modular and decoupled in <code>/src/apps/</code> and <code>/src/components/</code>.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
