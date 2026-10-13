import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  Percent,
  TrendingUp,
  Shield,
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
} from 'lucide-react';

export default function AdminApp() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'workers' | 'orders' | 'commission' | 'reports'>('overview');
  const [commissionModel, setCommissionModel] = useState<'percentage' | 'fixed'>('percentage');
  const [commissionRate, setCommissionRate] = useState(10);
  const [fixedFeeAmount, setFixedFeeAmount] = useState(50);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-900/30">
            MP
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">
              ManPowerLink &bull; Operations Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              SaaS Control Panel &bull; Role-Based Access Control (RBAC: SuperAdmin)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Backend API Connected (Port 4000)
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-4 space-y-1 shrink-0">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
            { id: 'workers', label: 'Worker KYC & Roster', icon: Users },
            { id: 'orders', label: 'Bookings & Matching', icon: Briefcase },
            { id: 'commission', label: 'Commission Engine', icon: Percent },
            { id: 'reports', label: 'Revenue & Audit Logs', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Active Bookings</span>
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">128</div>
                  <div className="text-xs text-emerald-400 mt-1">&uarr; 14% this week</div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Active Workers</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">482</div>
                  <div className="text-xs text-slate-400 mt-1">391 currently online</div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Gross Escrow GMV</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">₹4,82,900</div>
                  <div className="text-xs text-emerald-400 mt-1">&uarr; ₹52,000 today</div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Platform Commission</span>
                    <Percent className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">₹48,290</div>
                  <div className="text-xs text-slate-400 mt-1">10% retained</div>
                </div>
              </div>

              {/* Live Dispatch Monitor */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Live Booking Radar & State Machine Pipeline
                  </h2>
                  <span className="text-xs text-slate-400">14-Step Workflow Monitor</span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'MPL-882104',
                      category: 'Warehouse Logistics Helpers',
                      customer: 'Acme Cargo Ltd',
                      workers: '3/3 Assigned',
                      step: 'Step 7: Arrival Verified via OTP (482910)',
                      status: 'Verified',
                      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                    },
                    {
                      id: 'MPL-882105',
                      category: 'Construction Helpers',
                      customer: 'Apex Infra Projects',
                      workers: '4/4 Assigned',
                      step: 'Step 8: Shift in Progress (02h 15m elapsed)',
                      status: 'Working',
                      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
                    },
                    {
                      id: 'MPL-882106',
                      category: 'Event Stewards',
                      customer: 'Grand Palace Banquets',
                      workers: '1/2 Matched',
                      step: 'Step 3: Dispatching to nearby verified radius (25km)',
                      status: 'Matching',
                      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                    },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{order.id}</span>
                          <span className="text-xs text-slate-400">&bull; {order.category}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Employer: <strong className="text-slate-200">{order.customer}</strong> &bull; Staffing: {order.workers}
                        </div>
                        <div className="text-xs text-emerald-400 mt-1 font-mono">{order.step}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'commission' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-white">Dynamic Platform Commission Engine</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure real-time commission retention for the 14-step booking settlement engine.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setCommissionModel('percentage')}
                  className={`p-4 rounded-xl border text-left transition ${
                    commissionModel === 'percentage'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm">Percentage-Based Commission</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Deduct {commissionRate}% platform fee from the gross employer invoice total.
                  </div>
                </button>

                <button
                  onClick={() => setCommissionModel('fixed')}
                  className={`p-4 rounded-xl border text-left transition ${
                    commissionModel === 'fixed'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm">Flat Fee Per Worker Shift</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Retain fixed ₹{fixedFeeAmount} platform guarantee fee per worker per shift.
                  </div>
                </button>
              </div>

              {commissionModel === 'percentage' ? (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Commission Percentage: {commissionRate}%</label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Fixed Amount (₹): {fixedFeeAmount}</label>
                  <input
                    type="number"
                    value={fixedFeeAmount}
                    onChange={(e) => setFixedFeeAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              )}

              <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold">
                Apply Commission Rule to Live Backend
              </button>
            </div>
          )}

          {currentTab === 'workers' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Worker Verification & KYC Queue</h2>
                  <p className="text-xs text-slate-400">Audit government IDs, police clearances, and trade skills.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Ramesh Kumar', category: 'Warehouse Helper', kyc: 'Verified', jobs: 142, rating: 4.9 },
                  { name: 'Suresh Patil', category: 'Construction Helper', kyc: 'Verified', jobs: 98, rating: 4.8 },
                  { name: 'Manjunath Hegde', category: 'Industrial Cleaner', kyc: 'Pending Review', jobs: 0, rating: 5.0 },
                ].map((w, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{w.name}</div>
                      <div className="text-xs text-slate-400">{w.category} &bull; {w.jobs} completed shifts &bull; ★ {w.rating}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      w.kyc === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {w.kyc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'orders' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white">Job Requisitions & Headcount Assignments</h2>
              <p className="text-xs text-slate-400">View real-time matched workers and arrival status.</p>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
                Connected with PostgreSQL <code>bookings</code> and <code>booking_assignments</code> tables.
              </div>
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white">Financial Ledger & Audit Trail</h2>
              <p className="text-xs text-slate-400">Escrow deposits, payouts, refunds, and platform fees.</p>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
                Audit logs synchronized across all 3 apps: Customer Flutter App, Employee Flutter App, and Admin Console.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
