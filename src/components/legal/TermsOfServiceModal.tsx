import React from 'react';
import {
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  ShieldAlert,
  Clock,
  IndianRupee,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsOfServiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Terms of Service</h2>
              <p className="text-[11px] text-slate-300">
                ManPowerLink On-Demand Workforce Marketplace Agreement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Introduction */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              1. Marketplace Platform Structure
            </h3>
            <p>
              ManPowerLink provides a technology platform connecting businesses, enterprises, and individual employers ("Customers") with verified independent workers and daily laborers ("Workers"). ManPowerLink facilitates communication, quoting, check-in verification via OTP, and settlement tracking. Workers act as independent partners.
            </p>
          </div>

          {/* Section 2: Shift Verification with Start/End OTP */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              2. Attendance Verification & Two-Way OTP Protocol
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Start Work OTP:</strong> When a worker arrives on site, the employer must verify the worker's presence and provide the 4-digit Start OTP. Work time starts only upon successful OTP submission.
              </li>
              <li>
                <strong>End Work OTP:</strong> At shift conclusion, the employer provides the End OTP. Entering this code certifies completion of required shift hours.
              </li>
              <li>
                <strong>Overtime (OT) Policy:</strong> Any work performed beyond scheduled hours is billed at the pre-agreed overtime hourly rate (1.5x standard hourly base rate).
              </li>
            </ul>
          </div>

          {/* Section 3: Payments & Wage Security */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              3. Wage Transparency & Payment Settlement
            </h3>
            <p className="mb-2">
              All bookings adhere to the Admin Minimum Price (Floor rate per head) established for each service category to guarantee fair wages.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Cash on Site:</strong> If cash payment is chosen, employer must pay worker directly upon End OTP entry, and worker confirms receipt in-app.
              </li>
              <li>
                <strong>Digital Wallet:</strong> Online wallet balances are credited immediately upon completed shift sign-off and can be withdrawn to bank accounts.
              </li>
              <li>
                <strong>Platform Commission:</strong> Transparent platform fee (10% standard, customizable by admin) is deducted to maintain platform operations, customer support, and worker insurance.
              </li>
            </ul>
          </div>

          {/* Section 4: Safety & Prohibited Activities */}
          <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-xl space-y-1.5 text-amber-950">
            <h3 className="font-bold text-xs flex items-center gap-1 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              4. Worksite Safety & Prohibited Activities
            </h3>
            <p className="text-[11px] leading-relaxed">
              Employers must maintain a safe work environment and provide standard safety equipment for hazardous tasks. Workers reserve the right to decline tasks that violate safety regulations or involve illegal materials. Violence, harassment, and discrimination of any kind result in immediate account termination.
            </p>
          </div>

          {/* Section 5: Cancellations & No-Shows */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">
              5. Cancellation & No-Show Rules
            </h3>
            <p>
              Cancellations made within 30 minutes of shift start or after worker dispatch may incur a cancellation compensation fee paid to the worker. Repeated worker no-shows lead to account suspension.
            </p>
          </div>

          {/* Section 6: Contact & Jurisdiction */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-700">Governing Law & Legal Disputes:</p>
            <p>These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Mangalore, Karnataka.</p>
            <p className="mt-1">For support inquiries, contact: <strong className="text-slate-800">support@manpowerlink.com</strong></p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {onOpenPrivacy && (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="text-emerald-700 hover:underline text-xs font-bold"
            >
              View Privacy Policy
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};
