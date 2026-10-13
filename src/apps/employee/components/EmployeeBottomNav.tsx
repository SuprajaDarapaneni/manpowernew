import React from 'react';
import { LayoutDashboard, Briefcase, FileCheck, Wallet, User } from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';
import { EmployeeScreen } from '../../../types';

export const EmployeeBottomNav: React.FC = () => {
  const { employeeScreen, setEmployeeScreen, orders, myBids } = useEmployeeApp();

  const tabs: { id: EmployeeScreen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'available', label: 'Available Jobs', icon: Briefcase, badge: orders.length },
    { id: 'bids', label: 'My Bids', icon: FileCheck, badge: myBids.filter((b) => b.status === 'pending').length },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-2 py-1.5 shrink-0 flex items-center justify-around z-30 shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = employeeScreen === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setEmployeeScreen(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative cursor-pointer ${
              isActive
                ? 'text-yellow-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black leading-tight ring-1 ring-white">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
