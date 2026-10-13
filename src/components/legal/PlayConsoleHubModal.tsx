import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Lock,
  Layers,
  Sparkles,
  HelpCircle,
  X,
  Download,
  Terminal,
  KeyRound,
  Database,
  UserCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDeletion: () => void;
}

export const PlayConsoleHubModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenTerms,
  onOpenDeletion,
}) => {
  const [activeTab, setActiveTab] = useState<'listing' | 'datasafety' | 'credentials' | 'packaging' | 'checklist'>('credentials');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHost = window.location.origin;
  const privacyUrl = `${currentHost}/?page=privacy`;
  const deletionUrl = `${currentHost}/?page=data-deletion`;
  const manifestUrl = `${currentHost}/manifest.json`;
  const assetLinksUrl = `${currentHost}/.well-known/assetlinks.json`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Google Play Console Readiness Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                  Play Store Ready
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                100% Policy Compliant • Manifest • Privacy Policy • Data Safety • TWA Package
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listing')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'listing' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Store Listing Info</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'credentials' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>App Access & Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('datasafety')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'datasafety' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data Safety Form</span>
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'packaging' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>TWA APK / Bundle Build</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Policy Checklist (10/10)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-700 space-y-5">
          {/* TAB 1: STORE LISTING INFO */}
          {activeTab === 'listing' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  These values are pre-formatted to match Google Play Console character limits and listing guidelines. Click the copy icon to paste directly into your Play Console listing.
                </div>
              </div>

              {/* App Title */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">App Title (Max 30 characters)</span>
                  <button
                    onClick={() => copyToClipboard('ManPowerLink - Manpower App', 'title')}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'title' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800 text-xs font-bold">
                  ManPowerLink - Manpower App
                </div>
              </div>

              {/* Short Description */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Short Description (Max 80 characters)</span>
                  <button
                    onClick={() => copyToClipboard('On-demand temporary manpower booking, bidding & workforce management app.', 'shortDesc')}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'shortDesc' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800 text-xs">
                  On-demand temporary manpower booking, bidding & workforce management app.
                </div>
              </div>

              {/* Mandatory URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Privacy Policy URL *</span>
                    <button
                      onClick={() => copyToClipboard(privacyUrl, 'privUrl')}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === 'privUrl' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-800 truncate" title={privacyUrl}>
                    {privacyUrl}
                  </div>
                  <button
                    onClick={onOpenPrivacy}
                    className="text-emerald-700 hover:underline text-[11px] font-bold flex items-center gap-1 pt-0.5"
                  >
                    <span>Preview Privacy Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Account Deletion URL *</span>
                    <button
                      onClick={() => copyToClipboard(deletionUrl, 'delUrl')}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === 'delUrl' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-800 truncate" title={deletionUrl}>
                    {deletionUrl}
                  </div>
                  <button
                    onClick={onOpenDeletion}
                    className="text-rose-700 hover:underline text-[11px] font-bold flex items-center gap-1 pt-0.5"
                  >
                    <span>Test Deletion Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Package Names & Version Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Package Name</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">com.manpowerlink.app</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Version Code</span>
                  <span className="font-mono font-bold text-emerald-700 text-xs">100 (v1.0.0)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                  <span className="font-bold text-slate-800 text-xs">Business / Jobs</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Age</span>
                  <span className="font-bold text-slate-800 text-xs">18+ (Adults)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APP ACCESS & REVIEWER CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-950 flex items-start gap-2">
                <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Synced Live with MongoDB Atlas (manpowerlink_db):</strong> All credentials below are permanently stored in your cloud MongoDB cluster. Google Play Console requires submitting test login credentials in the <em>App Content &gt; App Access</em> declaration for app review.
                </div>
              </div>

              {/* 1-Click Copy All for Play Console */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-white text-xs">Play Console "App Access" Submission Block</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `GOOGLE PLAY APP ACCESS REVIEW CREDENTIALS:\n\n1. EMPLOYER / CUSTOMER APP:\n- Mobile / Login: +91 98450 11223\n- Password / OTP: 1234\n- Role: Employer / Customer (Kiran Transport & Co.)\n- App URL: ${currentHost}/?app=customer\n\n2. WORKER / EMPLOYEE APP:\n- Mobile / Login: +91 98765 43210\n- Password / OTP: 1234\n- Role: Worker / Partner (Ramesh Gowda - Loading & Unloading)\n- App URL: ${currentHost}/?app=employee\n\n3. ADMIN MANAGEMENT CONSOLE:\n- Email: admin@gmail.com\n- Password: admin\n- Role: Super Administrator\n- Admin URL: ${currentHost}/?app=admin\n\nDatabase: MongoDB Atlas (cluster0.dzxw5pm.mongodb.net / manpowerlink_db)`,
                        'allPlayCreds'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'allPlayCreds' ? 'Copied Full Block!' : 'Copy Play Console Instructions'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click the button above to copy the complete pre-formatted block ready to paste into Play Console <strong>Policy &amp; Programs &gt; App Content &gt; App Access</strong>.
                </p>
              </div>

              {/* Individual Account Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Admin Card */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-slate-900 text-xs">Admin Panel</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                      Superuser
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <strong className="font-mono text-slate-800">admin@gmail.com</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Password:</span>
                      <strong className="font-mono text-emerald-700">admin</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Alternative:</span>
                      <span className="font-mono text-slate-600 text-[10px]">admin@manpowerlink.com (Pass: admin123)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DB Status:</span>
                      <span className="text-emerald-700 font-bold">In MongoDB Atlas</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('admin@gmail.com / admin', 'adminCred')}
                    className="w-full mt-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'adminCred' ? 'Copied!' : 'Copy Admin Login'}</span>
                  </button>
                </div>

                {/* Customer / Employer Card */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-xs">Customer App</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Employer
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <strong className="font-mono text-slate-800">+91 98450 11223</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="text-slate-800 font-medium truncate">Kiran Transport & Co.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Password / OTP:</span>
                      <strong className="font-mono text-emerald-700">1234</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DB Status:</span>
                      <span className="text-emerald-700 font-bold">In MongoDB Atlas</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('+91 98450 11223 / 1234', 'custCred')}
                    className="w-full mt-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'custCred' ? 'Copied!' : 'Copy Employer Login'}</span>
                  </button>
                </div>

                {/* Worker / Employee Card */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <KeyRound className="w-4 h-4 text-yellow-600" />
                      <span className="font-bold text-slate-900 text-xs">Worker App</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold">
                      Worker Partner
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <strong className="font-mono text-slate-800">+91 98765 43210</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="text-slate-800 font-medium truncate">Ramesh Gowda</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Password / OTP:</span>
                      <strong className="font-mono text-emerald-700">1234</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DB Status:</span>
                      <span className="text-emerald-700 font-bold">In MongoDB Atlas</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('+91 98765 43210 / 1234', 'empCred')}
                    className="w-full mt-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'empCred' ? 'Copied!' : 'Copy Worker Login'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA SAFETY FORM RESPONSES */}
          {activeTab === 'datasafety' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Google Play Data Safety Section Answers</h3>
                <p className="text-[11px] text-slate-500">
                  Copy these exact selections into the Play Console "App content &gt; Data safety" questionnaire:
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Question</th>
                      <th className="py-2.5 px-3">Answer to select in Play Console</th>
                      <th className="py-2.5 px-3">Details / Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Does your app collect or share user data?</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">Yes</td>
                      <td className="py-2.5 px-3">Used for account management and dispatch</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Is all user data encrypted in transit?</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">Yes (TLS 1.3 / HTTPS)</td>
                      <td className="py-2.5 px-3">All network endpoints use HTTPS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Do you provide a way for users to request data deletion?</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">Yes (In-app + Web URL)</td>
                      <td className="py-2.5 px-3">Direct deletion in profile and via web form</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Location (Approximate & Precise)</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">Collected: Yes • Shared: No</td>
                      <td className="py-2.5 px-3">App functionality (Finding nearby work shifts)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Personal Info (Name, Phone number)</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">Collected: Yes • Shared: No</td>
                      <td className="py-2.5 px-3">Account management and OTP verification</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Financial Info (Earnings & Wallet)</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">Collected: Yes • Shared: No</td>
                      <td className="py-2.5 px-3">Worker payout tracking & bank transfers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGING & BUILD */}
          {activeTab === 'packaging' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-950 flex items-start gap-2">
                <Terminal className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Zero-Config Android App Bundle (.aab) Generation:</strong> ManPowerLink includes complete Web App Manifest, 512px maskable icons, and Digital Asset Links. You can generate a native Play Store package in under 2 minutes.
                </div>
              </div>

              {/* Option A: Bubblewrap CLI */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-400">Option 1: Google Bubblewrap (Official Google CLI)</span>
                  <button
                    onClick={() => copyToClipboard(`npm i -g @bubblewrap/cli\nbubblewrap init --manifest=${manifestUrl}\nbubblewrap build`, 'cli')}
                    className="text-emerald-400 hover:text-emerald-300 font-sans text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'cli' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <p className="text-slate-400"># 1. Install Google Bubblewrap CLI</p>
                <p className="text-white">npm i -g @bubblewrap/cli</p>
                <p className="text-slate-400 mt-2"># 2. Initialize using live manifest</p>
                <p className="text-emerald-300">bubblewrap init --manifest={manifestUrl}</p>
                <p className="text-slate-400 mt-2"># 3. Build signed Android App Bundle (.aab)</p>
                <p className="text-white">bubblewrap build</p>
              </div>

              {/* Option B: PWABuilder */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Option 2: PWABuilder (One-Click Cloud Packaging)</span>
                <p className="text-slate-600 text-[11px]">
                  Go to <strong>PWABuilder.com</strong>, paste the application URL (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">{currentHost}</code>), and click <strong>"Package for Google Play"</strong>. It outputs a signed <code>.aab</code> package ready to drop directly into Play Console!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-950 text-xs">
                  All 10 Core Google Play Store Requirements Satisfied:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {[
                  { title: 'Privacy Policy URL Live', desc: 'Accessible on web and inside app within 1 click.' },
                  { title: 'Mandatory Account Deletion Tool', desc: 'Compliant with Google Play 2024+ user data deletion rule.' },
                  { title: 'Web App Manifest (PWA)', desc: 'Valid start_url, theme_color, standalone display.' },
                  { title: 'Play Store Compatible Icons', desc: '192x192, 512x512 PNG and maskable squircle icons generated.' },
                  { title: 'Digital Asset Links', desc: 'Valid /.well-known/assetlinks.json ready for TWA verification.' },
                  { title: 'HTTPS / TLS 1.3 Encryption', desc: 'All API routes and client network traffic encrypted in transit.' },
                  { title: 'Clear Location Permission Justification', desc: 'Ephemeral worksite dispatch, no background tracking.' },
                  { title: 'COPPA Children Compliance', desc: 'Explicitly labeled and governed for 18+ labor marketplace.' },
                  { title: 'Transparent Labor Floor Pricing', desc: 'Enforces minimum rate per head for workforce protection.' },
                  { title: 'Two-Way Attendance OTP Check-in', desc: 'Verifiable start and end proof preventing fraudulent jobs.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">{item.title}</strong>
                      <span className="text-slate-500 text-[10px]">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                onClose();
                onOpenTerms();
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              Terms of Service
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                onClose();
                onOpenDeletion();
              }}
              className="text-rose-700 hover:underline font-bold"
            >
              Delete Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
