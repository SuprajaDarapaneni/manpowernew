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
  LogOut,
  Palette,
} from 'lucide-react';
import { useAdminApp } from './hooks/useAdminApp';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './components/AdminDashboard';
import { ServiceCategoriesView } from './components/ServiceCategoriesView';
import { OrdersBidsView } from './components/OrdersBidsView';
import { CommissionSetupView } from './components/CommissionSetupView';
import { WorkersManagementView } from './components/WorkersManagementView';
import { OrdersPaymentsView } from './components/OrdersPaymentsView';
import { ReportsView } from './components/ReportsView';
import { AppCustomizationView } from './components/AppCustomizationView';
import { BrandLogo } from '../../shared/components/BrandLogo';
import { AdminLoginView } from './auth/AdminLoginView';
import { AdminTab } from '../../shared/types';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, adminAuth, signOut } = useAdminApp();
  const { customization } = useApp();

  // If not signed in, show Admin Login view
  if (!adminAuth) {
    return <AdminLoginView />;
  }

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: '2. Service Categories', icon: Layers },
    { id: 'orders', label: '3. Orders / Bids Management', icon: Briefcase, badge: 'Live' },
    { id: 'commission', label: '4. Commission Setup', icon: Sliders },
    { id: 'workers', label: '5. Workers Management', icon: Users },
    { id: 'payments', label: '6. Orders / Payments', icon: CreditCard },
    { id: 'reports', label: '7. Reports & Analytics', icon: BarChart3 },
    { id: 'customization', label: '8. App & Panel Customization', icon: Palette, badge: 'Brand' },
  ];

  const sidebarThemeClass =
    customization.adminSidebarTheme === 'zinc-950'
      ? 'bg-zinc-950'
      : customization.adminSidebarTheme === 'red-950'
      ? 'bg-red-950'
      : customization.adminSidebarTheme === 'charcoal-dark'
      ? 'bg-stone-900'
      : 'bg-slate-900';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-100">
      {/* Admin Sidebar matching layout */}
      <aside className={`w-full md:w-64 ${sidebarThemeClass} text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-colors`}>
        {/* Panel Identifier */}
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <BrandLogo
              type={customization.logoType}
              icon={customization.logoIcon}
              imageUrl={customization.logoImageUrl}
              shape={customization.logoShape}
              gradient={customization.logoGradient}
              size="sm"
            />
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400">
                <span>{customization.adminPanelTitle}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {customization.appName} Master Console
              </p>
            </div>
          </div>
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                      isActive ? 'bg-yellow-400 text-slate-950' : 'bg-yellow-950/80 text-yellow-300 border border-yellow-700/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logged in Admin Profile & Sign Out */}
        <div className="p-3 mx-3 mb-2 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                {adminAuth?.name.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-xs truncate">{adminAuth?.name}</div>
                <div className="text-[10px] text-yellow-400 font-semibold">Superuser &bull; Active</div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition cursor-pointer"
              title="Sign Out from Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
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
          {adminTab === 'customization' && <AppCustomizationView />}
        </div>
      </main>
    </div>
  );
};

export const AdminApp = AdminLayout;
