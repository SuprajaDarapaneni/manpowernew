import React from 'react';
import {
  Layers,
  Users,
  Briefcase,
  TrendingUp,
  IndianRupee,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { categories, workers, orders, bids, stats, setAdminTab, setSelectedJobId, setCustomerScreen } = useApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;
  const activeWorkersCount = workers.filter((w) => w.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Admin Session: Always Kept Signed In
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono">
              DB: manpowerlink_db
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time manpower supply, bidding activity, order fulfillment & platform commission
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAdminTab('orders')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => setAdminTab('categories')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Stat Cards matching Screenshot 1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Categories */}
        <div
          onClick={() => setAdminTab('categories')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{categories.length}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              {categories.filter((c) => c.active).length} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Managed services</p>
        </div>

        {/* Total Workers */}
        <div
          onClick={() => setAdminTab('workers')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-300 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Workers</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalWorkers}</span>
            <span className="text-xs text-teal-600 font-medium">
              {activeWorkersCount} Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified manpower pool</p>
        </div>

        {/* Active Orders */}
        <div
          onClick={() => setAdminTab('orders')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{activeOrdersCount}</span>
            <span className="text-xs text-blue-600 font-medium flex items-center">
              In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Demands across sectors</p>
        </div>

        {/* Total Bids */}
        <div
          onClick={() => setAdminTab('orders')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-300 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bids</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalBids + bids.length - 3}</span>
            <span className="text-xs text-amber-600 font-medium flex items-center">
              Active Auction
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Competitive pricing</p>
        </div>

        {/* Platform Revenue */}
        <div
          onClick={() => setAdminTab('payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 cursor-pointer transition col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">₹{stats.platformRevenue.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Platform fee retained</p>
        </div>
      </div>

      {/* Middle Section: Orders Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Orders Visualizer Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Manpower Demand & Order Volume</h3>
                <p className="text-xs text-slate-500 mt-0.5">Order postings vs Bids accepted across last 6 months</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg">
                FY 2025-26
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-56 w-full flex items-end justify-between pt-6 pb-2 px-2 gap-3">
              {[
                { month: 'Apr', orders: 38, bids: 120, height: '45%' },
                { month: 'May', orders: 46, bids: 145, height: '55%' },
                { month: 'Jun', orders: 52, bids: 170, height: '62%' },
                { month: 'Jul', orders: 68, bids: 210, height: '78%' },
                { month: 'Aug', orders: 84, bids: 265, height: '88%' },
                { month: 'Sep', orders: 95, bids: 310, height: '100%', active: true },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    {item.orders} jobs
                  </div>
                  <div className="w-full max-w-[40px] flex items-end gap-1.5 h-full">
                    {/* Bids Column */}
                    <div
                      style={{ height: item.height }}
                      className="w-1/2 bg-teal-200 group-hover:bg-teal-300 rounded-t-md transition-all"
                    ></div>
                    {/* Orders Column */}
                    <div
                      style={{ height: `calc(${item.height} * 0.7)` }}
                      className={`w-1/2 rounded-t-md transition-all ${
                        item.active ? 'bg-emerald-600' : 'bg-emerald-400 group-hover:bg-emerald-500'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${item.active ? 'font-bold text-emerald-700' : 'text-slate-500'}`}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
              <span>Confirmed Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-teal-200"></span>
              <span>Worker Bids Submitted</span>
            </div>
          </div>
        </div>

        {/* Top Demanded Categories */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Top Service Categories</h3>
              <button
                onClick={() => setAdminTab('categories')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View all
              </button>
            </div>
            <div className="space-y-3.5">
              {[
                { name: 'Loading & Unloading', count: '64 workers', pct: 85, color: 'bg-emerald-500' },
                { name: 'House Cleaning', count: '52 workers', pct: 70, color: 'bg-teal-500' },
                { name: 'Delivery Helper', count: '45 workers', pct: 60, color: 'bg-blue-500' },
                { name: 'Construction Support', count: '41 workers', pct: 54, color: 'bg-amber-500' },
                { name: 'Packing & Moving', count: '38 workers', pct: 48, color: 'bg-purple-500' },
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{cat.name}</span>
                    <span className="text-slate-500">{cat.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${cat.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-900 text-xs font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Highest Growth: Loading & Unloading</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              +38% surge in warehouse logistics demand this week in Mangalore.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Live Bidding Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Manpower Orders</h3>
              <p className="text-xs text-slate-500">Live order state & worker assignment pipeline</p>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              See all orders →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Workers Required</th>
                  <th className="py-3 px-4">Budget Range</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="py-3.5 px-4 font-medium">{order.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">{order.requiredWorkers}</span>
                      <span className="text-slate-400 text-[11px]"> ({order.assignedWorkerIds.length} assigned)</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">₹{order.minBudget} - ₹{order.maxBudget}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'bidding'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {order.status === 'bidding' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedJobId(order.id);
                          setAdminTab('orders');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                      >
                        Inspect Bids
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Worker Bids Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">Live Bids Stream</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Real-time quotes placed by registered workers</p>

            <div className="space-y-3">
              {bids.slice(0, 4).map((bid) => (
                <div
                  key={bid.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={bid.workerAvatar}
                      alt={bid.workerName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{bid.workerName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">★ {bid.workerRating} • {bid.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">₹{bid.amount.toLocaleString()}</span>
                    <span
                      className={`block text-[10px] font-semibold uppercase ${
                        bid.status === 'accepted' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Commission model active:</span>
            <button
              onClick={() => setAdminTab('commission')}
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              10% Percentage →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
