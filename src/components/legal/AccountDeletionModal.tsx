import React, { useState } from 'react';
import {
  Trash2,
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDeletionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentRole, customerAuth, employeeAuth, signOut } = useApp();

  const currentUser = currentRole === 'customer' ? customerAuth : employeeAuth;
  const initialIdentifier = currentUser?.emailOrPhone || '';

  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [reason, setReason] = useState('No longer need the service');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your registered mobile number or email.');
      return;
    }
    if (!confirmed) {
      setError('Please check the confirmation box to authorize account erasure.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: identifier.trim(),
          reason,
          confirmation: true,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setIsSuccess(true);
        // Automatically sign out after a short delay
        setTimeout(() => {
          if (currentUser) {
            signOut(currentRole as any);
          }
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit account deletion request.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError('Network error submitting request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">Account & Data Deletion</h2>
              <p className="text-[11px] text-rose-100">Google Play Store User Data Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Account Deleted Successfully</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Your account records, mobile credentials, and personal history have been purged from MongoDB Atlas. You will now be redirected to the sign-in screen.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Warning Box */}
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2.5 text-rose-950">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Permanent Action:</strong> Deleting your account will immediately remove your profile, registered trades/business records, phone verification, and past shift ratings. This action cannot be reversed.
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Registered Mobile Number or Email *
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="+91 mobile number or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Reason for Leaving (Optional)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500"
              >
                <option value="No longer need the service">No longer need the service</option>
                <option value="Moving to another location">Moving to another location</option>
                <option value="Privacy concerns">Privacy concerns</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="confirmDelete"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer mt-0.5"
              />
              <label htmlFor="confirmDelete" className="text-[11px] text-slate-600 cursor-pointer select-none">
                I understand that this action is permanent and completely deletes all my stored profile records and marketplace history.
              </label>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !confirmed}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm & Delete'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
