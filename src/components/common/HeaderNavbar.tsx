import React, { useState } from 'react';
import {
  LayoutDashboard,
  Smartphone,
  HardHat,
  Columns,
  Bell,
  RefreshCw,
  Zap,
  CheckCircle,
  X,
  Code2,
  Server,
  Megaphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface Props {
  onOpenCodeViewer?: () => void;
  onOpenBackendStatus?: () => void;
}

export const HeaderNavbar: React.FC<Props> = ({
  onOpenCodeViewer,
  onOpenBackendStatus,
}) => {
  const {
    currentRole,
    setCurrentRole,
    workers,
    simulateIncomingBid,
    resetDemoData,
    notifications,
    dismissNotification,
    backendConnected,
    adminAuth,
    customerAuth,
    employeeAuth,
    signOut,
    setShowPushSimulator,
    customization,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      {/* Optional Broadcast Announcement Banner */}
      {customization.showAnnouncementBanner && (
        <div
          className={`px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 border-b transition-all ${
            customization.announcementType === 'urgent'
              ? 'bg-red-600 text-white border-red-700'
              : customization.announcementType === 'offer'
              ? 'bg-yellow-400 text-slate-950 border-yellow-500'
              : customization.announcementType === 'advisory'
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{customization.announcementText}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Slogan */}
            <div className="flex items-center space-x-3">
              <BrandLogo
                type={customization.logoType}
                icon={customization.logoIcon}
                imageUrl={customization.logoImageUrl}
                shape={customization.logoShape}
                gradient={customization.logoGradient}
                size="md"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    {customization.appName}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-black tracking-wider bg-emerald-600 text-white rounded-full shadow-2xs">
                    Admin Console
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                  {customization.tagline}
                </p>
              </div>
            </div>

            {/* Primary App Switcher (Admin, Customer, Worker, Split View) */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setCurrentRole('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Admin Web Management Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Console</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('customer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'customer'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Customer / Employer Mobile App Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer App</span>
                <span className="sm:hidden">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('employee')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'employee'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Worker / Employee Mobile App Preview"
              >
                <HardHat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Worker App</span>
                <span className="sm:hidden">Worker</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'split'
                    ? 'bg-slate-900 text-yellow-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Live Multi-App Split Ecosystem Simulator"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split View</span>
                <span className="md:hidden">Split</span>
                <span className="hidden lg:inline text-[9px] bg-yellow-400/20 text-yellow-800 px-1.5 py-0.5 rounded font-black">
                  Live
                </span>
              </button>
            </nav>

            {/* Architecture Code & Backend Health Quick Links */}
            <div className="hidden xl:flex items-center space-x-1.5">
              <button
                type="button"
                onClick={onOpenCodeViewer}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition cursor-pointer"
                title="Inspect 3 Separated Apps Architecture & Code"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Apps Code</span>
              </button>

              <button
                type="button"
                onClick={onOpenBackendStatus}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-bold transition cursor-pointer"
                title="Check Live MongoDB Atlas & API Health"
              >
                <Server className="w-3.5 h-3.5 text-blue-600" />
                <span>MongoDB Health</span>
              </button>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Quick worker bid trigger */}
              <button
                onClick={simulateIncomingBid}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 border border-amber-500 text-slate-950 text-xs font-bold transition shadow-2xs"
                title="Simulate incoming worker bid on Order #1045"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span className="hidden sm:inline">Simulate Bid</span>
              </button>

              {/* Push Notification Simulator Button */}
              <button
                onClick={() => setShowPushSimulator(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                title="Test push notification alerts (new bids, accepted jobs, payouts)"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Push Alerts</span>
              </button>

              {/* Reset Demo button */}
              <button
                onClick={resetDemoData}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Reset Demo State"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Signed In Admin User Status Badge */}
              <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-slate-200">
                {adminAuth ? (
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">
                      {adminAuth.name}
                    </span>
                    <button
                      onClick={() => signOut('admin')}
                      className="text-slate-400 hover:text-rose-600 transition ml-1"
                      title="Sign Out"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Admin Active</span>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="View Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-slate-800">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        Live Platform Activity ({notifications.length})
                      </span>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-xs relative group transition"
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                {notif.type === 'bid' && <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                                {notif.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                                {notif.title}
                              </span>
                              <button
                                onClick={() => dismissNotification(notif.id)}
                                className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-slate-600 mt-1">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                              {notif.timestamp}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
