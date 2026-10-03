import React, { useState } from 'react';
import {
  Users,
  LayoutDashboard,
  Smartphone,
  HardHat,
  Columns,
  Bell,
  RefreshCw,
  Zap,
  CheckCircle,
  X,
  ExternalLink,
  Code2,
  Server,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderNavbarProps {
  onOpenCodeViewer?: () => void;
  onOpenBackendStatus?: () => void;
  onLaunchStandalone?: (app: 'admin' | 'customer' | 'employee') => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenCodeViewer,
  onOpenBackendStatus,
  onLaunchStandalone,
}) => {
  const {
    currentRole,
    setCurrentRole,
    workers,
    activeWorkerId,
    setActiveWorkerId,
    simulateIncomingBid,
    resetDemoData,
    notifications,
    dismissNotification,
    backendConnected,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const activeWorker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  ManPower<span className="text-emerald-600">Link</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                  Marketplace
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Connect • Hire • Get Work Done
              </p>
            </div>
          </div>

          {/* App / Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setCurrentRole('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Admin Web Panel</span>
            </button>

            <button
              onClick={() => setCurrentRole('customer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => setCurrentRole('employee')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'employee'
                  ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <HardHat className="w-4 h-4 text-amber-600" />
              <span>Employee App</span>
            </button>

            <button
              onClick={() => setCurrentRole('split')}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'split'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Compare all flows side-by-side in real-time"
            >
              <Columns className="w-4 h-4" />
              <span>Live Split View</span>
            </button>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* If in Employee mode, show profile switcher */}
            {currentRole === 'employee' && (
              <div className="hidden sm:flex items-center space-x-1.5 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg text-xs text-amber-900">
                <span className="text-[11px] text-amber-700">Worker:</span>
                <select
                  value={activeWorkerId}
                  onChange={(e) => setActiveWorkerId(e.target.value)}
                  className="bg-transparent font-semibold cursor-pointer outline-none text-xs"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Backend API Status & Inspector button */}
            {onOpenBackendStatus && (
              <button
                onClick={onOpenBackendStatus}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs transition"
                title="View Express REST API endpoints & execute live tests"
              >
                <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Backend API</span>
              </button>
            )}

            {/* Separate App Code button */}
            {onOpenCodeViewer && (
              <button
                onClick={onOpenCodeViewer}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                title="View and export isolated codebases for Admin, Customer & Employee apps"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Separate App Code</span>
              </button>
            )}

            {/* Quick simulate bid button */}
            <button
              onClick={simulateIncomingBid}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition"
              title="Simulate a new bid from a nearby worker"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span className="hidden sm:inline">Simulate Bid</span>
            </button>

            {/* Reset Demo button */}
            <button
              onClick={resetDemoData}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Reset Demo State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
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
                              {notif.type === 'bid' && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                              {notif.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
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
  );
};
