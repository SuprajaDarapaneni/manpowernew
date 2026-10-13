import React from 'react';
import { MapPin, Bell, User, LogOut } from 'lucide-react';
import { useCustomerApp } from '../hooks/useCustomerApp';
import { BrandLogo } from '../../../components/common/BrandLogo';

export const CustomerHeader: React.FC = () => {
  const { customerAuth, customization, signOut } = useCustomerApp();

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between">
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
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                {customization.appName}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                Employer
              </span>
            </div>
            <div className="flex items-center text-[11px] text-slate-500 space-x-1">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate max-w-[140px] font-medium">
                {customerAuth?.location || 'Mangalore, Karnataka'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">
              {customerAuth?.businessName || customerAuth?.name || 'Enterprise'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Verified Client</span>
          </div>

          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Sign Out from Customer App"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
