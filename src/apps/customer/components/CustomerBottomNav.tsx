import React from 'react';
import { Home, PlusCircle, MessageSquare, ClipboardList, User } from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';
import { CustomerScreen } from '../../../types';

export const CustomerBottomNav: React.FC = () => {
  const { customerScreen, setCustomerScreen, orderBids, orders } = useCustomerApp();

  const openOrdersCount = orders.filter((o) => o.status === 'open' || o.status === 'bidding').length;

  const tabs: { id: CustomerScreen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'post-job', label: 'Post Job', icon: PlusCircle },
    { id: 'bids', label: 'Quotations', icon: MessageSquare, badge: orderBids.length },
    { id: 'orders', label: 'My Bookings', icon: ClipboardList, badge: openOrdersCount },
    { id: 'profile', label: 'Company', icon: User },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-2 py-1.5 shrink-0 flex items-center justify-around z-30 shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = customerScreen === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCustomerScreen(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative cursor-pointer ${
              isActive
                ? 'text-red-600 font-bold'
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
