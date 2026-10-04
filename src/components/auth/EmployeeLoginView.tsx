import React, { useState } from 'react';
import {
  HardHat,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployeeLoginView: React.FC = () => {
  const { workers, loginEmployee } = useApp();
  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || 'w-ramesh');
  const [otp, setOtp] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginEmployee(selectedWorkerId, otp || '1234');
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 bg-slate-900 font-sans text-slate-100">
      <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-5 sm:p-6">
        {/* Header */}
        <div className="text-center space-y-1.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto text-white shadow-md shadow-amber-500/20">
            <HardHat className="w-6 h-6" />
          </div>
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Worker Partner Sign In
          </h2>
          <p className="text-[11px] text-slate-400">
            Access daily jobs, submit bid quotes & receive direct wallet payouts
          </p>
        </div>

        {/* Compulsory Login Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-snug">
            <strong>Login Compulsory:</strong> Worker partner authentication is required before accessing available jobs or placing bids.
          </span>
        </div>

        {/* Worker Profile Card Selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
            Select Worker Account:
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {workers.slice(0, 4).map((w) => {
              const isSelected = selectedWorkerId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-200 shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-700/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={w.avatar}
                      alt={w.name}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                    />
                    <div>
                      <div className="font-bold text-[11px] text-white flex items-center gap-1.5">
                        {w.name}
                        <span className="text-[10px] text-amber-400 font-semibold">
                          ★ {w.rating}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{w.category} &bull; {w.phone}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Phone & OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Registered Mobile / Aadhaar ID
            </label>
            <input
              type="text"
              readOnly
              value={selectedWorker?.phone || '+91 98765 43210'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                OTP Verification Code
              </label>
              <span className="text-[10px] text-amber-400 font-bold">Demo OTP: 1234</span>
            </div>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-center font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating Worker...</span>
            ) : (
              <>
                <span>Sign In as {selectedWorker?.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aadhaar & Bank Verified</span>
          </div>
          <span>Daily Payouts Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
