import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  Download,
  Users,
  Briefcase,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { stats, commission, orders } = useApp();

  return (
    <div className="space-y-6">
      {/* Header matching Screenshot 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketplace Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated business volume, commission yield, fulfilled assignments, and growth trends
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Exporting full analytics CSV ledger...')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 2 Stat Highlight Cards matching Screenshot 7 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Bids Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Cumulative Bids Processed
            </span>
            <span className="text-4xl font-extrabold text-slate-900 mt-1 block">
              {stats.totalBids}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +28% vs previous month
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart3 className="w-7 h-7" />
          </div>
        </div>

        {/* Monthly Order Volume matching Screenshot 7 (₹1,25,600) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Gross Monthly Order Volume
            </span>
            <span className="text-4xl font-extrabold text-emerald-700 mt-1 block">
              ₹1,25,600
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> ₹{stats.platformRevenue.toLocaleString()} Net Commission
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Monthly Orders Visual Graph matching Screen 7 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Monthly Orders & Manpower Fulfillment</h3>
            <p className="text-xs text-slate-500">Order creation vs complete worker deployment</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Last 6 Months
          </span>
        </div>

        {/* Visual Chart with SVG curves and points */}
        <div className="h-64 relative pt-6 flex items-end">
          <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <polygon
              fill="url(#areaGrad)"
              points="20,130 100,105 180,85 260,65 340,40 460,20 460,140 20,140"
            />

            {/* Polyline line */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="20,130 100,105 180,85 260,65 340,40 460,20"
            />

            {/* Data Points */}
            {[
              { x: 20, y: 130, val: '₹34k' },
              { x: 100, y: 105, val: '₹48k' },
              { x: 180, y: 85, val: '₹62k' },
              { x: 260, y: 65, val: '₹85k' },
              { x: 340, y: 40, val: '₹102k' },
              { x: 460, y: 20, val: '₹125.6k' },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
                  {p.val}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* X Axis labels */}
        <div className="flex justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          <span>April</span>
          <span>May</span>
          <span>June</span>
          <span>July</span>
          <span>August</span>
          <span className="text-emerald-700 font-bold">September (Current)</span>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm md:col-span-2">
          <h3 className="font-bold text-slate-900 text-base mb-4">Revenue Contribution by Category</h3>
          <div className="space-y-4">
            {[
              { name: 'Loading & Unloading', revenue: '₹54,200', pct: 43, color: 'bg-emerald-500' },
              { name: 'House Cleaning', revenue: '₹31,400', pct: 25, color: 'bg-teal-500' },
              { name: 'Packing & Moving', revenue: '₹22,600', pct: 18, color: 'bg-blue-500' },
              { name: 'Construction Support', revenue: '₹17,400', pct: 14, color: 'bg-amber-500' },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className="text-slate-500">{c.revenue} ({c.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3">Key Highlights</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>94.2% of posted manpower jobs receive bids within 15 minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Average rating across all completed jobs is 4.78 / 5.0.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero payment disputes reported in September.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mt-4">
            <span className="font-bold block">Commission Efficiency</span>
            <span>Platform fee collection operates at 100% automated settlement.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
