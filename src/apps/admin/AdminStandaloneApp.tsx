import React from 'react';
import { AppProvider } from '../../context/AppContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ExternalLink, ArrowLeft } from 'lucide-react';

export const AdminStandaloneApp: React.FC<{ onExitStandalone?: () => void }> = ({ onExitStandalone }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Standalone Brand Top Banner */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold tracking-wide">
            ManPowerLink Admin Console <span className="text-slate-400 font-normal">(Standalone Web Application)</span>
          </span>
        </div>
        {onExitStandalone && (
          <button
            onClick={onExitStandalone}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Hub</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <AdminLayout />
      </div>
    </div>
  );
};
