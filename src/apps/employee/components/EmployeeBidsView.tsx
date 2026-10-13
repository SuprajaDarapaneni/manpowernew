import React, { useState } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  KeyRound,
  MapPin,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';

export const EmployeeBidsView: React.FC = () => {
  const {
    myBids,
    myAcceptedOrders,
    currentWorker,
    startWorkWithOtp,
    endWorkWithOtp,
    addNotification,
  } = useEmployeeApp();

  const [otpInput, setOtpInput] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'bids' | 'active'>('active');

  const handleStartWork = (orderId: string) => {
    const code = otpInput[orderId] || '';
    if (!code) return;
    const res = startWorkWithOtp(orderId, currentWorker.id, code);
    if (res.success) {
      addNotification('Clock-in Verified', 'Work shift officially started. GPS attendance verified.', 'success', 'employee');
      setOtpInput((prev) => ({ ...prev, [orderId]: '' }));
    }
  };

  const handleEndWork = (orderId: string) => {
    const code = otpInput[orderId] || '';
    if (!code) return;
    const res = endWorkWithOtp(orderId, currentWorker.id, code, 8);
    if (res.success) {
      addNotification('Shift Completed', 'Shift finished. Escrow payment credited to worker wallet.', 'success', 'employee');
      setOtpInput((prev) => ({ ...prev, [orderId]: '' }));
    }
  };

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Shifts ({myAcceptedOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTab === 'bids'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Submitted Quotes ({myBids.length})
        </button>
      </div>

      {/* Tab 1: Active Assigned Shifts & OTP Verification */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          {myAcceptedOrders.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
              <KeyRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-xs">No active on-site shifts</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepted proposals will appear here with OTP verification tools.
              </p>
            </div>
          ) : (
            myAcceptedOrders.map((order) => {
              const currentVal = otpInput[order.id] || '';

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                          {order.orderNumber}
                        </span>
                        <strong className="text-slate-900 font-bold text-xs">{order.title}</strong>
                      </div>
                      <div className="flex items-center text-[11px] text-slate-500 space-x-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{order.location}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                      {order.status}
                    </span>
                  </div>

                  {/* On-Site Attendance OTP Verification Field */}
                  <div className="p-3 bg-amber-50 border border-yellow-300/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-yellow-950 font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-yellow-600" />
                        <span>Attendance Verification</span>
                      </span>
                      <span className="text-[10px] text-yellow-800">Ask employer for code</span>
                    </div>

                    <p className="text-[10px] text-yellow-900 leading-snug">
                      Enter the 4-digit OTP provided by the employer to clock in or complete shift.
                    </p>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter OTP (e.g. 1234)"
                        value={currentVal}
                        onChange={(e) =>
                          setOtpInput((prev) => ({ ...prev, [order.id]: e.target.value }))
                        }
                        className="flex-1 bg-white border border-yellow-300 rounded-xl px-3 py-1.5 font-mono text-center font-bold text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      />
                      <button
                        onClick={() => handleStartWork(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Clock In
                      </button>
                      <button
                        onClick={() => handleEndWork(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Finish Shift
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Submitted Bids */}
      {activeTab === 'bids' && (
        <div className="space-y-2.5">
          {myBids.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
              <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-xs">No submitted bids yet</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Browse available shifts to submit quotations.
              </p>
            </div>
          ) : (
            myBids.map((bid) => {
              const isAccepted = bid.status === 'accepted';
              const isDeclined = bid.status === 'declined';

              return (
                <div
                  key={bid.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Order Ref: {bid.jobId}
                      </span>
                      <strong className="text-slate-900 font-bold text-xs">
                        ₹{bid.amount.toLocaleString()} Proposed Quote
                      </strong>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDeclined
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>

                  {bid.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                      &ldquo;{bid.notes}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>ETA: {bid.proposedTime}</span>
                    <span>Submitted: {bid.createdAt || 'Just now'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
