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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommissionSetupView: React.FC = () => {
  const { commission, updateCommission, addNotification } = useApp();

  const [type, setType] = useState<'percentage' | 'fixed'>(commission.type);
  const [percentage, setPercentage] = useState(commission.percentage);
  const [fixedAmount, setFixedAmount] = useState(commission.fixedAmount);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header matching Screenshot 4 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Commission Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure platform monetization logic. Deduct fees either as a percentage of the total transaction or a fixed flat rate per confirmed order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Card matching Screen 4 */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Commission Type Radio Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Commission Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition ${
                    type === 'percentage'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="commissionType"
                    checked={type === 'percentage'}
                    onChange={() => setType('percentage')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Percentage (%)</span>
                    <span className="text-[11px] text-slate-500">e.g. 10% of order value</span>
                  </div>
                </label>

                <label
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition ${
                    type === 'fixed'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="commissionType"
                    checked={type === 'fixed'}
                    onChange={() => setType('fixed')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Fixed Amount (₹)</span>
                    <span className="text-[11px] text-slate-500">e.g. ₹50 flat per order</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Inputs based on selection */}
            <div className="space-y-4">
              {/* Percentage input */}
              <div className={type === 'percentage' ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Percentage (%)</span>
                  {type === 'percentage' && <span className="text-emerald-600 text-xs font-bold">Active Setting</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    disabled={type !== 'percentage'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Platform will automatically deduct {percentage}% from all customer payments before worker payout.
                </p>
              </div>

              {/* Fixed Amount input */}
              <div className={type === 'fixed' ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Fixed Amount (₹)</span>
                  {type === 'fixed' && <span className="text-emerald-600 text-xs font-bold">Active Setting</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    step="10"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(Number(e.target.value))}
                    disabled={type !== 'fixed'}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Fixed platform charge of ₹{fixedAmount} applied per confirmed manpower order.
                </p>
              </div>
            </div>

            {/* Save Button matching Screen 4 */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Commission settings saved successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Applies immediately to new confirmed orders</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Simulation Calculator Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base">Live Payout Simulator</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Sample Job Amount (₹)</label>
                <input
                  type="number"
                  step="100"
                  value={calcOrderAmount}
                  onChange={(e) => setCalcOrderAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Required Workers</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={calcWorkerCount}
                  onChange={(e) => setCalcWorkerCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payout Breakdown */}
            <div className="p-4 bg-slate-800/80 rounded-xl space-y-2.5 border border-slate-700/60 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Employer Pays:</span>
                <span className="font-bold text-white">₹{calcOrderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Platform Commission ({type === 'percentage' ? `${percentage}%` : 'Fixed'}):</span>
                <span>- ₹{calculatedFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                <span>Net Worker Pool:</span>
                <span className="text-emerald-300">₹{netWorkerPool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Per Worker Payout ({calcWorkerCount} workers):</span>
                <span className="font-semibold text-slate-200">₹{perWorkerShare.toLocaleString()} each</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Funds are automatically dispatched into each worker's in-app digital wallet upon order completion OTP verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
