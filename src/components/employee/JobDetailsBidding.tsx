import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JobDetailsBidding: React.FC = () => {
  const {
    orders,
    selectedJobId,
    submitBid,
    setEmployeeScreen,
    workers,
    activeWorkerId,
    bids,
  } = useApp();

  const selectedOrder = orders.find((o) => o.id === selectedJobId) || orders[0];
  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const existingBid = bids.find((b) => b.jobId === selectedOrder.id && b.workerId === worker.id);

  const [bidAmount, setBidAmount] = useState<number>(selectedOrder.minBudget);
  const [notes, setNotes] = useState('Ready with safety boots & cargo experience.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    submitBid(selectedOrder.id, Number(bidAmount), notes);
    setIsSubmitted(true);
    setTimeout(() => {
      setEmployeeScreen('my-bids');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Screenshot 2 (Employee Flow) */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={() => setEmployeeScreen('dashboard')}
          className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-sm text-slate-900">Job Details</h2>
        <div className="w-5"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Job Primary Card matching Screenshot 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                Order {selectedOrder.orderNumber}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{selectedOrder.category}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedOrder.title}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Employer Budget</span>
              <span className="text-sm font-extrabold text-emerald-700">
                ₹{selectedOrder.minBudget.toLocaleString()} - {selectedOrder.maxBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Details Row matching Screenshot 2 */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{selectedOrder.location}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {selectedOrder.scheduledDate} at {selectedOrder.scheduledTime} ({selectedOrder.workingHours} Hours)
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {selectedOrder.requiredWorkers} Workers needed • {selectedOrder.assignedWorkerIds.length} spots filled
              </span>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
            <span className="font-bold text-slate-700 block">Workplace Scope & Requirements:</span>
            <p className="text-slate-600">
              {selectedOrder.specialInstructions || 'Heavy items, warehouse work. Proper boots and fitness needed.'}
            </p>
          </div>
        </div>

        {/* Existing Bid Status if already bid */}
        {existingBid ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm text-slate-900">Bid Submitted (₹{existingBid.amount})</h4>
            <p className="text-xs text-slate-600">
              Your quote is currently under review by the employer.
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                existingBid.status === 'accepted' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {existingBid.status}
            </span>
          </div>
        ) : (
          /* Bidding Form matching Screenshot 2 */
          <form onSubmit={handleSubmitBid} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Submit Your Bid Quote
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex justify-between">
                <span>Proposed Amount (₹)</span>
                <span className="text-emerald-700 font-bold">Suggested: ₹{bidAmount}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  required
                  step="50"
                  min="500"
                  max="10000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2 mt-2">
                {[
                  { label: 'Min Budget', val: selectedOrder.minBudget },
                  { label: 'Mid Rate', val: Math.round((selectedOrder.minBudget + selectedOrder.maxBudget) / 2) },
                  { label: 'Max Budget', val: selectedOrder.maxBudget },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBidAmount(preset.val)}
                    className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 transition"
                  >
                    ₹{preset.val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Note for Employer
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Can bring safety tools, punctual"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons matching Screenshot 2 */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitted ? 'Submitting Bid...' : 'Accept & Place Bid'}</span>
              </button>

              <button
                type="button"
                onClick={() => setEmployeeScreen('dashboard')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
              >
                Decline
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
