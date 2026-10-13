import React from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  MapPin,
  UserCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenDataDeletion?: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPolicyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenDataDeletion,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Privacy Policy</h2>
              <p className="text-[11px] text-emerald-200">
                Google Play Store Compliant • Updated for 2025/2026 Policy Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Overview */}
          <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Play Store Data Safety Assurance:</strong> ManPowerLink ("we", "our", or "the Platform") respects your privacy. We do <strong>not</strong> sell your personal data, track you across third-party websites, or use your data for advertising. All personal information collected is strictly necessary to fulfill temporary manpower bookings and verify workforce assignments.
            </div>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              1. Information We Collect
            </h3>
            <p className="mb-2">We collect only the minimum information required to operate the on-demand manpower marketplace:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Account & Profile Information:</strong> Full name, verified mobile phone number, email address (optional for workers), password (securely hashed), business trade or employer entity name.
              </li>
              <li>
                <strong>Geolocation Data:</strong> With your explicit runtime permission, approximate or precise worksite location is used exclusively to show available nearby tasks and calculate on-site transit. Location is <em>never</em> shared with third parties or tracked continuously in the background.
              </li>
              <li>
                <strong>Work & Verification Credentials:</strong> Aadhaar verification badge status, declared skill categories (e.g. Loading, Electrical, Cleaning), hourly expected wage rate, and verified job history ratings.
              </li>
              <li>
                <strong>Transaction & Work Records:</strong> Start work OTP and End work OTP check-in records, recorded overtime hours, cash confirmation status, and in-app wallet balance ledgers.
              </li>
            </ul>
          </div>

          {/* Section 2: Google Play Data Safety Table */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              2. Google Play Data Safety Declarations
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Data Type</th>
                    <th className="py-2 px-3">Collected / Shared</th>
                    <th className="py-2 px-3">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Location (Approx & Precise)</td>
                    <td className="py-2 px-3">Collected with permission; Not shared with 3rd parties</td>
                    <td className="py-2 px-3">On-site job dispatch & worksite routing</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Personal Info (Name, Phone)</td>
                    <td className="py-2 px-3">Collected; Shared only between assigned worker & employer</td>
                    <td className="py-2 px-3">Account setup, two-way call contact for shift</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Financial Info (Earnings)</td>
                    <td className="py-2 px-3">Collected; Not shared with 3rd parties</td>
                    <td className="py-2 px-3">Wallet balance, bank transfer requests</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Device Identifiers</td>
                    <td className="py-2 px-3">Collected anonymously</td>
                    <td className="py-2 px-3">App performance, crash debugging, security</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Data Security & Encryption */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Data Security & Encryption in Transit
            </h3>
            <p>
              All communication between the Android application and the backend server is encrypted using Transport Layer Security (TLS 1.3 / HTTPS). Database storage is hosted on encrypted clusters (MongoDB Atlas), protected by role-based authorization controls and strict network isolation.
            </p>
          </div>

          {/* Section 4: Account & Data Deletion (Play Store Mandatory) */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-rose-700">
              <Trash2 className="w-4 h-4 text-rose-600" />
              4. Mandatory User Right: Account & Data Deletion
            </h3>
            <p className="text-[11px] text-slate-600">
              In strict accordance with Google Play Store User Data Policy, any user (customer employer or worker partner) has the unconditional right to request the complete deletion of their account and all personal information at any time.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              {onOpenDataDeletion && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDataDeletion();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Request Account & Data Deletion</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 5: Children's Privacy */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              5. Children's Privacy (COPPA Compliance)
            </h3>
            <p>
              ManPowerLink is an employment and labor marketplace strictly designed for individuals who are 18 years of age or older. We do not knowingly solicit or collect personal information from individuals under the age of 18.
            </p>
          </div>

          {/* Section 6: Contact Information */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-700">Grievance & Data Protection Officer:</p>
            <p>ManPowerLink Privacy Directorate</p>
            <p>Email: <strong className="text-slate-800">privacy@manpowerlink.com</strong> • Support: <strong className="text-slate-800">support@manpowerlink.com</strong></p>
            <p className="mt-1">Mangalore Central Hub, Karnataka, India</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {onOpenTerms && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTerms();
                }}
                className="text-emerald-700 hover:underline text-xs font-bold"
              >
                View Terms of Service
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
