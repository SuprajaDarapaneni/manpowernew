import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyOrdersView: React.FC = () => {
  const { orders, setSelectedJobId, setCustomerScreen, bids } = useApp();
  const [tab, setTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const filteredOrders = orders.filter((o) => {
    if (tab === 'active') return o.status !== 'completed' && o.status !== 'cancelled';
    if (tab === 'completed') return o.status === 'completed';
    return o.status === 'cancelled';
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 pb-20">
      {/* Header matching Screenshot 6 */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-slate-200/80 sticky top-0 z-20">
        <h2 className="font-bold text-base text-slate-900">My Orders</h2>
        <p className="text-[11px] text-slate-400">Track and review temporary manpower bookings</p>

        {/* Status Tabs matching Screenshot 6 */}
        <div className="flex items-center space-x-2 mt-3 bg-slate-100 p-1 rounded-xl">
          {(['active', 'completed', 'cancelled'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                tab === t
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No {tab} orders</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {tab === 'active' ? 'You have no live manpower requests running.' : 'No orders in this history archive.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderBidsCount = bids.filter((b) => b.jobId === order.id).length;

            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedJobId(order.id);
                  if (order.status === 'bidding' || order.status === 'open') {
                    setCustomerScreen('view-bids');
                  } else {
                    setCustomerScreen('order-confirmation');
                  }
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 cursor-pointer transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                      {order.orderNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{order.category}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{order.location}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'bidding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {order.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-slate-400" />
                      {order.requiredWorkers} Workers
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-xs">
                      ₹{order.totalAgreedAmount || order.minBudget}
                    </span>
                  </div>
                </div>

                {order.status === 'bidding' && (
                  <div className="bg-amber-50 p-2 rounded-xl flex items-center justify-between text-amber-900 text-[11px]">
                    <span className="font-semibold">⚡ {orderBidsCount} bids received</span>
                    <span className="font-bold text-amber-700 flex items-center">
                      Review Quotes <ChevronRight className="w-3 h-3" />
                    </span>
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
