import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DEMO_EMPLOYERS = [
  { name: 'Kiran Transport & Co.', phone: '+91 98450 11223', desc: 'Logistics, Hauling & Relocation' },
  { name: 'Apex Warehousing Ltd', phone: '+91 98450 44556', desc: 'Warehouse & Heavy Box Dispatch' },
  { name: 'Skyline Events & Catering', phone: '+91 98450 77889', desc: 'Event Staffing & Helpers' },
];

export const CustomerLoginView: React.FC = () => {
  const { loginCustomer } = useApp();
  const [phone, setPhone] = useState('+91 98450 11223');
  const [businessName, setBusinessName] = useState('Kiran Transport & Co.');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('1234');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginCustomer(phone, otp || '1234', businessName);
    setIsLoading(false);
  };

  const handleSelectEmployer = (emp: typeof DEMO_EMPLOYERS[0]) => {
    setBusinessName(emp.name);
    setPhone(emp.phone);
    setOtpSent(true);
    setOtp('1234');
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 bg-slate-50 font-sans text-slate-800">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6">
        {/* Header */}
        <div className="text-center space-y-1.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto text-white shadow-md shadow-teal-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Employer & Business Sign In
          </h2>
          <p className="text-[11px] text-slate-500">
            Post workforce jobs and receive real-time bids from vetted workers
          </p>
        </div>

        {/* Compulsory Login Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px] leading-snug">
            <strong>Login Compulsory:</strong> You must sign in as an employer before viewing orders or posting requirements.
          </span>
        </div>

        {/* Quick Account Switcher */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
            Quick 1-Click Demo Profiles:
          </label>
          <div className="space-y-1.5">
            {DEMO_EMPLOYERS.map((emp) => (
              <button
                key={emp.phone}
                type="button"
                onClick={() => handleSelectEmployer(emp)}
                className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                  businessName === emp.name
                    ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-[11px]">{emp.name}</div>
                  <div className="text-[10px] text-slate-500">{emp.desc}</div>
                </div>
                {businessName === emp.name && (
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Phone & OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Business / Employer Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Mobile Phone Number
            </label>
            <div className="flex space-x-1.5">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 11223"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition shrink-0"
              >
                {otpSent ? 'Resend' : 'Get OTP'}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Verification Code (OTP)
              </label>
              <span className="text-[10px] text-teal-600 font-bold">Demo Code: 1234</span>
            </div>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-60"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Persistent login enabled &bull; Session remembered automatically
        </div>
      </div>
    </div>
  );
};
