import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  KeyRound,
  CreditCard,
  Star,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';

export const CustomerOrdersView: React.FC = () => {
  const { orders, workers, settlePayment, submitCustomerRating, addNotification } = useCustomerApp();
  const [ratingModalOrderId, setRatingModalOrderId] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState('Punctual, heavy lifting handled carefully, reliable crew.');

  const handleSettle = (orderId: string, method: 'cash' | 'online' | 'wallet') => {
    settlePayment(orderId, method, true);
    addNotification('Payment Settled', `Payment of Order completed via ${method.toUpperCase()}. Escrow released.`, 'success', 'customer');
  };

  const handleRatingSubmit = (orderId: string) => {
    submitCustomerRating(orderId, {
      stars,
      quality: stars,
      workQuality: stars,
      punctuality: stars,
      behaviour: stars,
      behavior: stars,
      comment: feedback,
      submittedAt: new Date().toISOString(),
    });
    setRatingModalOrderId(null);
    addNotification('Rating Submitted', `Thank you for rating your worker partner!`, 'success', 'customer');
  };

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">My Bookings & Orders</h2>
          <p className="text-slate-500 text-[11px]">Track on-site workers & verify attendance OTPs</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px]">
          {orders.length} Total
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const assignedWorkers = workers.filter((w) => order.assignedWorkerIds?.includes(w.id));

          return (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                      {order.orderNumber}
                    </span>
                    <strong className="text-slate-900 font-bold text-xs">{order.title}</strong>
                  </div>
                  <div className="flex items-center text-[11px] text-slate-500 space-x-2 mt-1">
                    <span>{order.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5" />
                      {order.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'assigned'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Attendance Verification OTPs Box */}
              <div className="p-3 bg-amber-50/80 border border-yellow-300/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-yellow-950 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-yellow-600" />
                    <span>Worker Attendance Verification OTPs</span>
                  </span>
                  <span className="text-[10px] text-yellow-800">Share with worker on-site</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="bg-white p-2 rounded-lg border border-yellow-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Start Shift OTP</span>
                    <strong className="font-mono text-sm text-yellow-900 font-extrabold tracking-wider">
                      {order.startOtp || '1234'}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-yellow-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">End Shift OTP</span>
                    <strong className="font-mono text-sm text-emerald-800 font-extrabold tracking-wider">
                      {order.endOtp || '5678'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Assigned Workers Crew */}
              {assignedWorkers.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Confirmed Crew ({assignedWorkers.length} / {order.requiredWorkers})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {assignedWorkers.map((w) => (
                      <div
                        key={w.id}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={w.avatar}
                            alt={w.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs truncate">
                              {w.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{w.phone}</span>
                          </div>
                        </div>
                        <span className="text-emerald-700 font-bold text-[11px]">₹{w.hourlyRate}/hr</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-900 text-xs">
                  Agreed Total: ₹{(order.totalAgreedAmount || ((order.pricePerHead ?? order.amountPerHead ?? order.minPricePerHead ?? 0) * order.requiredWorkers)).toLocaleString()}
                </span>

                <div className="flex items-center space-x-1.5">
                  {order.status !== 'completed' ? (
                    <button
                      onClick={() => handleSettle(order.id, 'wallet')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                    >
                      Complete &amp; Pay
                    </button>
                  ) : (
                    <button
                      onClick={() => setRatingModalOrderId(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Rate Worker</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating Modal */}
      {ratingModalOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Rate Your Worker Partner</h3>
            <div className="flex justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStars(star)}
                  className="p-1 text-amber-500"
                >
                  <Star
                    className={`w-6 h-6 ${star <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Leave feedback on punctuality, quality, teamwork..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRatingModalOrderId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRatingSubmit(ratingModalOrderId)}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
