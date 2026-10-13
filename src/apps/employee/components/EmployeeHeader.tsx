import React from 'react';
import { Power, Wallet, LogOut, ShieldCheck } from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';
import { BrandLogo } from '../../../components/common/BrandLogo';

export const EmployeeHeader: React.FC = () => {
  const { currentWorker, toggleAvailability, signOut, customization } = useEmployeeApp();

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                currentWorker.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                {currentWorker.name}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold">
                Partner
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
              {currentWorker.category}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Availability Toggle Button */}
          <button
            onClick={toggleAvailability}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              currentWorker.isAvailable
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/80'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Toggle your availability to receive job bookings"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="text-[11px]">{currentWorker.isAvailable ? 'Online' : 'Offline'}</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Sign Out from Worker App"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
