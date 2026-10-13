import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { AdminApp } from './apps/admin';
import { CustomerApp } from './apps/customer';
import { EmployeeApp } from './apps/employee';
import { SplitConnectedView } from './apps/split';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/legal/TermsOfServiceModal';
import { AccountDeletionModal } from './components/legal/AccountDeletionModal';
import { PlayConsoleHubModal } from './components/legal/PlayConsoleHubModal';
import { PushNotificationToast } from './components/common/PushNotificationToast';
import { PushNotificationSimulatorModal } from './components/common/PushNotificationSimulatorModal';
import { SeparatedCodeViewerModal } from './components/common/SeparatedCodeViewerModal';
import { BackendStatusModal } from './components/common/BackendStatusModal';
import { PushToast } from './shared/types';

const MainView: React.FC = () => {
  const {
    currentRole,
    pushToasts,
    dismissPushToast,
    showPushSimulator,
    setShowPushSimulator,
    customization,
  } = useApp();

  // Modals
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDeletion, setShowDeletion] = useState(false);
  const [showPlayConsole, setShowPlayConsole] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showBackendStatus, setShowBackendStatus] = useState(false);

  const handleToastClick = (toast: PushToast) => {
    dismissPushToast(toast.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Universal Navigation Bar with Multi-App Switcher & Split View */}
      <HeaderNavbar
        onOpenCodeViewer={() => setShowCodeViewer(true)}
        onOpenBackendStatus={() => setShowBackendStatus(true)}
      />

      {/* Main View Area: Dynamic Multi-App Router / Split Ecosystem Simulator */}
      <main className="flex-1 flex flex-col">
        {currentRole === 'admin' && <AdminApp />}

        {currentRole === 'customer' && (
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-slate-900">
            <div className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-slate-50">
              <CustomerApp
                onOpenPrivacy={() => setShowPrivacy(true)}
                onOpenTerms={() => setShowTerms(true)}
                onOpenDeletion={() => setShowDeletion(true)}
              />
            </div>
          </div>
        )}

        {currentRole === 'employee' && (
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-slate-900">
            <div className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-slate-50">
              <EmployeeApp
                onOpenPrivacy={() => setShowPrivacy(true)}
                onOpenTerms={() => setShowTerms(true)}
                onOpenDeletion={() => setShowDeletion(true)}
              />
            </div>
          </div>
        )}

        {currentRole === 'split' && (
          <SplitConnectedView
            onOpenPrivacy={() => setShowPrivacy(true)}
            onOpenTerms={() => setShowTerms(true)}
            onOpenDeletion={() => setShowDeletion(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-xs text-slate-500 text-center">
        <p className="text-slate-500 text-xs font-medium">
          &copy; 2026 {customization.appName}. All rights reserved.
        </p>
      </footer>

      {/* Global Heads-Up Push Notification Toast Banner */}
      <PushNotificationToast
        toasts={pushToasts}
        onDismiss={dismissPushToast}
        onToastClick={handleToastClick}
      />

      {/* Push Simulator Modal */}
      <PushNotificationSimulatorModal
        isOpen={showPushSimulator}
        onClose={() => setShowPushSimulator(false)}
      />

      {/* Separated Code & Architecture Modal */}
      <SeparatedCodeViewerModal
        isOpen={showCodeViewer}
        onClose={() => setShowCodeViewer(false)}
        onLaunchStandalone={() => setShowCodeViewer(false)}
      />

      {/* Backend Status Modal */}
      <BackendStatusModal
        isOpen={showBackendStatus}
        onClose={() => setShowBackendStatus(false)}
      />

      {/* Compliance Modals */}
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
      <PlayConsoleHubModal
        isOpen={showPlayConsole}
        onClose={() => setShowPlayConsole(false)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTerms={() => setShowTerms(true)}
        onOpenDeletion={() => setShowDeletion(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
}
