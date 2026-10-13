import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Download,
  IndianRupee,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';

export const EmployeeEarningsView: React.FC = () => {
  const { currentWorker, walletTransactions, debitWorkerWallet, addNotification } = useEmployeeApp();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(1000);
  const [upiId, setUpiId] = useState('ramesh@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > currentWorker.walletBalance) return;

    setIsProcessing(true);
    debitWorkerWallet(currentWorker.id, withdrawAmount, `Withdrawal to UPI ${upiId}`);
    setIsProcessing(false);
    setShowWithdrawModal(false);
    addNotification('Withdrawal Initiated', `₹${withdrawAmount.toLocaleString()} transfer initiated to ${upiId}.`, 'success', 'employee');
  };

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total Withdrawable Balance
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
            Instant Transfer
          </span>
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black text-white">
            ₹{currentWorker.walletBalance.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">INR</span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={currentWorker.walletBalance <= 0}
            className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw to Bank / UPI</span>
          </button>
        </div>
      </div>

      {/* Commission & Net Earnings Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-semibold">Platform Fee Applied</span>
          <strong className="text-slate-800 font-bold text-xs">10% / Completed Order</strong>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-semibold">Completed Shifts</span>
          <strong className="text-emerald-700 font-bold text-xs">{currentWorker.jobsCompleted} Paid Jobs</strong>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
          Transaction &amp; Payout History
        </h3>

        <div className="space-y-2">
          {walletTransactions.length === 0 ? (
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
              No recent withdrawals or debits recorded.
            </div>
          ) : (
            walletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <strong className="text-slate-800 text-xs block">{tx.description}</strong>
                  <span className="text-[10px] text-slate-400">{tx.timestamp}</span>
                </div>
                <span
                  className={`font-bold text-xs ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Withdrawal Request</h3>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount (Max: ₹{currentWorker.walletBalance})
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    max={currentWorker.walletBalance}
                    min={100}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination UPI ID / VPA
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or name@okaxis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
