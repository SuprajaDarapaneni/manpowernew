import React from 'react';
import {
  CheckCircle,
  XCircle,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Users,
} from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';
import confetti from 'canvas-confetti';

export const BidsManagementView: React.FC = () => {
  const {
    orders,
    selectedJobId,
    setSelectedJobId,
    selectedOrder,
    orderBids,
    acceptBid,
    declineBid,
    commission,
    setCustomerScreen,
    addNotification,
  } = useCustomerApp();

  const handleAccept = (bidId: string, workerName: string, amount: number) => {
    acceptBid(bidId);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
    addNotification(
      'Worker Booked Successfully',
      `${workerName} booked for ₹${amount.toLocaleString()}. Ready for on-site dispatch.`,
      'success',
      'customer'
    );
  };

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      {/* Header & Order Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Worker Quotations & Bids</h2>
            <p className="text-slate-500 text-[11px]">Compare proposals and confirm your crew</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
            {orderBids.length} Active Quotes
          </span>
        </div>

        {/* Order Selector Tabs */}
        {orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orders.map((o) => {
              const isSelected = selectedJobId === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedJobId(o.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <span>{o.orderNumber}</span>
                  <span className="opacity-70 text-[10px] ml-1">({o.category})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Order Summary Card */}
      {selectedOrder && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-sm">
              {selectedOrder.orderNumber}: {selectedOrder.title}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                selectedOrder.status === 'assigned'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Crew Required</span>
              <strong className="text-slate-800">
                {selectedOrder.assignedWorkerIds?.length || 0} / {selectedOrder.requiredWorkers} Filled
              </strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Duration</span>
              <strong className="text-slate-800">{selectedOrder.durationHours} Hours</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Worksite</span>
              <strong className="text-slate-800 truncate block">{selectedOrder.location}</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Floor Rate</span>
              <strong className="text-emerald-700">₹{selectedOrder.pricePerHead}/head</strong>
            </div>
          </div>
        </div>
      )}

      {/* Bids List */}
      <div className="space-y-2.5">
        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
          Proposals Submitted by Nearby Partners
        </h3>

        {orderBids.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-xs">Waiting for incoming worker bids</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Your requirement is active. Nearby registered workers are notified and will place quotations.
            </p>
          </div>
        ) : (
          orderBids.map((bid) => {
            const isAccepted = bid.status === 'accepted';
            const isDeclined = bid.status === 'declined';

            return (
              <div
                key={bid.id}
                className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                  isAccepted
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : isDeclined
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white hover:border-slate-300 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={bid.workerAvatar}
                      alt={bid.workerName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <strong className="text-slate-900 text-xs font-bold">{bid.workerName}</strong>
                        <div className="flex items-center text-amber-500 text-[10px] font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                          <span>{bid.workerRating}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {bid.workerJobsCompleted} jobs &bull; Ready with equipment
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{bid.amount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">Total Shift Quote</span>
                  </div>
                </div>

                {bid.notes && (
                  <p className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                    &ldquo;{bid.notes}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>ETA: {bid.proposedTime}</span>
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {isAccepted ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Booked & Confirmed</span>
                      </span>
                    ) : isDeclined ? (
                      <span className="text-[11px] text-slate-400 font-medium">Declined</span>
                    ) : (
                      <>
                        <button
                          onClick={() => declineBid(bid.id)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition cursor-pointer"
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleAccept(bid.id, bid.workerName, bid.amount)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Book</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
