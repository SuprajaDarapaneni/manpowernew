import React from 'react';
import { useEmployeeApp } from './hooks/useEmployeeApp';
import { EmployeeHeader } from './components/EmployeeHeader';
import { EmployeeBottomNav } from './components/EmployeeBottomNav';
import { EmployeeDashboardView } from './components/EmployeeDashboardView';
import { AvailableJobsView } from './components/AvailableJobsView';
import { EmployeeBidsView } from './components/EmployeeBidsView';
import { EmployeeEarningsView } from './components/EmployeeEarningsView';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { EmployeeLoginView } from './auth/EmployeeLoginView';

interface Props {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenDeletion?: () => void;
}

export const EmployeeApp: React.FC<Props> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDeletion,
}) => {
  const { employeeAuth, employeeScreen } = useEmployeeApp();

  // Compulsory Login Gate: Must sign in before viewing worker application
  if (!employeeAuth) {
    return <EmployeeLoginView />;
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-[640px] max-h-[880px] bg-slate-50 flex flex-col rounded-3xl overflow-hidden border border-slate-300 shadow-xl font-sans">
      <EmployeeHeader />

      <main className="flex-1 overflow-y-auto">
        {employeeScreen === 'dashboard' && <EmployeeDashboardView />}
        {employeeScreen === 'available' && <AvailableJobsView />}
        {employeeScreen === 'bids' && <EmployeeBidsView />}
        {employeeScreen === 'earnings' && <EmployeeEarningsView />}
        {employeeScreen === 'profile' && (
          <EmployeeProfileView
            onOpenPrivacy={onOpenPrivacy}
            onOpenTerms={onOpenTerms}
            onOpenDeletion={onOpenDeletion}
          />
        )}
      </main>

      <EmployeeBottomNav />
    </div>
  );
};

export default EmployeeApp;
