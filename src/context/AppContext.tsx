import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppViewRole,
  AdminTab,
  CustomerScreen,
  EmployeeScreen,
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  CommissionSettings,
  NotificationItem,
  AuthUser,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_STATS,
} from '../data/initialData';
import { api, HealthResponse } from '../services/api';

const DEFAULT_ADMIN: AuthUser = {
  id: 'admin-1',
  name: 'Vivek Sharma',
  role: 'admin',
  emailOrPhone: 'admin@manpowerlink.com',
  token: 'jwt_admin_demo',
  verified: true,
};

const DEFAULT_CUSTOMER: AuthUser = {
  id: 'cust-101',
  name: 'Kiran Transport & Co.',
  role: 'customer',
  emailOrPhone: '+91 98450 11223',
  businessName: 'Kiran Transport & Co.',
  token: 'jwt_cust_demo',
  verified: true,
};

const DEFAULT_EMPLOYEE: AuthUser = {
  id: 'w-ramesh',
  name: 'Ramesh Gowda',
  role: 'employee',
  emailOrPhone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  workerCategory: 'Loading & Unloading',
  rating: 4.8,
  verified: true,
  token: 'jwt_emp_demo',
};

interface AppContextType {
  // Navigation & Role View
  currentRole: AppViewRole;
  setCurrentRole: (role: AppViewRole) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  customerScreen: CustomerScreen;
  setCustomerScreen: (screen: CustomerScreen) => void;
  employeeScreen: EmployeeScreen;
  setEmployeeScreen: (screen: EmployeeScreen) => void;
  usePhoneFrame: boolean;
  setUsePhoneFrame: (val: boolean) => void;

  // Selected Entities
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  activeWorkerId: string;
  setActiveWorkerId: (id: string) => void;

  // Authentication State
  adminAuth: AuthUser | null;
  customerAuth: AuthUser | null;
  employeeAuth: AuthUser | null;
  loginAdmin: (email?: string, password?: string) => Promise<boolean>;
  loginCustomer: (phone: string, otp: string, name?: string) => Promise<boolean>;
  loginEmployee: (workerIdOrPhone: string, otp: string) => Promise<boolean>;
  signOut: (role: 'admin' | 'customer' | 'employee') => Promise<void>;
  switchWorkerAccount: (workerId: string) => void;

  // State
  categories: ServiceCategory[];
  workers: Worker[];
  orders: JobOrder[];
  bids: Bid[];
  commission: CommissionSettings;
  stats: typeof INITIAL_STATS;
  notifications: NotificationItem[];

  // Backend Integration
  backendConnected: boolean;
  backendHealth: HealthResponse | null;
  syncingWithBackend: boolean;
  refreshBackend: () => Promise<void>;

  // Actions
  toggleCategoryStatus: (categoryId: string) => void;
  addCategory: (category: Omit<ServiceCategory, 'id' | 'totalWorkers'>) => void;
  toggleWorkerAvailability: (workerId: string) => void;
  postJob: (jobData: Omit<JobOrder, 'id' | 'orderNumber' | 'status' | 'assignedWorkerIds' | 'totalAgreedAmount' | 'commissionDeducted' | 'createdAt'>) => string;
  submitBid: (jobId: string, amount: number, notes?: string) => void;
  acceptBid: (bidId: string) => void;
  declineBid: (bidId: string) => void;
  updateCommission: (settings: Partial<CommissionSettings>) => void;
  simulateIncomingBid: () => void;
  resetDemoData: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type'], targetRole?: AppViewRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<AppViewRole>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('home');
  const [employeeScreen, setEmployeeScreen] = useState<EmployeeScreen>('dashboard');
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);

  // Authentication states - Compulsory login: starts as null so users MUST sign in before seeing apps/dashboard
  const [adminAuth, setAdminAuth] = useState<AuthUser | null>(() => {
    try {
      // Invalidate any legacy auto-signed-in dummy tokens from prior sessions
      const autoCleaned = sessionStorage.getItem('manpower_cleaned_autologin_v4');
      if (!autoCleaned) {
        localStorage.removeItem('manpower_admin_auth');
        localStorage.removeItem('manpower_customer_auth');
        localStorage.removeItem('manpower_employee_auth');
        sessionStorage.setItem('manpower_cleaned_autologin_v4', 'true');
        return null;
      }
      const stored = localStorage.getItem('manpower_admin_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [customerAuth, setCustomerAuth] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('manpower_customer_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [employeeAuth, setEmployeeAuth] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('manpower_employee_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [selectedJobId, setSelectedJobId] = useState<string>('job-1045');
  const [activeWorkerId, setActiveWorkerId] = useState<string>(() => {
    return employeeAuth?.id || 'w-ramesh';
  });

  const loginAdmin = async (email = 'admin@manpowerlink.com', password = ''): Promise<boolean> => {
    const res = await api.login({ role: 'admin', emailOrPhone: email, password });
    if (res.success && res.user) {
      setAdminAuth(res.user);
      localStorage.setItem('manpower_admin_auth', JSON.stringify(res.user));
      addNotification('Admin Signed In', `Welcome back, ${res.user.name}`, 'success', 'admin');
      return true;
    }
    // Fallback local login
    const user = { ...DEFAULT_ADMIN, emailOrPhone: email };
    setAdminAuth(user);
    localStorage.setItem('manpower_admin_auth', JSON.stringify(user));
    return true;
  };

  const loginCustomer = async (phone: string, otp: string, name?: string): Promise<boolean> => {
    const res = await api.verifyOtp({ phone, otp, role: 'customer', name });
    if (res.success && res.user) {
      setCustomerAuth(res.user);
      localStorage.setItem('manpower_customer_auth', JSON.stringify(res.user));
      addNotification('Customer Signed In', `Welcome, ${res.user.name}`, 'success', 'customer');
      return true;
    }
    // Fallback demo login
    const user: AuthUser = {
      id: `cust-${Date.now()}`,
      name: name || 'Kiran Transport & Co.',
      role: 'customer',
      emailOrPhone: phone,
      businessName: name || 'Kiran Transport & Co.',
      verified: true,
      token: `jwt_cust_${Date.now()}`,
    };
    setCustomerAuth(user);
    localStorage.setItem('manpower_customer_auth', JSON.stringify(user));
    return true;
  };

  const loginEmployee = async (workerIdOrPhone: string, otp: string): Promise<boolean> => {
    const matchedWorker = workers.find((w) => w.id === workerIdOrPhone || w.phone === workerIdOrPhone) || workers[0];
    const res = await api.verifyOtp({ phone: matchedWorker.phone, otp, role: 'employee', workerId: matchedWorker.id });
    if (res.success && res.user) {
      setEmployeeAuth(res.user);
      setActiveWorkerId(res.user.id);
      localStorage.setItem('manpower_employee_auth', JSON.stringify(res.user));
      addNotification('Worker Signed In', `Welcome, ${res.user.name}`, 'success', 'employee');
      return true;
    }
    const user: AuthUser = {
      id: matchedWorker.id,
      name: matchedWorker.name,
      role: 'employee',
      emailOrPhone: matchedWorker.phone,
      avatar: matchedWorker.avatar,
      workerCategory: matchedWorker.category,
      rating: matchedWorker.rating,
      verified: matchedWorker.isVerified,
      token: `jwt_emp_${Date.now()}`,
    };
    setEmployeeAuth(user);
    setActiveWorkerId(matchedWorker.id);
    localStorage.setItem('manpower_employee_auth', JSON.stringify(user));
    return true;
  };

  const signOut = async (role: 'admin' | 'customer' | 'employee'): Promise<void> => {
    if (role === 'admin') {
      setAdminAuth(null);
      localStorage.removeItem('manpower_admin_auth');
      addNotification('Admin Signed Out', 'You have been signed out from the Admin Console', 'info', 'admin');
    } else if (role === 'customer') {
      setCustomerAuth(null);
      localStorage.removeItem('manpower_customer_auth');
      addNotification('Signed Out', 'You have been signed out of Employer App', 'info', 'customer');
    } else if (role === 'employee') {
      setEmployeeAuth(null);
      localStorage.removeItem('manpower_employee_auth');
      addNotification('Signed Out', 'Worker profile logged out', 'info', 'employee');
    }
    await api.logout();
  };

  const switchWorkerAccount = (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target) return;
    const user: AuthUser = {
      id: target.id,
      name: target.name,
      role: 'employee',
      emailOrPhone: target.phone,
      avatar: target.avatar,
      workerCategory: target.category,
      rating: target.rating,
      verified: target.isVerified,
      token: `jwt_emp_${Date.now()}`,
    };
    setEmployeeAuth(user);
    setActiveWorkerId(target.id);
    localStorage.setItem('manpower_employee_auth', JSON.stringify(user));
    addNotification('Switched Worker Profile', `Now operating as ${target.name} (${target.category})`, 'info', 'employee');
  };

  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [orders, setOrders] = useState<JobOrder[]>(INITIAL_ORDERS);
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);
  const [commission, setCommission] = useState<CommissionSettings>(INITIAL_COMMISSION);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Bid Received',
      message: 'Ramesh Gowda submitted a bid of ₹2,000 for Order #1045',
      type: 'bid',
      timestamp: 'Just now',
      targetRole: 'customer',
    },
  ]);

  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [syncingWithBackend, setSyncingWithBackend] = useState<boolean>(false);

  // Poll or fetch initial data from backend if available
  const refreshBackend = useCallback(async () => {
    setSyncingWithBackend(true);
    try {
      const health = await api.checkHealth();
      if (health && health.status === 'healthy') {
        setBackendConnected(true);
        setBackendHealth(health);

        const [catList, workerList, jobList, bidList, commData, notifList] = await Promise.all([
          api.getCategories(),
          api.getWorkers(),
          api.getJobs(),
          api.getBids(),
          api.getCommission(),
          api.getNotifications(),
        ]);

        if (catList) setCategories(catList);
        if (workerList) setWorkers(workerList);
        if (jobList) setOrders(jobList);
        if (bidList) setBids(bidList);
        if (commData) setCommission(commData);
        if (notifList && notifList.length > 0) setNotifications(notifList);
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    } finally {
      setSyncingWithBackend(false);
    }
  }, []);

  useEffect(() => {
    refreshBackend();
    const interval = setInterval(refreshBackend, 15000);
    return () => clearInterval(interval);
  }, [refreshBackend]);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'info',
    targetRole?: AppViewRole
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      targetRole,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    api.dismissNotification(id).catch(() => {});
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    );
    api.toggleCategory(categoryId).catch(() => {});
  };

  const addCategory = (categoryData: Omit<ServiceCategory, 'id' | 'totalWorkers'>) => {
    const newCategory: ServiceCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      totalWorkers: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    setStats((prev) => ({ ...prev, totalCategories: prev.totalCategories + 1 }));
    addNotification('Category Added', `Service category "${categoryData.name}" is now live on the platform`, 'success', 'admin');
    api.addCategory(categoryData).catch(() => {});
  };

  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, isAvailable: !w.isAvailable } : w))
    );
    api.toggleWorkerAvailability(workerId).catch(() => {});
  };

  const postJob = (
    jobData: Omit<JobOrder, 'id' | 'orderNumber' | 'status' | 'assignedWorkerIds' | 'totalAgreedAmount' | 'commissionDeducted' | 'createdAt'>
  ): string => {
    const nextNum = 1046 + orders.length - 4;
    const orderNumber = `#${nextNum}`;
    const newJobId = `job-${nextNum}`;

    const newJob: JobOrder = {
      ...jobData,
      id: newJobId,
      orderNumber,
      status: 'open',
      assignedWorkerIds: [],
      totalAgreedAmount: 0,
      commissionDeducted: 0,
      createdAt: 'Just now',
    };

    setOrders((prev) => [newJob, ...prev]);
    setSelectedJobId(newJobId);
    setStats((prev) => ({ ...prev, activeOrders: prev.activeOrders + 1 }));

    addNotification(
      'New Job Posted!',
      `Order ${orderNumber} (${jobData.category}) has been published. Nearby workers notified.`,
      'success'
    );

    api.createJob(jobData).catch(() => {});

    return newJobId;
  };

  const submitBid = (jobId: string, amount: number, notes?: string) => {
    const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
    const targetOrder = orders.find((o) => o.id === jobId);

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId,
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerRating: worker.rating,
      workerJobsCompleted: worker.jobsCompleted,
      amount,
      proposedTime: 'As requested',
      notes: notes || 'Ready with required gear and experienced in task.',
      status: 'pending',
      createdAt: 'Just now',
    };

    setBids((prev) => [newBid, ...prev]);
    setStats((prev) => ({ ...prev, totalBids: prev.totalBids + 1 }));

    // Update order status to bidding if still open
    setOrders((prev) =>
      prev.map((o) => (o.id === jobId && o.status === 'open' ? { ...o, status: 'bidding' } : o))
    );

    addNotification(
      'Bid Submitted!',
      `${worker.name} submitted a bid of ₹${amount.toLocaleString()} for ${targetOrder?.orderNumber || 'Order'}`,
      'bid',
      'customer'
    );

    api.submitBid({ jobId, workerId: worker.id, amount, notes }).catch(() => {});
  };

  const acceptBid = (bidId: string) => {
    const targetBid = bids.find((b) => b.id === bidId);
    if (!targetBid) return;

    // Update bid status
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'accepted' } : b))
    );

    // Calculate commission
    let commAmount = 0;
    if (commission.type === 'percentage') {
      commAmount = Math.round((targetBid.amount * commission.percentage) / 100);
    } else {
      commAmount = commission.fixedAmount;
    }

    // Update worker stats & wallet
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === targetBid.workerId) {
          return {
            ...w,
            walletBalance: w.walletBalance + (targetBid.amount - commAmount),
            jobsCompleted: w.jobsCompleted + 1,
          };
        }
        return w;
      })
    );

    // Update order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === targetBid.jobId) {
          const updatedAssigned = [...new Set([...o.assignedWorkerIds, targetBid.workerId])];
          const isFullyFilled = updatedAssigned.length >= o.requiredWorkers;
          return {
            ...o,
            status: isFullyFilled ? 'assigned' : 'bidding',
            assignedWorkerIds: updatedAssigned,
            totalAgreedAmount: (o.totalAgreedAmount || 0) + targetBid.amount,
            commissionDeducted: (o.commissionDeducted || 0) + commAmount,
          };
        }
        return o;
      })
    );

    // Update admin stats
    setStats((prev) => ({
      ...prev,
      platformRevenue: prev.platformRevenue + commAmount,
      monthlyOrderVolume: prev.monthlyOrderVolume + targetBid.amount,
    }));

    addNotification(
      'Worker Booked & Confirmed!',
      `${targetBid.workerName} has been booked. Commission ₹${commAmount} deducted. Notification sent to worker.`,
      'success'
    );

    api.acceptBid(bidId).catch(() => {});
  };

  const declineBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'declined' } : b))
    );
    addNotification('Bid Declined', 'The worker proposal was rejected.', 'info', 'employee');
    api.declineBid(bidId).catch(() => {});
  };

  const updateCommission = (settings: Partial<CommissionSettings>) => {
    const updated = {
      ...commission,
      ...settings,
      updatedAt: 'Just now',
    };
    setCommission(updated);
    addNotification(
      'Commission Policy Updated',
      `New commission: ${settings.type === 'percentage' ? `${settings.percentage}%` : `₹${settings.fixedAmount} Flat`} per order`,
      'info',
      'admin'
    );
    api.updateCommission(settings).catch(() => {});
  };

  const simulateIncomingBid = () => {
    const targetOrder = orders[0];
    const availableWorkers = workers.filter(
      (w) => !bids.some((b) => b.jobId === targetOrder.id && b.workerId === w.id)
    );
    const workerToBid = availableWorkers.length > 0 ? availableWorkers[0] : workers[1];

    const bidAmounts = [1850, 1950, 2100, 2250, 2400];
    const randomAmount = bidAmounts[Math.floor(Math.random() * bidAmounts.length)];

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId: targetOrder.id,
      workerId: workerToBid.id,
      workerName: workerToBid.name,
      workerAvatar: workerToBid.avatar,
      workerRating: workerToBid.rating,
      workerJobsCompleted: workerToBid.jobsCompleted,
      amount: randomAmount,
      proposedTime: 'Will arrive 8:30 AM with tools',
      notes: 'Available immediately. High experience in this task.',
      status: 'pending',
      createdAt: 'Just now',
    };

    setBids((prev) => [newBid, ...prev]);
    setStats((prev) => ({ ...prev, totalBids: prev.totalBids + 1 }));

    addNotification(
      '⚡ Live Worker Bid Received!',
      `${workerToBid.name} placed a bid of ₹${randomAmount.toLocaleString()} on ${targetOrder.orderNumber}`,
      'bid'
    );

    api.simulateIncomingBid().catch(() => {});
  };

  const resetDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setWorkers(INITIAL_WORKERS);
    setOrders(INITIAL_ORDERS);
    setBids(INITIAL_BIDS);
    setCommission(INITIAL_COMMISSION);
    setStats(INITIAL_STATS);
    setSelectedJobId('job-1045');
    addNotification('Demo Reset', 'All records restored to initial showcase state', 'info');
    api.resetBackend().catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        adminTab,
        setAdminTab,
        customerScreen,
        setCustomerScreen,
        employeeScreen,
        setEmployeeScreen,
        usePhoneFrame,
        setUsePhoneFrame,
        selectedJobId,
        setSelectedJobId,
        activeWorkerId,
        setActiveWorkerId,
        categories,
        workers,
        orders,
        bids,
        commission,
        stats,
        notifications,
        adminAuth,
        customerAuth,
        employeeAuth,
        loginAdmin,
        loginCustomer,
        loginEmployee,
        signOut,
        switchWorkerAccount,
        backendConnected,
        backendHealth,
        syncingWithBackend,
        refreshBackend,
        toggleCategoryStatus,
        addCategory,
        toggleWorkerAvailability,
        postJob,
        submitBid,
        acceptBid,
        declineBid,
        updateCommission,
        simulateIncomingBid,
        resetDemoData,
        dismissNotification,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
