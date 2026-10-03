import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrdersPaymentsView: React.FC = () => {
  const { orders, setSelectedJobId, setAdminTab, stats } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCalculatedRevenue = orders.reduce((sum, o) => sum + (o.commissionDeducted || 0), 0);
  const totalVolume = orders.reduce((sum, o) => sum + (o.totalAgreedAmount || o.minBudget), 0);

  return (
    <div className="space-y-6">
      {/* Header matching Screenshot 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders & Payments Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track transactions, platform commission retention, escrow hold and worker compensation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
            <span className="text-emerald-800 font-semibold block">Total Commission Collected:</span>
            <span className="text-lg font-extrabold text-emerald-700">
              ₹{(stats.platformRevenue + totalCalculatedRevenue).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="bidding">Bidding In Progress</option>
            <option value="assigned">Workers Assigned</option>
            <option value="completed">Completed</option>
            <option value="open">Open</option>
          </select>
        </div>
      </div>

      {/* Orders / Payments Table matching Screenshot 6 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Category / Service</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Assigned Workers</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Platform Commission</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((order) => {
                const totalAmount = order.totalAgreedAmount || order.minBudget;
                const commissionVal = order.commissionDeducted || Math.round(totalAmount * 0.1);

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{order.category}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-slate-400">{order.location}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{order.assignedWorkerIds.length}</span>
                      <span className="text-slate-400"> / {order.requiredWorkers} workers</span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      +₹{commissionVal.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'bidding'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status === 'bidding' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedJobId(order.id);
                          setAdminTab('orders');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold rounded-lg text-xs transition"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
