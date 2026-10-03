import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const OrderConfirmationView: React.FC = () => {
  const {
    orders,
    selectedJobId,
    workers,
    bids,
    setCustomerScreen,
  } = useApp();

  const selectedOrder = orders.find((o) => o.id === selectedJobId) || orders[0];
  const acceptedBids = bids.filter((b) => b.jobId === selectedOrder.id && b.status === 'accepted');

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Top Header */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between">
        <span className="font-bold text-sm text-slate-900">Order Confirmation</span>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {selectedOrder.orderNumber}
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* Celebration & Confirmation Card matching Screenshot 5 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-lg font-extrabold text-slate-900">Job Confirmed!</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Workers have been assigned and will arrive at scheduled time.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {selectedOrder.scheduledDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {selectedOrder.scheduledTime}
            </span>
          </div>
        </div>

        {/* Selected Employees matching Screenshot 5 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Selected Employees ({acceptedBids.length > 0 ? acceptedBids.length : 1})
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
            </span>
          </div>

          {/* List of workers */}
          <div className="space-y-2.5">
            {(acceptedBids.length > 0
              ? acceptedBids
              : [
                  {
                    id: 'sample-1',
                    workerName: 'Ramesh Gowda',
                    workerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
                    workerRating: 4.8,
                    amount: 2000,
                  },
                ]
            ).map((workerItem, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={workerItem.workerAvatar}
                    alt={workerItem.workerName}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{workerItem.workerName}</h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {workerItem.workerRating}
                      </span>
                      <span>•</span>
                      <span>Assigned Crew</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Calling ${workerItem.workerName}...`)}
                    className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition"
                    title="Call Worker"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Opening chat with ${workerItem.workerName}...`)}
                    className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition"
                    title="Chat with Worker"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / OTP info */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
          <div className="flex justify-between items-center text-emerald-950 font-bold">
            <span>Work Verification Code (OTP):</span>
            <span className="text-base tracking-widest bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono text-emerald-800">
              4829
            </span>
          </div>
          <p className="text-[11px] text-emerald-700">
            Share this code with workers on-site only when work begins to activate safety insurance.
          </p>
        </div>

        {/* Action Button matching Screenshot 5 */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => setCustomerScreen('my-orders')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
          >
            <span>View Order Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCustomerScreen('home')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
