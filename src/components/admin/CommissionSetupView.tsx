import React, { useState } from 'react';
import {
  Percent,
  IndianRupee,
  Save,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommissionSetupView: React.FC = () => {
  const { commission, updateCommission } = useApp();

  const [type, setType] = useState<'percentage' | 'fixed'>(commission.type);
  const [percentage, setPercentage] = useState(commission.percentage);
  const [fixedAmount, setFixedAmount] = useState(commission.fixedAmount);
  const [minWalletBalance, setMinWalletBalance] = useState(commission.minWalletBalance ?? 200);
  const [commissionDebitedOnAccept, setCommissionDebitedOnAccept] = useState(
    commission.commissionDebitedOnAccept ?? true
  );
  const [startOtpRequired, setStartOtpRequired] = useState(commission.startOtpRequired ?? true);
  const [endOtpRequired, setEndOtpRequired] = useState(commission.endOtpRequired ?? true);
  const [overtimeHourlyRateMultiplier, setOvertimeHourlyRateMultiplier] = useState(
    commission.overtimeHourlyRateMultiplier ?? 1.5
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Calculator State
  const [calcOrderAmount, setCalcOrderAmount] = useState(2500);
  const [calcWorkerCount, setCalcWorkerCount] = useState(4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommission({
      type,
      percentage: Number(percentage),
      fixedAmount: Number(fixedAmount),
      minWalletBalance: Number(minWalletBalance),
      commissionDebitedOnAccept,
      lowBalanceAlertThreshold: Number(minWalletBalance),
      startOtpRequired,
      endOtpRequired,
      overtimeHourlyRateMultiplier: Number(overtimeHourlyRateMultiplier),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Calculations for preview
  const calculatedFee =
    type === 'percentage'
      ? Math.round((calcOrderAmount * percentage) / 100)
      : Number(fixedAmount);

  const netWorkerPool = calcOrderAmount - calculatedFee;
  const perWorkerShare = calcWorkerCount > 0 ? Math.round(netWorkerPool / calcWorkerCount) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-yellow-500 text-white flex items-center justify-center shadow-md">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Commission & Worker Wallet Setups
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure monetization rates, auto-debit rules from employee in-app wallets, and minimum balance enforcement
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Card */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. COMMISSION MONETIZATION TYPE */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                1. Commission Monetization Model
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    type === 'percentage'
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="commissionType"
                    checked={type === 'percentage'}
                    onChange={() => setType('percentage')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Percentage (%)</span>
                    <span className="text-[11px] text-slate-500">e.g. 10% of order value</span>
                  </div>
                </label>

                <label
                  className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    type === 'fixed'
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="commissionType"
                    checked={type === 'fixed'}
                    onChange={() => setType('fixed')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Fixed Fee (₹)</span>
                    <span className="text-[11px] text-slate-500">e.g. ₹50 flat per order</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Inputs based on selection */}
            <div className="space-y-4">
              {type === 'percentage' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Platform Commission Percentage (%)</span>
                    <span className="text-red-600 text-xs font-bold">Active Rule</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="0.5"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Platform automatically deducts {percentage}% from employee's prepaid in-app wallet per confirmed shift.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Fixed Flat Charge Per Order (₹)</span>
                    <span className="text-red-600 text-xs font-bold">Active Rule</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      step="10"
                      value={fixedAmount}
                      onChange={(e) => setFixedAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-500"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Flat platform charge of ₹{fixedAmount} debited from worker wallet per assigned job order.
                  </p>
                </div>
              )}
            </div>

            {/* 2. EMPLOYEE WALLET BALANCE & DEBIT SETUPS */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-950 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Worker Wallet Balance Requirements
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Employees must maintain this balance to receive orders in dispatch feed
                  </p>
                </div>
              </div>

              {/* Minimum Wallet Balance Input & Presets */}
              <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50/50 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">
                      Minimum Required Wallet Balance (₹)
                    </label>
                    <span className="text-xs font-extrabold text-red-600">
                      Current: ₹{minWalletBalance}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={minWalletBalance}
                    onChange={(e) => setMinWalletBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-yellow-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                  <div className="flex gap-2 mt-2">
                    {[100, 200, 500, 1000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setMinWalletBalance(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          minWalletBalance === preset
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    ⚠️ If a worker's wallet falls below <strong>₹{minWalletBalance}</strong>, they are blocked from accepting new jobs and submitting bids until they top up.
                  </p>
                </div>

                {/* Auto Debit Commission on Order Accept Toggle */}
                <div className="pt-2 border-t border-yellow-200/80">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commissionDebitedOnAccept}
                      onChange={(e) => setCommissionDebitedOnAccept(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Auto-Debit Admin Commission Upon Job Acceptance
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Commission is deducted instantly from the worker's wallet when they confirm a shift. Since employers pay full cash at worksite, this collects the platform fee reliably.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. OTP & WORK VERIFICATION CONTROLS */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>3. Shift Start & End OTP Controls</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure whether workers must enter customer OTPs before starting and completing shifts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Start OTP Option */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Start Work OTP</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        startOtpRequired
                          ? 'bg-yellow-100 text-yellow-950 border border-yellow-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {startOtpRequired ? 'Required' : 'Bypassed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setStartOtpRequired(true)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        startOtpRequired
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Require OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setStartOtpRequired(false)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        !startOtpRequired
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Bypass OTP
                    </button>
                  </div>
                </div>

                {/* 2. End OTP Option */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">End Work OTP</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        endOtpRequired
                          ? 'bg-yellow-100 text-yellow-950 border border-yellow-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {endOtpRequired ? 'Required' : 'Bypassed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEndOtpRequired(true)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        endOtpRequired
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Require OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setEndOtpRequired(false)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        !endOtpRequired
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Bypass OTP
                    </button>
                  </div>
                </div>
              </div>

              {/* Overtime Multiplier */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Overtime (OT) Hourly Multiplier
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Calculated on additional hours worked past shift schedule
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="3"
                    step="0.25"
                    value={overtimeHourlyRateMultiplier}
                    onChange={(e) => setOvertimeHourlyRateMultiplier(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-700">x base rate</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-yellow-700 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                  Commission & wallet setups saved successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Applies immediately across platform</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-950/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Setups</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Simulation Calculator Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 rounded-3xl shadow-xl border border-red-900/40 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-700/80 pb-3">
              <Calculator className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-base">Live Commission & Wallet Simulator</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Booking Amount from Employer (₹)
                </label>
                <input
                  type="number"
                  step="100"
                  value={calcOrderAmount}
                  onChange={(e) => setCalcOrderAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Required Workers in Crew
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={calcWorkerCount}
                  onChange={(e) => setCalcWorkerCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Payout Breakdown */}
            <div className="p-4 bg-slate-800/80 rounded-2xl space-y-2.5 border border-slate-700/60 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Employer Pays at Site:</span>
                <span className="font-bold text-white">₹{calcOrderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-yellow-400 font-semibold">
                <span>
                  Admin Commission Debited ({type === 'percentage' ? `${percentage}%` : 'Fixed'}):
                </span>
                <span>- ₹{calculatedFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                <span>Total Net Worker Pool:</span>
                <span className="text-yellow-300">₹{netWorkerPool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Per Worker Share ({calcWorkerCount} crew):</span>
                <span className="font-semibold text-white">₹{perWorkerShare.toLocaleString()} each</span>
              </div>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-yellow-200">
                <span>Required Wallet Balance Buffer:</span>
                <span className="font-bold ml-1">Min ₹{minWalletBalance}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Admin commission is debited directly from each worker's in-app prepaid wallet. If a worker has under ₹{minWalletBalance}, the dispatch engine suspends job acceptance until recharge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
