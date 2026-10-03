import React from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  roleBadge?: {
    label: string;
    color: string;
  };
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, title, roleBadge }) => {
  const { usePhoneFrame, setUsePhoneFrame } = useApp();

  if (!usePhoneFrame) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[750px] flex flex-col">
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">{title || 'App Preview'}</span>
            {roleBadge && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            )}
          </div>
          <button
            onClick={() => setUsePhoneFrame(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition"
            title="Switch to Mobile Frame view"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Mobile Device View</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Device wrapper */}
      <div className="relative w-[385px] h-[812px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800/80 shadow-slate-900/40 flex flex-col border-[3px] border-slate-700/60">
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-800/80 ml-auto mr-3 border border-slate-700/40"></div>
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative">
          {/* iOS / Mobile Status Bar */}
          <div className="h-10 pt-2 px-6 bg-white/90 backdrop-blur-md flex items-center justify-between text-[12px] font-semibold text-slate-800 select-none z-40 border-b border-slate-100/50">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-5 bg-white/90 backdrop-blur-md flex items-center justify-center select-none z-40">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Frame Controls beneath phone */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => setUsePhoneFrame(false)}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm transition"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Expand to Full Width Screen</span>
        </button>
      </div>
    </div>
  );
};
