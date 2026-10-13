import React from 'react';
import {
  User,
  Smartphone,
  MapPin,
  ShieldCheck,
  Star,
  FileText,
  Trash2,
  LogOut,
  CheckCircle2,
  HardHat,
} from 'lucide-react';
import { useEmployeeApp } from '../hooks/useEmployeeApp';

interface Props {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenDeletion?: () => void;
}

export const EmployeeProfileView: React.FC<Props> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDeletion,
}) => {
  const { currentWorker, signOut } = useEmployeeApp();

  return (
    <div className="p-3 sm:p-4 text-xs space-y-4">
      {/* Profile Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-slate-900">{currentWorker.name}</h2>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Aadhaar Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{currentWorker.category}</p>
            <div className="flex items-center text-amber-600 font-bold text-[10px] mt-0.5">
              <Star className="w-3 h-3 fill-amber-500 mr-1" />
              <span>{currentWorker.rating} ({currentWorker.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
            <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-800">{currentWorker.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-slate-800 truncate">{currentWorker.location}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Trade Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {currentWorker.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Database Verification Status */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <strong className="text-xs font-bold">MongoDB Atlas Worker Profile</strong>
        </div>
        <p className="text-[11px] leading-relaxed text-emerald-900">
          Your profile, rating, and verified trade details are securely stored in <code>manpowerlink_db.workers</code>.
        </p>
      </div>

      {/* Google Play Mandatory Compliance Links */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
        <div className="p-3 bg-slate-50/70 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          Legal &amp; Google Play Store Policies
        </div>

        <button
          onClick={onOpenPrivacy}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy Policy</span>
          </div>
          <span className="text-slate-400 text-xs">&rarr;</span>
        </button>

        <button
          onClick={onOpenTerms}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2 text-slate-700">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Terms of Service</span>
          </div>
          <span className="text-slate-400 text-xs">&rarr;</span>
        </button>

        <button
          onClick={onOpenDeletion}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-rose-50/50 transition cursor-pointer text-rose-700 font-semibold"
        >
          <div className="flex items-center space-x-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Account &amp; Personal Data</span>
          </div>
          <span className="text-rose-400 text-xs">&rarr;</span>
        </button>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={signOut}
        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of Worker App</span>
      </button>
    </div>
  );
};
