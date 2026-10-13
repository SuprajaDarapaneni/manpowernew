import React, { useState } from 'react';
import { CustomerApp } from '../customer/CustomerApp';
import { EmployeeApp } from '../employee/EmployeeApp';
import { AdminApp } from '../admin/AdminApp';
import { Smartphone, HardHat, LayoutDashboard, Zap, Columns } from 'lucide-react';

interface Props {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenDeletion?: () => void;
}

export const SplitConnectedView: React.FC<Props> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDeletion,
}) => {
  const [layoutMode, setLayoutMode] = useState<'all' | 'mobile' | 'customer_admin' | 'worker_admin'>('all');

  return (
    <div className="flex-1 bg-slate-900 p-3 sm:p-5 text-slate-100 flex flex-col space-y-4 font-sans">
      {/* Ecosystem Sync & Layout Controls Banner */}
      <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-yellow-400 text-slate-950 font-black shadow-xs">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-sm text-white">Live Multi-App Ecosystem Simulator</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                MongoDB Atlas Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive preview: Log into each app with its independent credentials &bull; Post job on Customer &bull; Bid on Worker &bull; Track on Admin Console in real time.
            </p>
          </div>
        </div>

        {/* Layout Mode Selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setLayoutMode('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              layoutMode === 'all'
                ? 'bg-yellow-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 3 Apps
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('mobile')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              layoutMode === 'mobile'
                ? 'bg-yellow-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer + Worker
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('customer_admin')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              layoutMode === 'customer_admin'
                ? 'bg-yellow-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer + Admin
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('worker_admin')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              layoutMode === 'worker_admin'
                ? 'bg-yellow-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Worker + Admin
          </button>
        </div>
      </div>

      {/* Multi-App Responsive Viewport */}
      <div className={`grid gap-5 flex-1 items-start ${
        layoutMode === 'all'
          ? 'grid-cols-1 lg:grid-cols-12'
          : layoutMode === 'mobile'
          ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full'
          : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Panel 1: Customer / Employer App */}
        {(layoutMode === 'all' || layoutMode === 'mobile' || layoutMode === 'customer_admin') && (
          <div className={`${
            layoutMode === 'all'
              ? 'lg:col-span-4'
              : layoutMode === 'customer_admin'
              ? 'lg:col-span-5'
              : 'w-full'
          } flex flex-col items-center space-y-2`}>
            <div className="w-full flex items-center justify-between px-2 text-xs">
              <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-red-500" />
                <span>1. Customer / Employer App</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Mobile View</span>
            </div>

            <div className="w-full max-w-sm rounded-3xl overflow-hidden border-2 border-red-500/40 shadow-2xl bg-slate-50">
              <CustomerApp
                onOpenPrivacy={onOpenPrivacy}
                onOpenTerms={onOpenTerms}
                onOpenDeletion={onOpenDeletion}
              />
            </div>
          </div>
        )}

        {/* Panel 2: Employee / Worker App */}
        {(layoutMode === 'all' || layoutMode === 'mobile' || layoutMode === 'worker_admin') && (
          <div className={`${
            layoutMode === 'all'
              ? 'lg:col-span-4'
              : layoutMode === 'worker_admin'
              ? 'lg:col-span-5'
              : 'w-full'
          } flex flex-col items-center space-y-2`}>
            <div className="w-full flex items-center justify-between px-2 text-xs">
              <span className="font-extrabold text-yellow-400 flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-yellow-500" />
                <span>2. Employee / Worker App</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Mobile View</span>
            </div>

            <div className="w-full max-w-sm rounded-3xl overflow-hidden border-2 border-yellow-500/40 shadow-2xl bg-slate-50">
              <EmployeeApp
                onOpenPrivacy={onOpenPrivacy}
                onOpenTerms={onOpenTerms}
                onOpenDeletion={onOpenDeletion}
              />
            </div>
          </div>
        )}

        {/* Panel 3: Admin Web Management Panel */}
        {(layoutMode === 'all' || layoutMode === 'customer_admin' || layoutMode === 'worker_admin') && (
          <div className={`${
            layoutMode === 'all'
              ? 'lg:col-span-4'
              : 'lg:col-span-7'
          } flex flex-col items-center space-y-2`}>
            <div className="w-full flex items-center justify-between px-2 text-xs">
              <span className="font-extrabold text-blue-400 flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                <span>3. Admin Web Console</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Desktop Panel</span>
            </div>

            <div className="w-full rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-slate-100 max-h-[880px] overflow-y-auto">
              <AdminApp />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitConnectedView;
