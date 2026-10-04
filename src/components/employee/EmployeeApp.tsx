import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  User,
  Sliders,
  Wallet,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhoneFrame } from '../common/PhoneFrame';
import { EmployeeDashboard } from './EmployeeDashboard';
import { JobDetailsBidding } from './JobDetailsBidding';
import { AvailableJobsView } from './AvailableJobsView';
import { EmployeeBidsView } from './EmployeeBidsView';
import { EmployeeLoginView } from '../auth/EmployeeLoginView';
import { LogOut, ArrowRightLeft } from 'lucide-react';

export const EmployeeApp: React.FC = () => {
  const { employeeScreen, setEmployeeScreen, workers, activeWorkerId, bids, employeeAuth, signOut, switchWorkerAccount } = useApp();

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const pendingBidsCount = bids.filter((b) => b.workerId === worker.id && b.status === 'pending').length;

  if (!employeeAuth) {
    return (
      <PhoneFrame
        title="Employee / Worker App"
        roleBadge={{ label: 'Worker Login Required', color: 'bg-amber-100 text-amber-800' }}
      >
        <EmployeeLoginView />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      title="Employee / Worker App"
      roleBadge={{ label: `Worker: ${worker.name.split(' ')[0]}`, color: 'bg-amber-100 text-amber-800' }}
    >
      <div className="flex-1 flex flex-col relative h-full">
        {/* Render Active Screen */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {employeeScreen === 'dashboard' && <EmployeeDashboard />}
          {employeeScreen === 'job-details' && <JobDetailsBidding />}
          {employeeScreen === 'available-jobs' && <AvailableJobsView />}
          {employeeScreen === 'my-bids' && <EmployeeBidsView />}
          {employeeScreen === 'earnings' && (
            <div className="flex-1 p-5 space-y-4 bg-slate-50 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 mx-auto"
                />
                <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
                <p className="text-slate-500 text-[11px]">{worker.phone} • {worker.location}</p>
                <div className="flex justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Identity Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    ★ {worker.rating} ({worker.totalReviews})
                  </span>
                </div>
              </div>

              {/* Wallet Summary */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Worker Earnings & Bank Details
                </h4>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">In-App Wallet:</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{worker.walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Completed Manpower Tasks:</span>
                  <span className="font-bold text-slate-900">{worker.jobsCompleted}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Primary Specialty:</span>
                  <span className="font-semibold text-emerald-700">{worker.category}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => alert(`Initiating bank payout of ₹${worker.walletBalance} to Bank Account ending in 9812...`)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
                >
                  Request Bank Transfer
                </button>

                <button
                  onClick={() => signOut('employee')}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 border border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out from Worker Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile App Bottom Navigation Bar matching Screenshot 1 */}
        <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-30 sticky bottom-0">
          <button
            onClick={() => setEmployeeScreen('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              employeeScreen === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => setEmployeeScreen('available-jobs')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              employeeScreen === 'available-jobs' || employeeScreen === 'job-details'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Jobs Feed</span>
          </button>

          <button
            onClick={() => setEmployeeScreen('my-bids')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition ${
              employeeScreen === 'my-bids' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">My Bids</span>
            {pendingBidsCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setEmployeeScreen('earnings')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              employeeScreen === 'earnings' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Earnings</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
};
