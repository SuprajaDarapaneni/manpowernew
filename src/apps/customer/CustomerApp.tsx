import React from 'react';
import { useCustomerApp } from './hooks/useCustomerApp';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerBottomNav } from './components/CustomerBottomNav';
import { CustomerHomeView } from './components/CustomerHomeView';
import { PostJobView } from './components/PostJobView';
import { BidsManagementView } from './components/BidsManagementView';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { CustomerProfileView } from './components/CustomerProfileView';
import { CustomerLoginView } from './auth/CustomerLoginView';

interface Props {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenDeletion?: () => void;
}

export const CustomerApp: React.FC<Props> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDeletion,
}) => {
  const { customerAuth, customerScreen } = useCustomerApp();

  // Compulsory Login Gate: Must sign in before viewing employer application
  if (!customerAuth) {
    return <CustomerLoginView />;
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-[640px] max-h-[880px] bg-slate-50 flex flex-col rounded-3xl overflow-hidden border border-slate-300 shadow-xl font-sans">
      <CustomerHeader />

      <main className="flex-1 overflow-y-auto">
        {customerScreen === 'home' && <CustomerHomeView />}
        {customerScreen === 'post-job' && <PostJobView />}
        {customerScreen === 'bids' && <BidsManagementView />}
        {customerScreen === 'orders' && <CustomerOrdersView />}
        {customerScreen === 'profile' && (
          <CustomerProfileView
            onOpenPrivacy={onOpenPrivacy}
            onOpenTerms={onOpenTerms}
            onOpenDeletion={onOpenDeletion}
          />
        )}
      </main>

      <CustomerBottomNav />
    </div>
  );
};

export default CustomerApp;
