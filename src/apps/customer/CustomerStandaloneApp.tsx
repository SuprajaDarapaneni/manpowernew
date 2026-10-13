import React, { useState } from 'react';
import { CustomerApp } from './CustomerApp';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { PrivacyPolicyModal } from '../../components/legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../../components/legal/TermsOfServiceModal';
import { AccountDeletionModal } from '../../components/legal/AccountDeletionModal';

interface Props {
  onExitStandalone?: () => void;
}

export const CustomerStandaloneApp: React.FC<Props> = ({ onExitStandalone }) => {
  const [inPhoneFrame, setInPhoneFrame] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDeletion, setShowDeletion] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Standalone Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {onExitStandalone && (
            <button
              onClick={onExitStandalone}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>
          )}
          <div>
            <span className="font-extrabold text-white text-xs">Customer / Employer Standalone App</span>
            <span className="ml-2 px-1.5 py-0.2 rounded bg-red-950 text-red-300 text-[10px] border border-red-800/60 font-mono">
              Independent Project Package
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInPhoneFrame(!inPhoneFrame)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            {inPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{inPhoneFrame ? 'Full Screen' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className={inPhoneFrame ? 'w-full max-w-md' : 'w-full max-w-2xl'}>
          <CustomerApp
            onOpenPrivacy={() => setShowPrivacy(true)}
            onOpenTerms={() => setShowTerms(true)}
            onOpenDeletion={() => setShowDeletion(true)}
          />
        </div>
      </main>

      <PrivacyPolicyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onOpenDataDeletion={() => setShowDeletion(true)}
        onOpenTerms={() => setShowTerms(true)}
      />
      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />
      <AccountDeletionModal
        isOpen={showDeletion}
        onClose={() => setShowDeletion(false)}
      />
    </div>
  );
};

export default CustomerStandaloneApp;
