import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Star,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrdersBidsView: React.FC = () => {
  const {
    orders,
    selectedJobId,
    setSelectedJobId,
    bids,
    acceptBid,
    declineBid,
    commission,
  } = useApp();

  const selectedOrder = orders.find((o) => o.id === selectedJobId) || orders[0];
  const orderBids = bids.filter((b) => b.jobId === selectedOrder.id);
  const assignedBids = bids.filter((b) => b.jobId === selectedOrder.id && b.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Order {selectedOrder.orderNumber} — {selectedOrder.category}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedOrder.status === 'completed'
                  ? 'bg-yellow-100 text-yellow-950 border border-yellow-300'
                  : selectedOrder.status === 'assigned'
                  ? 'bg-blue-100 text-blue-800'
                  : selectedOrder.status === 'bidding'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {selectedOrder.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor real-time worker quotes, fulfill workforce quotas, and oversee rate confirmations
          </p>
        </div>

        {/* Order Selector Quick Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 uppercase">Select Order:</span>
          <select
            value={selectedOrder.id}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer focus:outline-none focus:border-red-500"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber}: {o.category} ({o.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Layout matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Details Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
              <p className="text-xs text-slate-500">Submitted by: {selectedOrder.customerName}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Service</span>
                  <span className="font-bold text-slate-900">{selectedOrder.category}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Location</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Date & Time</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {selectedOrder.scheduledDate} {selectedOrder.scheduledTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Working Hours</span>
                    <span className="font-semibold text-slate-800 text-xs">{selectedOrder.workingHours} Hours</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Employees Required</span>
                    <span className="font-extrabold text-slate-900 text-base">{selectedOrder.requiredWorkers}</span>
                    <span className="text-xs text-slate-500 block">
                      ({assignedBids.length} of {selectedOrder.requiredWorkers} filled)
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Budget Range</span>
                    <span className="font-extrabold text-red-600 text-base">
                      ₹{(selectedOrder.amountPerHead || selectedOrder.minBudget || 0).toLocaleString()}
                      {selectedOrder.maxBudget ? ` - ₹${selectedOrder.maxBudget.toLocaleString()}` : ' / worker'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">
                    Special Instructions
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                    {selectedOrder.specialInstructions}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Commission Projection for this job */}
            <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-semibold text-yellow-950">
                <span>Platform Commission Rate:</span>
                <span className="font-bold text-red-600">
                  {commission.type === 'percentage' ? `${commission.percentage}%` : `₹${commission.fixedAmount} Fixed`}
                </span>
              </div>
              <p className="text-[11px] text-yellow-800">
                Automatically deducted from worker in-app wallet upon confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Bids Received List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bids Received ({orderBids.length})</h2>
                <p className="text-xs text-slate-500">
                  Worker proposals submitted for Order {selectedOrder.orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
                <span className="font-semibold text-yellow-700">Live Bidding Active</span>
              </div>
            </div>

            {/* Bids List */}
            <div className="space-y-3.5 mt-5">
              {orderBids.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No Bids Placed Yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click "Receive Bid" at the top or switch to Employee App to place a quote!
                  </p>
                </div>
              ) : (
                orderBids.map((bid) => {
                  const isAccepted = bid.status === 'accepted';
                  const isDeclined = bid.status === 'declined';

                  return (
                    <div
                      key={bid.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        isAccepted
                          ? 'bg-yellow-50/80 border-yellow-300 ring-1 ring-yellow-200'
                          : isDeclined
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {/* Worker Profile Card */}
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={bid.workerAvatar}
                          alt={bid.workerName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{bid.workerName}</h4>
                            <span className="flex items-center text-amber-500 text-xs font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              {bid.workerRating}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              ({bid.workerJobsCompleted} jobs)
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {bid.proposedTime || 'Immediate Arrival'} • {bid.notes || 'Verified background'}
                          </p>
                        </div>
                      </div>

                      {/* Bid Amount & Action Buttons */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block">Bid Quote</span>
                          <span className="text-lg font-extrabold text-slate-900">
                            ₹{bid.amount.toLocaleString()}
                          </span>
                        </div>

                        {isAccepted ? (
                          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-950 border border-yellow-300 rounded-xl text-xs font-bold shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-red-600" />
                            <span>Accepted</span>
                          </div>
                        ) : isDeclined ? (
                          <span className="text-xs font-semibold text-slate-400 px-3 py-1.5">
                            Declined
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => declineBid(bid.id)}
                              className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => acceptBid(bid.id)}
                              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quota Progress */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>
                Workforce Quota: <strong className="text-slate-900">{assignedBids.length}</strong> / {selectedOrder.requiredWorkers} workers confirmed
              </span>
              <span className="text-red-600 font-bold">
                {assignedBids.length >= selectedOrder.requiredWorkers
                  ? 'All Spots Filled ✓'
                  : `${selectedOrder.requiredWorkers - assignedBids.length} spots remaining`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
