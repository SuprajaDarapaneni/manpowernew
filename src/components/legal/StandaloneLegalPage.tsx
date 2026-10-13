import React from 'react';
import {
  ShieldCheck,
  FileText,
  Trash2,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { AccountDeletionModal } from './AccountDeletionModal';
import { PlayConsoleHubModal } from './PlayConsoleHubModal';

interface Props {
  page: 'privacy' | 'terms' | 'data-deletion' | 'play-console';
  onBack: () => void;
}

export const StandaloneLegalPage: React.FC<Props> = ({ page, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-slate-900">
              ManPower<span className="text-emerald-600">Link</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Google Play Verified
            </span>
          </div>
        </div>
      </header>

      {/* Render selected view directly as embedded modal/container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6">
        {page === 'privacy' && (
          <PrivacyPolicyModal
            isOpen={true}
            onClose={onBack}
            onOpenDataDeletion={() => {
              window.history.pushState({}, '', '/?page=data-deletion');
              window.location.search = '?page=data-deletion';
            }}
            onOpenTerms={() => {
              window.history.pushState({}, '', '/?page=terms');
              window.location.search = '?page=terms';
            }}
          />
        )}

        {page === 'terms' && (
          <TermsOfServiceModal
            isOpen={true}
            onClose={onBack}
            onOpenPrivacy={() => {
              window.history.pushState({}, '', '/?page=privacy');
              window.location.search = '?page=privacy';
            }}
          />
        )}

        {page === 'data-deletion' && (
          <AccountDeletionModal
            isOpen={true}
            onClose={onBack}
          />
        )}

        {page === 'play-console' && (
          <PlayConsoleHubModal
            isOpen={true}
            onClose={onBack}
            onOpenPrivacy={() => {
              window.history.pushState({}, '', '/?page=privacy');
              window.location.search = '?page=privacy';
            }}
            onOpenTerms={() => {
              window.history.pushState({}, '', '/?page=terms');
              window.location.search = '?page=terms';
            }}
            onOpenDeletion={() => {
              window.history.pushState({}, '', '/?page=data-deletion');
              window.location.search = '?page=data-deletion';
            }}
          />
        )}
      </main>
    </div>
  );
};
