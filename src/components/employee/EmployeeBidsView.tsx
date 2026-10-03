import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  MapPin,
  Calendar,
  ShieldCheck,
  Briefcase,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployeeBidsView: React.FC = () => {
  const { bids, orders, activeWorkerId, workers } = useApp();
  const [tab, setTab] = useState<'all' | 'accepted' | 'pending'>('all');
  const [otpInput, setOtpInput] = useState('');
  const [verifiedJobId, setVerifiedJobId] = useState<string | null>(null);

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const myBids = bids.filter((b) => b.workerId === worker.id);

  const filteredBids = myBids.filter((b) => {
    if (tab === 'all') return true;
    return b.status === tab;
  });

  const handleVerifyOtp = (jobId: string) => {
    if (otpInput === '4829' || otpInput.length === 4) {
      setVerifiedJobId(jobId);
      alert('Work OTP Verified! Job marked as in-progress. Payment escrow secured.');
      setOtpInput('');
    } else {
      alert('Please enter a valid 4-digit employer OTP (Demo OTP is 4829).');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-slate-200/80 sticky top-0 z-20">
        <h2 className="font-bold text-base text-slate-900">My Submitted Quotes</h2>
        <p className="text-[11px] text-slate-400">Track acceptance, assignment status & payouts</p>

        {/* Tabs */}
        <div className="flex items-center space-x-2 mt-3 bg-slate-100 p-1 rounded-xl">
          {(['all', 'accepted', 'pending'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredBids.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No {tab} bids recorded</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Check the "Available Jobs" tab to bid on open employer requests.
            </p>
          </div>
        ) : (
          filteredBids.map((bid) => {
            const relatedOrder = orders.find((o) => o.id === bid.jobId);
            const isAccepted = bid.status === 'accepted';

            return (
              <div
                key={bid.id}
                className={`bg-white p-4 rounded-2xl border transition space-y-3 ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                      {relatedOrder?.orderNumber || 'Order'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {relatedOrder?.category || 'Manpower Service'}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{relatedOrder?.location || 'Mangalore, Karnataka'}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isAccepted
                        ? 'bg-emerald-100 text-emerald-800'
                        : bid.status === 'declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAccepted && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {bid.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="text-[11px] text-slate-400">Your Quote Amount:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{bid.amount.toLocaleString()}
                  </span>
                </div>

                {/* If accepted, show Work OTP start code verification box */}
                {isAccepted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Work Verification:</span>
                      </span>
                      {verifiedJobId === bid.jobId ? (
                        <span className="text-emerald-700 font-bold text-[11px]">✓ Verified</span>
                      ) : (
                        <span className="text-slate-500 font-normal text-[10px]">Ask employer for OTP</span>
                      )}
                    </div>

                    {verifiedJobId !== bid.jobId && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 4829"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="w-24 px-2.5 py-1 text-center font-mono font-bold tracking-widest text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={() => handleVerifyOtp(bid.jobId)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
