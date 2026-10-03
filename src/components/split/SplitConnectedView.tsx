import React from 'react';
import {
  Users,
  Smartphone,
  HardHat,
  ArrowRight,
  Zap,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerApp } from '../customer/CustomerApp';
import { EmployeeApp } from '../employee/EmployeeApp';

export const SplitConnectedView: React.FC = () => {
  const {
    commission,
    stats,
    simulateIncomingBid,
    resetDemoData,
    workers,
    activeWorkerId,
    setActiveWorkerId,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Live Ecosystem Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-3xl shadow-lg border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
              Interactive Ecosystem Simulator
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white tracking-tight">
            Cross-Flow Manpower Bidding Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Post a job on the <strong>Employer App (Left)</strong>, watch it instantly appear on the{' '}
            <strong>Employee App (Right)</strong>, submit quotes, hire crew, and watch platform commission automatically settle!
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={simulateIncomingBid}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Incoming Bid</span>
          </button>
          <button
            onClick={resetDemoData}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Reset All Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side by side mobile viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-center">
        {/* Left Column: Customer / Employer App */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              1. Customer / Employer Flow
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Post requirements & accept worker bids</p>
          </div>
          <CustomerApp />
        </div>

        {/* Right Column: Employee App */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              <HardHat className="w-3.5 h-3.5 text-amber-600" />
              2. Employee / Worker Flow
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Receive job opportunities & submit quotes</p>
          </div>
          <EmployeeApp />
        </div>
      </div>
    </div>
  );
};
