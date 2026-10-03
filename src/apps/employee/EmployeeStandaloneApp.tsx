import React from 'react';
import { EmployeeApp } from '../../components/employee/EmployeeApp';
import { ArrowLeft, HardHat } from 'lucide-react';

export const EmployeeStandaloneApp: React.FC<{ onExitStandalone?: () => void }> = ({ onExitStandalone }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Standalone Brand Top Banner */}
      <div className="bg-slate-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <HardHat className="w-4 h-4 text-amber-400" />
          <span className="font-bold tracking-wide">
            ManPowerLink Employee / Worker App <span className="text-slate-400 font-normal">(Standalone Worker Portal)</span>
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

      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-800/50">
        <EmployeeApp />
      </div>
    </div>
  );
};
