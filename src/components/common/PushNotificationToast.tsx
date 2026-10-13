import React, { useEffect, useState } from 'react';
import {
  Bell,
  X,
  Zap,
  CheckCircle2,
  IndianRupee,
  Briefcase,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { PushToast } from '../../shared/types';
import { isNotificationSoundEnabled, setNotificationSoundEnabled } from '../../utils/audioNotification';

interface Props {
  toasts: PushToast[];
  onDismiss: (id: string) => void;
  onToastClick?: (toast: PushToast) => void;
}

export const PushNotificationToast: React.FC<Props> = ({
  toasts,
  onDismiss,
  onToastClick,
}) => {
  const [soundOn, setSoundOn] = useState(isNotificationSoundEnabled());

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundOn;
    setSoundOn(next);
    setNotificationSoundEnabled(next);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none select-none max-w-md mx-auto">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            onClick={() => onToastClick && onToastClick(toast)}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-slate-700/80 cursor-pointer hover:bg-slate-900 transition-all transform animate-in slide-in-from-top-4 duration-200 hover:scale-[1.01]"
          >
            {/* Top Meta Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-[9px] font-extrabold text-white">
                  MP
                </div>
                <span className="font-bold text-slate-200">ManPower<span className="text-red-500">Link</span></span>
                <span>•</span>
                <span className="text-[10px]">{toast.timestamp}</span>

                {toast.targetRole && toast.targetRole !== 'all' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      toast.targetRole === 'customer'
                        ? 'bg-red-950 text-red-300 border border-red-700/60'
                        : 'bg-yellow-950 text-yellow-300 border border-yellow-700/60'
                    }`}
                  >
                    {toast.targetRole === 'customer' ? 'Customer App' : 'Worker App'}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title={soundOn ? 'Sound On' : 'Sound Muted'}
                >
                  {soundOn ? <Volume2 className="w-3 h-3 text-yellow-400" /> : <VolumeX className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(toast.id);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Content */}
            <div className="flex items-start space-x-2.5">
              {/* Type Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  toast.type === 'payment'
                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-500/40'
                    : toast.type === 'job_accepted'
                    ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                    : toast.type === 'bid'
                    ? 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/40'
                    : 'bg-red-700/30 text-yellow-300 border border-red-600/40'
                }`}
              >
                {toast.type === 'payment' && <IndianRupee className="w-4 h-4 text-yellow-400" />}
                {toast.type === 'job_accepted' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                {toast.type === 'bid' && <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                {toast.type === 'order' && <Briefcase className="w-4 h-4 text-yellow-400" />}
                {toast.type === 'otp' && <Sparkles className="w-4 h-4 text-yellow-400" />}
                {toast.type === 'general' && <Bell className="w-4 h-4 text-yellow-400" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-white tracking-tight truncate">
                    {toast.title}
                  </h4>
                  {toast.amount && (
                    <span className="font-mono font-extrabold text-yellow-400 text-xs shrink-0 ml-1">
                      ₹{toast.amount.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionLabel && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-yellow-400 hover:text-yellow-300">
                    <span>{toast.actionLabel}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Countdown Auto-Dismiss Progress Bar */}
            <div className="mt-2 w-full bg-slate-800 h-0.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-yellow-400 h-full w-full animate-[progress_4.5s_linear_forwards] origin-left" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
