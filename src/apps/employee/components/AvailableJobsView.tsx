import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';
import confetti from 'canvas-confetti';
import { JobOrder } from '../../../types';

export const AvailableJobsView: React.FC = () => {
  const { orders, currentWorker, submitBid, myBids, setEmployeeScreen, addNotification } = useEmployeeApp();

  const [selectedJobToBid, setSelectedJobToBid] = useState<JobOrder | null>(null);
  const [proposedAmount, setProposedAmount] = useState<number>(2000);
  const [proposedTime, setProposedTime] = useState<string>('Will reach in 30 mins');
  const [notes, setNotes] = useState<string>('Ready with heavy equipment & verified crew.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBidModal = (job: JobOrder) => {
    setSelectedJobToBid(job);
    const estimatedAmount = (job.pricePerHead || 500) * (job.requiredWorkers || 1);
    setProposedAmount(estimatedAmount);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobToBid) return;

    setIsSubmitting(true);
    submitBid(selectedJobToBid.id, Number(proposedAmount), notes);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setIsSubmitting(false);
    setSelectedJobToBid(null);
    addNotification('Bid Placed', `Your quote of ₹${proposedAmount.toLocaleString()} has been sent to the employer.`, 'bid', 'customer');
    setEmployeeScreen('bids');
  };

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Available Work Shifts</h2>
          <p className="text-slate-500 text-[11px]">Direct bookings from verified commercial employers</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-[10px]">
          {orders.length} Shifts Open
        </span>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-xs">No active shifts right now</h3>
            <p className="text-[11px] text-slate-500 mt-1">Keep your status Online to get notified immediately.</p>
          </div>
        ) : (
          orders.map((job) => {
            const hasAlreadyBid = myBids.some((b) => b.jobId === job.id);

            return (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                        {job.orderNumber}
                      </span>
                      <strong className="text-slate-900 text-xs font-bold">{job.title}</strong>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500 space-x-2 mt-1">
                      <span className="text-yellow-700 font-semibold">{job.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-red-500 mr-0.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">
                      ₹{job.pricePerHead}/head
                    </span>
                    <span className="text-[10px] text-slate-400">Offered Rate</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-slate-50 p-2 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Required</span>
                    <strong className="text-slate-800">{job.requiredWorkers} Workers</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Shift Duration</span>
                    <strong className="text-slate-800">{job.durationHours} Hours</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Escrow</span>
                    <strong className="text-emerald-700">₹{(((job.pricePerHead ?? job.amountPerHead ?? job.minPricePerHead ?? 0)) * job.requiredWorkers).toLocaleString()}</strong>
                  </div>
                </div>

                {job.notes && (
                  <p className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-xl border border-yellow-200/50">
                    &ldquo;{job.notes}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Posted: {job.createdAt || 'Recent'}
                  </span>

                  {hasAlreadyBid ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Quotation Sent</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => openBidModal(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3 text-yellow-400" />
                      <span>Submit Quote</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bid Modal */}
      {selectedJobToBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Place Quotation</span>
                <h3 className="font-extrabold text-sm text-slate-900">{selectedJobToBid.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJobToBid(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Total Bid / Quotation (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Arrival Time / ETA
                </label>
                <input
                  type="text"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  placeholder="e.g. Can reach at 8:30 AM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note to Employer
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedJobToBid(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-xs shadow-xs"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
