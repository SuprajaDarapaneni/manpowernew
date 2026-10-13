import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminApp } from './apps/admin';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/legal/TermsOfServiceModal';
import { AccountDeletionModal } from './components/legal/AccountDeletionModal';
import { PushNotificationToast } from './components/common/PushNotificationToast';
import { PushNotificationSimulatorModal } from './components/common/PushNotificationSimulatorModal';
import { SeparatedCodeViewerModal } from './components/common/SeparatedCodeViewerModal';
import { BackendStatusModal } from './components/common/BackendStatusModal';
import { PushToast } from './shared/types';

const MainView: React.FC = () => {
  const {
    pushToasts,
    dismissPushToast,
    showPushSimulator,
    setShowPushSimulator,
    customization,
  } = useApp();

  // Modals for legal compliance and architecture audits
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDeletion, setShowDeletion] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showBackendStatus, setShowBackendStatus] = useState(false);

  const handleToastClick = (toast: PushToast) => {
    dismissPushToast(toast.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      {/* 
        Standalone Client Admin Portal:
        - No multi-app switcher navbar
        - No customer app or employee app or split preview exposed to clients
        - Shows Admin Login when logged out, Admin Dashboard when authenticated
      */}
      <main className="flex-1 flex flex-col">
        <AdminApp onOpenCodeViewer={() => setShowCodeViewer(true)} />
      </main>

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

      {/* Separated Code & Architecture Documentation Modal */}
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
