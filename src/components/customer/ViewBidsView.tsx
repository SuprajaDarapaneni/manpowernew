import React from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Users,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewBidsView: React.FC = () => {
  const {
    orders,
    selectedJobId,
    setSelectedJobId,
    bids,
    acceptBid,
    declineBid,
    setCustomerScreen,
    simulateIncomingBid,
  } = useApp();

  const selectedOrder = orders.find((o) => o.id === selectedJobId) || orders[0];
  const orderBids = bids.filter((b) => b.jobId === selectedOrder.id);
  const acceptedBids = orderBids.filter((b) => b.status === 'accepted');

  const handleAcceptAndConfirm = (bidId: string) => {
    acceptBid(bidId);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Screenshot 4 */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={() => setCustomerScreen('home')}
          className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-sm text-slate-900">Bids Received</h2>
        <button
          onClick={simulateIncomingBid}
          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1"
          title="Simulate extra incoming bid"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Bid</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Summary Card matching Screenshot 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                Order {selectedOrder.orderNumber}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{selectedOrder.category}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{selectedOrder.location}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Budget</span>
              <span className="text-xs font-extrabold text-emerald-700">
                ₹{selectedOrder.minBudget.toLocaleString()} - {selectedOrder.maxBudget.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Required: <strong className="text-slate-900">{selectedOrder.requiredWorkers} workers</strong>
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              {acceptedBids.length} of {selectedOrder.requiredWorkers} Hired
            </span>
          </div>
        </div>

        {/* Bids List Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Worker Proposals ({orderBids.length})
          </span>
          <span className="text-[11px] text-slate-400">Live lowest quotes</span>
        </div>

        {/* Bids Cards matching Screenshot 4 */}
        <div className="space-y-3">
          {orderBids.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-xs">Waiting for nearby workers...</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Click "Add Bid" above or switch to Employee App to submit a quote.
              </p>
            </div>
          ) : (
            orderBids.map((bid) => {
              const isAccepted = bid.status === 'accepted';
              const isDeclined = bid.status === 'declined';

              return (
                <div
                  key={bid.id}
                  className={`bg-white p-3.5 rounded-2xl border transition-all ${
                    isAccepted
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                      : isDeclined
                      ? 'opacity-50 border-slate-200'
                      : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Worker Info */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid.workerAvatar}
                        alt={bid.workerName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{bid.workerName}</h4>
                          <span className="flex items-center text-amber-500 text-[11px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                            {bid.workerRating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {bid.workerJobsCompleted} jobs • {bid.proposedTime || 'Available on time'}
                        </p>
                      </div>
                    </div>

                    {/* Bid Price & Action */}
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ₹{bid.amount.toLocaleString()}
                      </span>
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hired
                        </span>
                      ) : isDeclined ? (
                        <span className="text-[11px] text-slate-400 mt-1 block">Declined</span>
                      ) : (
                        <button
                          onClick={() => handleAcceptAndConfirm(bid.id)}
                          className="mt-1 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  </div>

                  {bid.notes && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 italic">
                      "{bid.notes}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* If any bids are accepted, show button to view confirmed order */}
        {acceptedBids.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setCustomerScreen('order-confirmation')}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
            >
              <span>View Confirmed Crew ({acceptedBids.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
