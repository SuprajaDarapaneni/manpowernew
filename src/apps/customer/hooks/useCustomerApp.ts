import { useApp } from '../../../context/AppContext';
import { CustomerScreen } from '../../../types';

export const useCustomerApp = () => {
  const {
    customerScreen,
    setCustomerScreen,
    customerAuth,
    loginCustomer,
    registerCustomer,
    resetPassword,
    signOut,
    categories,
    workers,
    orders,
    bids,
    commission,
    selectedJobId,
    setSelectedJobId,
    createBooking,
    postJob,
    acceptBid,
    declineBid,
    settlePayment,
    submitCustomerRating,
    notifications,
    customization,
    addNotification,
  } = useApp();

  const activeCustomerOrders = orders.filter((o) =>
    customerAuth?.id ? o.customerId === customerAuth.id || o.customerId === 'cust-101' : true
  );

  const selectedOrder = orders.find((o) => o.id === selectedJobId) || activeCustomerOrders[0] || orders[0];
  const orderBids = bids.filter((b) => b.jobId === selectedOrder?.id);

  return {
    customerScreen,
    setCustomerScreen,
    customerAuth,
    loginCustomer,
    registerCustomer,
    resetPassword,
    signOut: () => signOut('customer'),
    categories,
    workers,
    orders: activeCustomerOrders,
    allOrders: orders,
    selectedOrder,
    selectedJobId,
    setSelectedJobId,
    orderBids,
    bids,
    commission,
    createBooking,
    postJob,
    acceptBid,
    declineBid,
    settlePayment,
    submitCustomerRating,
    notifications,
    customization,
    addNotification,
  };
};
