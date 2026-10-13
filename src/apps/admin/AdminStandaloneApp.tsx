import React from 'react';
import { AdminLayout } from './AdminLayout';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AdminStandaloneApp: React.FC<{ onExitStandalone?: () => void }> = ({ onExitStandalone }) => {
  const { customization } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Standalone Brand Top Banner */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <BrandLogo
            type={customization.logoType}
            icon={customization.logoIcon}
            imageUrl={customization.logoImageUrl}
            shape={customization.logoShape}
            gradient={customization.logoGradient}
            size="xs"
          />
          <span className="font-bold tracking-wide">
            {customization.appName} {customization.adminPanelTitle} <span className="text-slate-400 font-normal">(Standalone Web Application)</span>
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
