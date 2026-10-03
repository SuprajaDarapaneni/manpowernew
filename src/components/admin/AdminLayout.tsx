import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Sliders,
  Users,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { ServiceCategoriesView } from './ServiceCategoriesView';
import { OrdersBidsView } from './OrdersBidsView';
import { CommissionSetupView } from './CommissionSetupView';
import { WorkersManagementView } from './WorkersManagementView';
import { OrdersPaymentsView } from './OrdersPaymentsView';
import { ReportsView } from './ReportsView';
import { AdminTab } from '../../types';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, stats } = useApp();

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: '2. Service Categories', icon: Layers },
    { id: 'orders', label: '3. Orders / Bids Management', icon: Briefcase, badge: 'Live' },
    { id: 'commission', label: '4. Commission Setup', icon: Sliders },
    { id: 'workers', label: '5. Workers Management', icon: Users },
    { id: 'payments', label: '6. Orders / Payments', icon: CreditCard },
    { id: 'reports', label: '7. Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-100">
      {/* Admin Sidebar matching Screenshot 1-7 layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Panel Identifier */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Web Panel</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Platform Master Console & Workforce Control
          </p>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Platform Health & Summary Footer */}
        <div className="p-4 m-3 bg-slate-800/60 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Platform Status:</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-between text-[11px] text-slate-400">
            <span>Hub: Mangalore, KA</span>
            <span>v2.4 Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'categories' && <ServiceCategoriesView />}
          {adminTab === 'orders' && <OrdersBidsView />}
          {adminTab === 'commission' && <CommissionSetupView />}
          {adminTab === 'workers' && <WorkersManagementView />}
          {adminTab === 'payments' && <OrdersPaymentsView />}
          {adminTab === 'reports' && <ReportsView />}
        </div>
      </main>
    </div>
  );
};
