import { useApp } from '../../../context/AppContext';
import { EmployeeScreen } from '../../../types';

export const useEmployeeApp = () => {
  const {
    employeeScreen,
    setEmployeeScreen,
    employeeAuth,
    activeWorkerId,
    setActiveWorkerId,
    loginEmployee,
    registerWorker,
    resetPassword,
    signOut,
    workers,
    orders,
    bids,
    commission,
    walletTransactions,
    toggleWorkerAvailability,
    submitBid,
    employeeAcceptBooking,
    employeeRejectBooking,
    startWorkWithOtp,
    endWorkWithOtp,
    topUpWorkerWallet,
    debitWorkerWallet,
    notifications,
    customization,
    addNotification,
  } = useApp();

  const currentWorker =
    workers.find((w) => w.id === employeeAuth?.id || w.id === activeWorkerId) || workers[0];

  const myBids = bids.filter((b) => b.workerId === currentWorker?.id);
  const availableOrders = orders.filter((o) => o.status === 'open' || o.status === 'bidding');
  const myAcceptedOrders = orders.filter((o) => o.assignedWorkerIds?.includes(currentWorker?.id));
  const myWalletTransactions = walletTransactions.filter((t) => t.workerId === currentWorker?.id);

  return {
    employeeScreen,
    setEmployeeScreen,
    employeeAuth,
    currentWorker,
    activeWorkerId,
    setActiveWorkerId,
    loginEmployee,
    registerWorker,
    resetPassword,
    signOut: () => signOut('employee'),
    workers,
    orders: availableOrders,
    allOrders: orders,
    myAcceptedOrders,
    myBids,
    commission,
    walletTransactions: myWalletTransactions,
    toggleAvailability: () => toggleWorkerAvailability(currentWorker.id),
    submitBid: (jobId: string, amount: number, notes?: string) => submitBid(jobId, amount, notes),
    employeeAcceptBooking,
    employeeRejectBooking,
    startWorkWithOtp,
    endWorkWithOtp,
    topUpWorkerWallet,
    debitWorkerWallet,
    notifications,
    customization,
    addNotification,
  };
};
