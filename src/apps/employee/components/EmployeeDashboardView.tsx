import React from 'react';
import {
  Wallet,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  HardHat,
  Zap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';

export const EmployeeDashboardView: React.FC = () => {
  const { currentWorker, orders, myAcceptedOrders, setEmployeeScreen } = useEmployeeApp();

  const activeShift = myAcceptedOrders[0];

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      {/* Hello Worker Greeting & Availability Status */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider">
              {currentWorker.isAvailable ? 'Online & Ready for Shifts' : 'Currently Offline'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black leading-tight">
            Hello, {currentWorker.name}!
          </h2>
          <p className="text-[11px] font-medium opacity-90">
            {currentWorker.category} &bull; {currentWorker.location}
          </p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-yellow-100 text-yellow-800">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Available Wallet Balance
              </span>
              <strong className="text-lg font-black text-slate-900">
                ₹{currentWorker.walletBalance.toLocaleString()}
              </strong>
            </div>
          </div>

          <button
            onClick={() => setEmployeeScreen('earnings')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            Withdrawals
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100 text-[11px]">
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Completed</span>
            <strong className="text-slate-800 font-bold">{currentWorker.jobsCompleted} Shifts</strong>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Rating</span>
            <div className="flex items-center justify-center text-amber-600 font-bold">
              <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
              <span>{currentWorker.rating}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Hourly Rate</span>
            <strong className="text-emerald-700 font-bold">₹{currentWorker.hourlyRate}/hr</strong>
          </div>
        </div>
      </div>

      {/* Active Shift Card (If assigned to order) */}
      {activeShift && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-yellow-400/80 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Assigned Shift Active
            </span>
            <span className="font-mono text-xs font-bold text-slate-800">
              {activeShift.orderNumber}
            </span>
          </div>

          <h3 className="font-extrabold text-sm text-slate-900">{activeShift.title}</h3>

          <div className="space-y-1 text-[11px] text-slate-700">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{activeShift.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Shift: {activeShift.durationHours} Hours &bull; Floor: ₹{activeShift.pricePerHead}/head</span>
            </div>
          </div>

          <button
            onClick={() => setEmployeeScreen('bids')}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <span>Enter On-Site Start OTP &amp; Clock In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Nearby Available Shifts Quick Action */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center justify-between gap-3">
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs">
            {orders.length} Shifts Available Nearby
          </h4>
          <p className="text-[11px] text-slate-500">
            Submit custom quotations &amp; get booked today
          </p>
        </div>

        <button
          onClick={() => setEmployeeScreen('available')}
          className="px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-xs flex items-center space-x-1 transition cursor-pointer shadow-2xs"
        >
          <span>Find Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
