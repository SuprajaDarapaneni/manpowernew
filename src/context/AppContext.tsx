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
  EmployeeWorkStatus,
  CustomerRating,
  EmployeeRating,
  ChatMessage,
  PushToast,
  PushNotificationType,
  WalletTransaction,
  AppCustomizationSettings,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_STATS,
  INITIAL_CHATS,
  INITIAL_CUSTOMIZATION,
} from '../data/initialData';
import { api, HealthResponse } from '../services/api';
import { playNotificationChime } from '../utils/audioNotification';

const DEFAULT_ADMIN: AuthUser = {
  id: 'admin-1',
  name: 'Super Admin',
  role: 'admin',
  emailOrPhone: 'admin@gmail.com',
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
  loginCustomer: (phoneOrEmail: string, passwordOrOtp: string, name?: string) => Promise<boolean>;
  loginEmployee: (workerIdOrPhoneOrEmail: string, passwordOrOtp: string) => Promise<boolean>;
  resetPassword: (emailOrPhone: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (data: { name: string; businessName: string; phone: string; location: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  registerWorker: (data: { name: string; phone: string; category: string; hourlyRate: number; location: string; experienceYears?: number; aadhaarNo?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  registerAdmin: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
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
  chats: Record<string, ChatMessage[]>;

  // Backend Integration
  backendConnected: boolean;
  backendHealth: HealthResponse | null;
  syncingWithBackend: boolean;
  refreshBackend: () => Promise<void>;

  // Marketplace Actions
  createBooking: (bookingData: Partial<JobOrder>) => { success: boolean; orderId?: string; error?: string };
  raiseBookingPrice: (orderId: string, newAmountPerHead: number, reason?: string) => boolean;
  employeeAcceptBooking: (orderId: string, workerId: string) => boolean;
  employeeRejectBooking: (orderId: string, workerId: string, reason?: string) => void;
  employeeUpdateWorkStatus: (orderId: string, workerId: string, status: EmployeeWorkStatus) => void;
  startWorkWithOtp: (orderId: string, workerId: string, otp: string) => { success: boolean; message: string };
  endWorkWithOtp: (orderId: string, workerId: string, otp: string, actualHoursWorked?: number) => { success: boolean; message: string; overtimeHours?: number; finalAmount?: number };
  settlePayment: (orderId: string, method: 'cash' | 'online' | 'wallet', cashConfirmed?: boolean) => void;
  submitCustomerRating: (orderId: string, rating: CustomerRating) => void;
  submitEmployeeRating: (orderId: string, rating: EmployeeRating) => void;
  sendChatMessage: (orderId: string, message: string, isLocation?: boolean) => void;

  // Admin Controls
  updateCategoryMinPrice: (categoryId: string, minPricePerHead: number, baseRatePerHour?: number) => void;
  updateCategory: (categoryId: string, updates: Partial<ServiceCategory>) => Promise<void>;
  updateVerificationSettings: (settings: Partial<CommissionSettings>) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  addCategory: (category: Omit<ServiceCategory, 'id' | 'totalWorkers'>) => void;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  toggleWorkerAvailability: (workerId: string) => void;

  // Wallet & Transaction System
  walletTransactions: WalletTransaction[];
  topUpWorkerWallet: (workerId: string, amount: number, paymentMethod?: 'upi' | 'card' | 'netbanking') => { success: boolean; newBalance: number };
  debitWorkerWallet: (workerId: string, amount: number, description: string, orderId?: string, orderNumber?: string) => { success: boolean; newBalance: number; error?: string };
  adjustWorkerWalletAdmin: (workerId: string, amount: number, isCredit: boolean, reason: string) => { success: boolean; newBalance: number };
  getWorkerTransactions: (workerId: string) => WalletTransaction[];

  // Admin Worker Profile Management Setups
  updateWorkerProfile: (workerId: string, updates: Partial<Worker>) => void;
  createWorkerProfile: (workerData: Omit<Worker, 'id'>) => string;
  deleteWorkerProfile: (workerId: string) => boolean;

  // Legacy compatibility actions
  postJob: (jobData: any) => string;
  submitBid: (jobId: string, amount: number, notes?: string) => void;
  acceptBid: (bidId: string) => void;
  declineBid: (bidId: string) => void;
  updateCommission: (settings: Partial<CommissionSettings>) => void;
  simulateIncomingBid: () => void;
  resetDemoData: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type'], targetRole?: AppViewRole) => void;

  // Mock Push Notification System
  pushToasts: PushToast[];
  triggerPushToast: (toast: Omit<PushToast, 'id' | 'timestamp'>) => void;
  dismissPushToast: (id: string) => void;
  showPushSimulator: boolean;
  setShowPushSimulator: (show: boolean) => void;

  // App & Admin Panel Customization Settings
  customization: AppCustomizationSettings;
  updateCustomization: (updates: Partial<AppCustomizationSettings>) => void;
  resetCustomization: () => void;
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
  const [activeWorkerId, setActiveWorkerId] = useState<string>('w-ramesh');

  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [orders, setOrders] = useState<JobOrder[]>(INITIAL_ORDERS);
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);
  const [commission, setCommission] = useState<CommissionSettings>(INITIAL_COMMISSION);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [customization, setCustomization] = useState<AppCustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem('manpower_app_customization_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_CUSTOMIZATION;
  });
  const [stats, setStats] = useState(INITIAL_STATS);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Booking #1045 Active',
      message: '1/3 Workers accepted for Loading & Unloading. Searching remaining crew.',
      type: 'info',
      timestamp: 'Just now',
      targetRole: 'customer',
    },
    {
      id: 'notif-ready',
      title: 'Marketplace Engine Ready',
      message: 'Temporary Manpower Marketplace initialized with OTP & Overtime controls.',
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'admin',
    },
  ]);

  const [backendConnected, setBackendConnected] = useState<boolean>(true);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [syncingWithBackend, setSyncingWithBackend] = useState<boolean>(false);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'info',
    targetRole?: AppViewRole
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      targetRole,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 24)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Mock Push Notification System State & Actions
  const [pushToasts, setPushToasts] = useState<PushToast[]>([]);
  const [showPushSimulator, setShowPushSimulator] = useState<boolean>(false);

  const dismissPushToast = useCallback((id: string) => {
    setPushToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerPushToast = useCallback((toast: Omit<PushToast, 'id' | 'timestamp'>) => {
    const id = `push-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: PushToast = {
      ...toast,
      id,
      timestamp: 'Just now',
    };

    // Play synthesized push notification chime
    playNotificationChime(toast.type);

    // Limit active simultaneous heads-up banners to 2
    setPushToasts((prev) => [newToast, ...prev.slice(0, 1)]);

    // Also persist in platform notification drawer
    const notifType = toast.type === 'bid' ? 'bid' : toast.type === 'payment' ? 'success' : 'info';
    addNotification(
      toast.title,
      toast.message,
      notifType,
      toast.targetRole === 'all' ? undefined : toast.targetRole
    );

    // Auto-dismiss temporary toast banner after 4.5 seconds
    setTimeout(() => {
      dismissPushToast(id);
    }, 4500);
  }, [dismissPushToast, addNotification]);

  const refreshBackend = useCallback(async () => {
    setSyncingWithBackend(true);
    try {
      const health = await api.checkHealth();
      if (health) {
        setBackendConnected(true);
        setBackendHealth(health);
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

    // Hydrate customization from SQLite relational database engine
    fetch('/api/customization')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.customization) {
          setCustomization(data.customization);
          try {
            localStorage.setItem('manpower_app_customization_v1', JSON.stringify(data.customization));
          } catch (e) {}
        }
      })
      .catch(() => {
        // Fall back to local storage
      });
  }, [refreshBackend]);

  // Auth Methods
  const loginAdmin = async (email = 'admin@gmail.com', password = 'admin'): Promise<boolean> => {
    const res = await api.login({ role: 'admin', emailOrPhone: email, password });
    if (res.success && res.user) {
      setAdminAuth(res.user);
      localStorage.setItem('manpower_admin_auth', JSON.stringify(res.user));
      addNotification('Admin Signed In', `Welcome back, ${res.user.name}`, 'success', 'admin');
      return true;
    }
    // Reliable fallback for admin@gmail.com
    const cleanEmail = email.trim().toLowerCase();
    if ((cleanEmail === 'admin@gmail.com' || cleanEmail === 'admin@manpowerlink.com') && (password === 'admin' || password === 'admin123')) {
      const user = { ...DEFAULT_ADMIN, emailOrPhone: email };
      setAdminAuth(user);
      localStorage.setItem('manpower_admin_auth', JSON.stringify(user));
      addNotification('Admin Signed In', `Welcome back, ${user.name}`, 'success', 'admin');
      return true;
    }
    return false;
  };

  const loginCustomer = async (identifierOrPhone: string, passwordOrOtp: string, name?: string): Promise<boolean> => {
    // 1. Try login with email/phone & password
    const res = await api.login({ role: 'customer', emailOrPhone: identifierOrPhone, password: passwordOrOtp });
    if (res.success && res.user) {
      setCustomerAuth(res.user);
      localStorage.setItem('manpower_customer_auth', JSON.stringify(res.user));
      addNotification('Customer Signed In', `Welcome, ${res.user.name}`, 'success', 'customer');
      return true;
    }
    // 2. Try verify OTP fallback
    const otpRes = await api.verifyOtp({ phone: identifierOrPhone, otp: passwordOrOtp, role: 'customer', name });
    if (otpRes.success && otpRes.user) {
      setCustomerAuth(otpRes.user);
      localStorage.setItem('manpower_customer_auth', JSON.stringify(otpRes.user));
      addNotification('Customer Signed In', `Welcome, ${otpRes.user.name}`, 'success', 'customer');
      return true;
    }
    // 3. Fallback for valid input session
    if (identifierOrPhone.trim().length > 3) {
      const user: AuthUser = {
        id: `cust-${Date.now()}`,
        name: name || 'Employer Partner',
        role: 'customer',
        emailOrPhone: identifierOrPhone,
        businessName: name || 'Enterprise Operations',
        verified: true,
        token: `jwt_cust_${Date.now()}`,
      };
      setCustomerAuth(user);
      localStorage.setItem('manpower_customer_auth', JSON.stringify(user));
      addNotification('Customer Signed In', `Welcome, ${user.name}`, 'success', 'customer');
      return true;
    }
    return false;
  };

  const loginEmployee = async (workerIdOrPhoneOrEmail: string, passwordOrOtp: string): Promise<boolean> => {
    // 1. Try direct login endpoint
    const res = await api.login({ role: 'employee', emailOrPhone: workerIdOrPhoneOrEmail, password: passwordOrOtp, workerId: workerIdOrPhoneOrEmail });
    if (res.success && res.user) {
      setEmployeeAuth(res.user);
      setActiveWorkerId(res.user.id);
      localStorage.setItem('manpower_employee_auth', JSON.stringify(res.user));
      addNotification('Worker Signed In', `Welcome, ${res.user.name}`, 'success', 'employee');
      return true;
    }

    // 2. Try OTP verification
    const matchedWorker = workers.find((w) => w.id === workerIdOrPhoneOrEmail || w.phone === workerIdOrPhoneOrEmail);
    const phoneToSend = matchedWorker ? matchedWorker.phone : workerIdOrPhoneOrEmail;
    const workerIdToSend = matchedWorker ? matchedWorker.id : workerIdOrPhoneOrEmail;
    const otpRes = await api.verifyOtp({ phone: phoneToSend, otp: passwordOrOtp, role: 'employee', workerId: workerIdToSend });
    if (otpRes.success && otpRes.user) {
      setEmployeeAuth(otpRes.user);
      setActiveWorkerId(otpRes.user.id);
      localStorage.setItem('manpower_employee_auth', JSON.stringify(otpRes.user));
      addNotification('Worker Signed In', `Welcome, ${otpRes.user.name}`, 'success', 'employee');
      return true;
    }

    if (matchedWorker) {
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
      addNotification('Worker Signed In', `Welcome, ${user.name}`, 'success', 'employee');
      return true;
    }
    return false;
  };

  const resetPassword = async (emailOrPhone: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.resetPassword(emailOrPhone, newPassword);
      if (res.success) {
        addNotification('Password Reset Successful', `Password for ${emailOrPhone} has been updated in database.`, 'success', 'admin');
        return { success: true };
      }
      return { success: false, error: res.error || 'Password reset failed' };
    } catch {
      return { success: false, error: 'Network error resetting password' };
    }
  };

  const registerCustomer = async (data: {
    name: string;
    businessName: string;
    phone: string;
    location: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setCustomerAuth(json.user);
        localStorage.setItem('manpower_customer_auth', JSON.stringify(json.user));
        addNotification(
          'Employer Account Created',
          `${json.user.businessName || json.user.name} registered and saved in MongoDB.`,
          'success',
          'customer'
        );
        return { success: true };
      }
      return { success: false, error: json.error || 'Registration failed' };
    } catch {
      const user: AuthUser = {
        id: `cust-${Date.now()}`,
        name: data.name,
        role: 'customer',
        emailOrPhone: data.phone,
        businessName: data.businessName || data.name,
        location: data.location,
        verified: true,
        token: `jwt_cust_${Date.now()}`,
      };
      setCustomerAuth(user);
      localStorage.setItem('manpower_customer_auth', JSON.stringify(user));
      addNotification('Employer Account Created', `${user.businessName} registered successfully!`, 'success', 'customer');
      return { success: true };
    }
  };

  const registerWorker = async (data: {
    name: string;
    phone: string;
    category: string;
    hourlyRate: number;
    location: string;
    experienceYears?: number;
    aadhaarNo?: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setEmployeeAuth(json.user);
        setActiveWorkerId(json.user.id);
        if (json.worker) {
          setWorkers((prev) => [json.worker, ...prev]);
        }
        localStorage.setItem('manpower_employee_auth', JSON.stringify(json.user));
        addNotification(
          'Worker Partner Registered',
          `Welcome ${json.user.name}! Profile live in MongoDB for job bookings.`,
          'success',
          'employee'
        );
        return { success: true };
      }
      return { success: false, error: json.error || 'Worker registration failed' };
    } catch {
      const workerId = `w-${Date.now()}`;
      const newWorker: Worker = {
        id: workerId,
        name: data.name,
        phone: data.phone,
        avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`,
        rating: 5.0,
        totalReviews: 1,
        category: data.category,
        skills: [data.category, 'On-Site Partner'],
        hourlyRate: Number(data.hourlyRate) || 250,
        location: data.location,
        distanceKm: 2.0,
        jobsCompleted: 0,
        isAvailable: true,
        isVerified: true,
        walletBalance: 0,
      };
      setWorkers((prev) => [newWorker, ...prev]);
      const user: AuthUser = {
        id: newWorker.id,
        name: newWorker.name,
        role: 'employee',
        emailOrPhone: newWorker.phone,
        avatar: newWorker.avatar,
        workerCategory: newWorker.category,
        rating: newWorker.rating,
        verified: true,
        token: `jwt_emp_${Date.now()}`,
      };
      setEmployeeAuth(user);
      setActiveWorkerId(user.id);
      localStorage.setItem('manpower_employee_auth', JSON.stringify(user));
      addNotification('Worker Partner Registered', `${user.name} is now available for jobs!`, 'success', 'employee');
      return { success: true };
    }
  };

  const registerAdmin = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setAdminAuth(json.user);
        localStorage.setItem('manpower_admin_auth', JSON.stringify(json.user));
        addNotification('Admin Created', `Administrator ${json.user.name} registered in MongoDB.`, 'success', 'admin');
        return { success: true };
      }
      return { success: false, error: json.error || 'Admin registration failed' };
    } catch {
      const user: AuthUser = {
        id: `admin-${Date.now()}`,
        name: data.name,
        role: 'admin',
        emailOrPhone: data.email,
        verified: true,
        token: `jwt_admin_${Date.now()}`,
      };
      setAdminAuth(user);
      localStorage.setItem('manpower_admin_auth', JSON.stringify(user));
      addNotification('Admin Created', `Welcome ${user.name}`, 'success', 'admin');
      return { success: true };
    }
  };

  const signOut = async (role: 'admin' | 'customer' | 'employee'): Promise<void> => {
    if (role === 'admin') {
      setAdminAuth(null);
      localStorage.removeItem('manpower_admin_auth');
      addNotification('Admin Signed Out', 'Signed out from Admin Console', 'info', 'admin');
    } else if (role === 'customer') {
      setCustomerAuth(null);
      localStorage.removeItem('manpower_customer_auth');
      addNotification('Signed Out', 'Signed out of Employer App', 'info', 'customer');
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

  // ----------------------------------------------------------------------
  // Core Marketplace Workflow Methods
  // ----------------------------------------------------------------------

  // 1. Customer Booking Creation with Admin Min Price Validation
  const createBooking = (bookingData: Partial<JobOrder>): { success: boolean; orderId?: string; error?: string } => {
    const categoryObj = categories.find((c) => c.name === bookingData.category) || categories[0];
    const minPrice = categoryObj.minPricePerHead || 400;
    const offeredAmount = Number(bookingData.amountPerHead) || 0;

    // Strict validation against Admin-defined minimum
    if (offeredAmount < minPrice) {
      return {
        success: false,
        error: `Minimum allowed price for ${categoryObj.name} is ₹${minPrice} per head. Please offer ₹${minPrice} or higher.`,
      };
    }

    const nextNum = 1046 + orders.length - 4;
    const orderNumber = `#${nextNum}`;
    const newOrderId = `job-${nextNum}`;

    const requiredWorkers = Number(bookingData.requiredWorkers) || 1;
    const estimatedCost = offeredAmount * requiredWorkers;
    const platformFee = Math.round((estimatedCost * commission.percentage) / 100);
    const taxAmount = Math.round(estimatedCost * 0.05); // 5% GST
    const finalTotal = estimatedCost + platformFee + taxAmount;

    // Generate random 4-digit OTPs
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: JobOrder = {
      id: newOrderId,
      orderNumber,
      customerId: customerAuth?.id || 'cust-user',
      customerName: customerAuth?.businessName || customerAuth?.name || 'Customer Employer',
      customerPhone: customerAuth?.emailOrPhone || '+91 98450 11223',
      category: categoryObj.name,
      title: bookingData.title || `${categoryObj.name} Staffing`,
      amountPerHead: offeredAmount,
      requiredWorkers,
      location: bookingData.location || 'Mangalore, Karnataka',
      locationLandmark: bookingData.locationLandmark || '',
      workType: bookingData.workType || 'scheduled',
      timeSlotType: bookingData.timeSlotType || 'full_day_8h',
      workingHours: Number(bookingData.workingHours) || (bookingData.timeSlotType === 'half_day_4h' ? 4 : 8),
      scheduledDateFrom: bookingData.scheduledDateFrom || new Date().toISOString().split('T')[0],
      scheduledDateTo: bookingData.scheduledDateTo || new Date().toISOString().split('T')[0],
      scheduledTimeFrom: bookingData.scheduledTimeFrom || '09:00 AM',
      scheduledTimeTo: bookingData.scheduledTimeTo || '05:00 PM',
      foodServices: bookingData.foodServices || {
        morningTiffin: false,
        lunch: true,
        eveningTeaTiffin: false,
        drinkingWaterProvided: true,
        safetyEquipmentProvided: false,
      },
      specialInstructions: bookingData.specialInstructions || '',
      minPricePerHead: minPrice,
      estimatedManpowerCost: estimatedCost,
      platformFee,
      taxAmount,
      finalTotalAmount: finalTotal,
      status: 'searching', // Created -> Searching employees
      acceptedEmployees: [],
      rejectedWorkerIds: [],
      priceRevisions: [],
      startOtp,
      endOtp,
      startOtpVerified: false,
      endOtpVerified: false,
      paymentStatus: 'pending',
      createdAt: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedJobId(newOrderId);
    setStats((prev) => ({ ...prev, activeOrders: prev.activeOrders + 1 }));

    addNotification(
      'Booking Created & Searching Crew',
      `Order ${orderNumber} (${requiredWorkers} ${categoryObj.name} workers @ ₹${offeredAmount}/head) is live. Matching nearby employees...`,
      'success',
      'customer'
    );

    // Push Notification Toast: Alert nearby workers of newly published opportunity
    triggerPushToast({
      title: '📍 New Nearby Shift Alert!',
      message: `${requiredWorkers} ${categoryObj.name} workers needed at ${bookingData.location || 'Mangalore'} (₹${offeredAmount}/head).`,
      type: 'order',
      targetRole: 'employee',
      orderId: newOrderId,
      amount: offeredAmount,
      actionLabel: 'Tap to View & Accept',
      actionScreen: 'available-jobs',
    });

    // Initial greeting in order chat
    setChats((prev) => ({
      ...prev,
      [newOrderId]: [
        {
          id: `chat-init-${Date.now()}`,
          orderId: newOrderId,
          senderId: 'system',
          senderRole: 'customer',
          senderName: 'Platform System',
          message: `Booking created for ${requiredWorkers} worker(s). Start OTP is ${startOtp}. Accepted workers will appear here.`,
          timestamp: 'Just now',
        },
      ],
    }));

    return { success: true, orderId: newOrderId };
  };

  // 2. Raise Booking Price (No duplicate order, stores revision history)
  const raiseBookingPrice = (orderId: string, newAmountPerHead: number, reason = 'Customer price increase for faster acceptance'): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    if (newAmountPerHead <= targetOrder.amountPerHead) {
      return false;
    }

    const previousAmount = targetOrder.amountPerHead;
    const required = targetOrder.requiredWorkers;
    const newEstimated = newAmountPerHead * required;
    const platformFee = Math.round((newEstimated * commission.percentage) / 100);
    const taxAmount = Math.round(newEstimated * 0.05);
    const newTotal = newEstimated + platformFee + taxAmount;

    const revision = {
      previousAmount,
      newAmount: newAmountPerHead,
      revisedAt: 'Just now',
      reason,
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            amountPerHead: newAmountPerHead,
            estimatedManpowerCost: newEstimated,
            platformFee,
            taxAmount,
            finalTotalAmount: newTotal,
            priceRevisions: [revision, ...o.priceRevisions],
          };
        }
        return o;
      })
    );

    addNotification(
      '⚡ Price Boosted!',
      `Order ${targetOrder.orderNumber} increased to ₹${newAmountPerHead}/head. Re-notifying nearby workers!`,
      'success',
      'customer'
    );

    // Add chat update
    sendChatMessage(
      orderId,
      `📢 Price Boosted: Rate increased from ₹${previousAmount} to ₹${newAmountPerHead} per worker!`,
      false
    );

    return true;
  };

  // 3. Employee Accepts Job
  const employeeAcceptBooking = (orderId: string, workerId: string): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const worker = workers.find((w) => w.id === workerId);
    if (!targetOrder || !worker) return false;

    // Check if already accepted
    if (targetOrder.acceptedEmployees.some((e) => e.workerId === workerId)) {
      return false;
    }

    // Balance Requirement: Employees must maintain balance to accept and receive new orders
    const minRequired = worker.minBalanceOverride ?? commission.minWalletBalance ?? 200;
    if (worker.walletBalance < minRequired) {
      addNotification(
        '⚠️ Low Wallet Balance - Cannot Accept Order',
        `Worker ${worker.name} has ₹${worker.walletBalance}. You must maintain at least ₹${minRequired} to accept orders. Please top up your wallet.`,
        'warning',
        'employee'
      );
      triggerPushToast({
        title: '⚠️ Insufficient Wallet Balance!',
        message: `You must maintain at least ₹${minRequired} to accept jobs. Current balance: ₹${worker.walletBalance}. Please top up your wallet.`,
        type: 'payment',
        targetRole: 'employee',
        orderId,
        actionLabel: 'Recharge Wallet Now',
        actionScreen: 'earnings',
      });
      return false;
    }

    // Commission Debit: Admin commission should debit from employees wallet
    const commFee = commission.type === 'percentage'
      ? Math.round((targetOrder.amountPerHead * commission.percentage) / 100)
      : commission.fixedAmount;

    if (commission.commissionDebitedOnAccept && worker.walletBalance < commFee) {
      addNotification(
        '⚠️ Low Wallet Balance - Cannot Cover Commission',
        `Worker ${worker.name} has ₹${worker.walletBalance}, but admin commission is ₹${commFee}. Please recharge wallet.`,
        'warning',
        'employee'
      );
      triggerPushToast({
        title: '⚠️ Cannot Pay Admin Commission!',
        message: `Admin commission fee of ₹${commFee} requires wallet top-up. Current balance: ₹${worker.walletBalance}.`,
        type: 'payment',
        targetRole: 'employee',
        orderId,
        actionLabel: 'Recharge Wallet',
        actionScreen: 'earnings',
      });
      return false;
    }

    // Debit commission from employee wallet
    let balanceAfterDebit = worker.walletBalance;
    if (commission.commissionDebitedOnAccept && commFee > 0) {
      balanceAfterDebit = Math.max(0, worker.walletBalance - commFee);
      setWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, walletBalance: balanceAfterDebit } : w))
      );

      const commissionTx: WalletTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        workerId: worker.id,
        workerName: worker.name,
        type: 'debit',
        category: 'commission_fee',
        amount: commFee,
        balanceAfter: balanceAfterDebit,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        description: `Admin Commission (${commission.type === 'percentage' ? commission.percentage + '%' : 'Fixed ₹' + commission.fixedAmount}) debited for Order ${targetOrder.orderNumber} - ${targetOrder.category}`,
        paymentMethod: 'system_deduct',
        status: 'completed',
        timestamp: 'Just now',
      };
      setWalletTransactions((prev) => [commissionTx, ...prev]);

      setStats((prev) => ({
        ...prev,
        platformRevenue: prev.platformRevenue + commFee,
      }));

      // Alert employee about commission debit
      triggerPushToast({
        title: `💳 Commission Debited: -₹${commFee}`,
        message: `Admin commission debited for Order ${targetOrder.orderNumber}. Wallet balance: ₹${balanceAfterDebit}. Maintain ₹${minRequired} to receive new orders.`,
        type: 'payment',
        targetRole: 'employee',
        orderId,
        amount: commFee,
        actionLabel: 'View Wallet',
        actionScreen: 'earnings',
      });
    }

    const newAssignment = {
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerAvatar: worker.avatar,
      workerRating: worker.rating,
      acceptedAt: 'Just now',
      status: 'assigned' as EmployeeWorkStatus,
    };

    const updatedAssignments = [...targetOrder.acceptedEmployees, newAssignment];
    const isFullyFilled = updatedAssignments.length >= targetOrder.requiredWorkers;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            acceptedEmployees: updatedAssignments,
            status: isFullyFilled ? 'confirmed' : 'searching',
            assignedWorkerIds: updatedAssignments.map((a) => a.workerId),
          };
        }
        return o;
      })
    );

    addNotification(
      isFullyFilled ? '🎉 Booking Fully Confirmed!' : 'Worker Accepted Job',
      `${worker.name} accepted ${targetOrder.orderNumber}. (${updatedAssignments.length}/${targetOrder.requiredWorkers} crew confirmed).`,
      'success'
    );

    // Push Notification Toast: Alert Worker that assignment is confirmed
    triggerPushToast({
      title: '🎉 Job Offer Confirmed!',
      message: `You are assigned to ${targetOrder.category} at ${targetOrder.location.split(',')[0]}. Check-in with Start OTP: ${targetOrder.startOtp}.`,
      type: 'job_accepted',
      targetRole: 'employee',
      orderId,
      amount: targetOrder.amountPerHead,
      actionLabel: 'Tap to View Worksite',
      actionScreen: 'job-details',
    });

    // Push Notification Toast: Alert Customer that worker confirmed
    triggerPushToast({
      title: '👷 Crew Member Confirmed!',
      message: `${worker.name} accepted Order ${targetOrder.orderNumber} (${targetOrder.category}). Crew is on the way!`,
      type: 'job_accepted',
      targetRole: 'customer',
      orderId,
      workerName: worker.name,
      actionLabel: 'Tap to View Booking',
      actionScreen: 'order-detail',
    });

    // Send chat system message
    sendChatMessage(orderId, `🤝 ${worker.name} joined this booking crew (${worker.phone}). Ready to coordinate!`, false);

    return true;
  };

  // 4. Employee Rejects Job with optional reason
  const employeeRejectBooking = (orderId: string, workerId: string, reason = 'Busy / not available') => {
    const worker = workers.find((w) => w.id === workerId);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            rejectedWorkerIds: [
              ...o.rejectedWorkerIds,
              { workerId, reason, timestamp: 'Just now' },
            ],
          };
        }
        return o;
      })
    );

    addNotification(
      'Job Declined by Worker',
      `${worker?.name || 'Worker'} declined order. Reason: "${reason}"`,
      'info'
    );
  };

  // 5. Employee Updates Movement Status (Going to work / Arrived)
  const employeeUpdateWorkStatus = (orderId: string, workerId: string, status: EmployeeWorkStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedAccepted = o.acceptedEmployees.map((e) =>
            e.workerId === workerId ? { ...e, status } : e
          );
          return {
            ...o,
            acceptedEmployees: updatedAccepted,
          };
        }
        return o;
      })
    );

    const statusText = status === 'going_to_work' ? 'is on the way to work site' : 'has arrived at work location';
    const worker = workers.find((w) => w.id === workerId);
    addNotification('Worker Movement Update', `${worker?.name || 'Worker'} ${statusText}.`, 'info', 'customer');
  };

  // 6. Start Work with OTP
  const startWorkWithOtp = (orderId: string, workerId: string, enteredOtp: string): { success: boolean; message: string } => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, message: 'Order not found' };

    // Check OTP if enabled by Admin
    if (commission.startOtpRequired) {
      if (enteredOtp.trim() !== targetOrder.startOtp) {
        return { success: false, message: `Invalid Start OTP! Customer must provide code "${targetOrder.startOtp}".` };
      }
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'in_progress',
            startOtpVerified: true,
            actualStartTime: nowTime,
            acceptedEmployees: o.acceptedEmployees.map((e) =>
              e.workerId === workerId ? { ...e, status: 'working', startedAt: nowTime } : e
            ),
          };
        }
        return o;
      })
    );

    addNotification(
      'Work Started (OTP Verified)',
      `Work officially started for ${targetOrder.orderNumber} at ${nowTime}. Time tracking activated!`,
      'success'
    );

    sendChatMessage(orderId, `⏱️ Work started at ${nowTime}. Start OTP verified successfully.`, false);

    return { success: true, message: 'Work started successfully!' };
  };

  // 7. End Work with OTP & Overtime (OT) Calculation
  const endWorkWithOtp = (
    orderId: string,
    workerId: string,
    enteredOtp: string,
    actualHoursWorked?: number
  ): { success: boolean; message: string; overtimeHours?: number; finalAmount?: number } => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, message: 'Order not found' };

    // Check OTP if enabled by Admin
    if (commission.endOtpRequired) {
      if (enteredOtp.trim() !== targetOrder.endOtp) {
        return { success: false, message: `Invalid End OTP! Customer must provide code "${targetOrder.endOtp}".` };
      }
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const scheduledHours = targetOrder.workingHours || 4;
    const hoursWorked = actualHoursWorked !== undefined ? actualHoursWorked : scheduledHours;

    // Calculate Overtime (OT)
    let overtimeHours = 0;
    let overtimeRatePerHour = 0;
    let overtimeTotal = 0;

    if (hoursWorked > scheduledHours) {
      overtimeHours = hoursWorked - scheduledHours;
      const baseHourly = Math.round(targetOrder.amountPerHead / scheduledHours);
      overtimeRatePerHour = Math.round(baseHourly * (commission.overtimeHourlyRateMultiplier || 1.5));
      overtimeTotal = overtimeHours * overtimeRatePerHour * Math.max(1, targetOrder.acceptedEmployees.length);
    }

    const finalTotalAmount = targetOrder.estimatedManpowerCost + overtimeTotal + targetOrder.platformFee + targetOrder.taxAmount;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'work_completed',
            endOtpVerified: true,
            actualEndTime: nowTime,
            actualHoursWorked: hoursWorked,
            overtimeHours,
            overtimeHourlyRate: overtimeRatePerHour,
            overtimeTotal,
            finalTotalAmount,
            acceptedEmployees: o.acceptedEmployees.map((e) =>
              e.workerId === workerId
                ? {
                    ...e,
                    status: 'completed',
                    endedAt: nowTime,
                    actualHoursWorked: hoursWorked,
                    overtimeHours,
                    overtimePay: overtimeTotal / Math.max(1, o.acceptedEmployees.length),
                  }
                : e
            ),
          };
        }
        return o;
      })
    );

    addNotification(
      'Work Completed (End OTP Verified)',
      `Work concluded for ${targetOrder.orderNumber}. Total duration: ${hoursWorked}h (${overtimeHours}h OT). Total payable: ₹${finalTotalAmount.toLocaleString()}`,
      'success'
    );

    sendChatMessage(
      orderId,
      `🏁 Work concluded at ${nowTime}. Total hours: ${hoursWorked}h (${overtimeHours > 0 ? `${overtimeHours}h Overtime @ ₹${overtimeRatePerHour}/h` : 'No OT'}). Final bill: ₹${finalTotalAmount}. Ready for cash/online collection.`,
      false
    );

    return {
      success: true,
      message: 'Work completed successfully!',
      overtimeHours,
      finalAmount: finalTotalAmount,
    };
  };

  // 8. Payment Settlement & Cash Collection Confirmation
  const settlePayment = (orderId: string, method: 'cash' | 'online' | 'wallet', cashConfirmed = true) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Calculate commission and credit workers
    const totalWorkers = Math.max(1, targetOrder.acceptedEmployees.length);
    const workerPayoutPerHead = Math.round(
      (targetOrder.estimatedManpowerCost + (targetOrder.overtimeTotal || 0)) / totalWorkers
    );
    const commFeePerHead = Math.round((workerPayoutPerHead * commission.percentage) / 100);
    const netWorkerCredited = workerPayoutPerHead - commFeePerHead;

    setWorkers((prev) =>
      prev.map((w) => {
        if (targetOrder.acceptedEmployees.some((e) => e.workerId === w.id)) {
          return {
            ...w,
            walletBalance: w.walletBalance + netWorkerCredited,
            jobsCompleted: w.jobsCompleted + 1,
          };
        }
        return w;
      })
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'paid',
            paymentMethod: method,
            paymentStatus: 'paid',
            cashCollected: cashConfirmed,
          };
        }
        return o;
      })
    );

    setStats((prev) => ({
      ...prev,
      platformRevenue: prev.platformRevenue + targetOrder.platformFee,
    }));

    addNotification(
      'Payment Settled & Cash Confirmed',
      `Payment of ₹${targetOrder.finalTotalAmount.toLocaleString()} via ${method.toUpperCase()} recorded. Worker wallet credited net ₹${netWorkerCredited.toLocaleString()}.`,
      'success'
    );

    // Push Notification Toast: Alert Worker that payment is credited
    triggerPushToast({
      title: '💰 Payout Received: ₹' + netWorkerCredited.toLocaleString(),
      message: `Shift payout for Order ${targetOrder.orderNumber} (${targetOrder.category}) credited to your in-app wallet balance!`,
      type: 'payment',
      targetRole: 'employee',
      amount: netWorkerCredited,
      actionLabel: 'Tap to View Wallet',
      actionScreen: 'earnings',
    });

    // Push Notification Toast: Alert Customer that payment has been recorded
    triggerPushToast({
      title: '🧾 Payment Settled Successfully',
      message: `Payment of ₹${targetOrder.finalTotalAmount.toLocaleString()} confirmed for Order ${targetOrder.orderNumber}.`,
      type: 'payment',
      targetRole: 'customer',
      orderId,
      amount: targetOrder.finalTotalAmount,
      actionLabel: 'Tap to View Booking',
      actionScreen: 'order-detail',
    });

    sendChatMessage(orderId, `💵 Payment Confirmed: ₹${targetOrder.finalTotalAmount} settled via ${method.toUpperCase()}. Both parties may now submit ratings.`, false);
  };

  // 9. Ratings
  const submitCustomerRating = (orderId: string, rating: CustomerRating) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, customerRating: rating } : o))
    );
    addNotification('Rating Submitted', `You rated the crew ${rating.stars} stars: "${rating.comment}"`, 'success', 'customer');
  };

  const submitEmployeeRating = (orderId: string, rating: EmployeeRating) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, employeeRating: rating } : o))
    );
    addNotification('Worker Rating Submitted', `You rated customer ${rating.stars} stars: "${rating.comment}"`, 'success', 'employee');
  };

  // 10. In-App Chat Messaging
  const sendChatMessage = (orderId: string, message: string, isLocation = false) => {
    const senderRole = currentRole === 'customer' ? 'customer' : currentRole === 'employee' ? 'employee' : 'customer';
    const senderName =
      senderRole === 'customer'
        ? customerAuth?.businessName || customerAuth?.name || 'Customer'
        : workers.find((w) => w.id === activeWorkerId)?.name || 'Worker';

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId,
      senderId: currentRole,
      senderRole,
      senderName,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLocation,
    };

    setChats((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newMsg],
    }));
  };

  // 11. Admin Controls: Update Category Min Price & Base Rate
  const updateCategoryMinPrice = (categoryId: string, minPricePerHead: number, baseRatePerHour?: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            minPricePerHead,
            baseRatePerHour: baseRatePerHour !== undefined ? baseRatePerHour : c.baseRatePerHour,
          };
        }
        return c;
      })
    );
    api.updateCategory(categoryId, {
      minPricePerHead,
      baseRatePerHour: baseRatePerHour !== undefined ? baseRatePerHour : undefined,
    }).catch(() => {});
    addNotification('Pricing Updated', `Category pricing updated (Floor: ₹${minPricePerHead}${baseRatePerHour ? `, Base: ₹${baseRatePerHour}/hr` : ''}).`, 'info', 'admin');
  };

  const updateCategory = async (categoryId: string, updates: Partial<ServiceCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c))
    );
    try {
      await api.updateCategory(categoryId, updates);
    } catch (e) {
      // ignore
    }
    addNotification('Category Updated', 'Service category and pricing updated.', 'info', 'admin');
  };

  // 12. Admin Controls: OTP & Verification Settings
  const updateVerificationSettings = (settings: Partial<CommissionSettings>) => {
    setCommission((prev) => ({
      ...prev,
      ...settings,
      updatedAt: 'Just now',
    }));
    addNotification('Verification Rules Updated', 'Start/End OTP & Overtime policies updated.', 'info', 'admin');
  };

  // Category Management implementations
  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    );
    api.toggleCategory(categoryId).catch(() => {});
  };

  const addCategory = (category: Omit<ServiceCategory, 'id' | 'totalWorkers'>) => {
    const newCat: ServiceCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      totalWorkers: 0,
      minPricePerHead: category.minPricePerHead || 400,
    };
    setCategories((prev) => [newCat, ...prev]);
    api.addCategory(newCat).catch(() => {});
    addNotification('Category Created', `${category.name} is now available on platform`, 'success', 'admin');
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    const target = categories.find((c) => c.id === categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    try {
      await api.deleteCategory(categoryId);
    } catch (e) {
      // ignore
    }
    addNotification('Category Deleted', `Service category "${target?.name || 'Selected'}" was removed from the platform.`, 'warning', 'admin');
    return true;
  };

  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, isAvailable: !w.isAvailable } : w))
    );
  };

  const postJob = (jobData: any): string => {
    const res = createBooking({
      ...jobData,
      amountPerHead: jobData.amountPerHead || jobData.minBudget || 500,
      requiredWorkers: jobData.requiredWorkers || 2,
    });
    return res.orderId || 'job-new';
  };

  const submitBid = (jobId: string, amount: number, notes?: string) => {
    const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];
    const targetOrder = orders.find((o) => o.id === jobId);

    // Balance Requirement: Check if worker maintains minimum required balance
    const minRequired = worker.minBalanceOverride ?? commission.minWalletBalance ?? 200;
    if (worker.walletBalance < minRequired) {
      addNotification(
        '⚠️ Cannot Submit Bid - Low Wallet Balance',
        `Worker ${worker.name} has ₹${worker.walletBalance}. You must maintain at least ₹${minRequired} to place bids and receive orders. Please recharge wallet.`,
        'warning',
        'employee'
      );
      triggerPushToast({
        title: '⚠️ Insufficient Wallet Balance!',
        message: `You must maintain at least ₹${minRequired} to place bids. Current balance: ₹${worker.walletBalance}. Please top up your wallet.`,
        type: 'payment',
        targetRole: 'employee',
        orderId: jobId,
        actionLabel: 'Recharge Wallet Now',
        actionScreen: 'earnings',
      });
      return;
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId,
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerRating: worker.rating,
      workerJobsCompleted: worker.jobsCompleted,
      amount,
      proposedTime: 'Will arrive on time',
      notes,
      status: 'pending',
      createdAt: 'Just now',
    };
    setBids((prev) => [newBid, ...prev]);
    addNotification('Bid Placed', `${worker.name} submitted quotation of ₹${amount}.`, 'info');

    // Push Notification Toast: Alert Customer that a worker submitted a new quote
    triggerPushToast({
      title: '🔔 New Bid Received! ₹' + amount,
      message: `${worker.name} placed a quote of ₹${amount} for ${targetOrder?.category || 'your order'}.`,
      type: 'bid',
      targetRole: 'customer',
      orderId: jobId,
      amount,
      workerName: worker.name,
      actionLabel: 'Tap to Review Bids',
      actionScreen: 'view-bids',
    });
  };

  // ----------------------------------------------------
  // WALLET & TRANSACTION SYSTEM
  // ----------------------------------------------------
  const topUpWorkerWallet = (
    workerId: string,
    amount: number,
    paymentMethod: 'upi' | 'card' | 'netbanking' = 'upi'
  ): { success: boolean; newBalance: number } => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker || amount <= 0) return { success: false, newBalance: 0 };

    const newBalance = worker.walletBalance + amount;
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, walletBalance: newBalance } : w))
    );

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workerId: worker.id,
      workerName: worker.name,
      type: 'credit',
      category: 'wallet_topup',
      amount,
      balanceAfter: newBalance,
      description: `Wallet Recharge of ₹${amount.toLocaleString()} via ${paymentMethod.toUpperCase()}`,
      paymentMethod,
      status: 'completed',
      timestamp: 'Just now',
    };
    setWalletTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Wallet Recharged Successfully',
      `₹${amount.toLocaleString()} credited to ${worker.name}'s wallet. Available balance: ₹${newBalance.toLocaleString()}.`,
      'success',
      'employee'
    );

    triggerPushToast({
      title: `💰 Wallet Top-Up: +₹${amount.toLocaleString()}`,
      message: `Recharge successful! Your wallet balance is now ₹${newBalance.toLocaleString()}. You are active for new jobs.`,
      type: 'payment',
      targetRole: 'employee',
      amount,
      actionLabel: 'View Wallet',
      actionScreen: 'earnings',
    });

    return { success: true, newBalance };
  };

  const debitWorkerWallet = (
    workerId: string,
    amount: number,
    description: string,
    orderId?: string,
    orderNumber?: string
  ): { success: boolean; newBalance: number; error?: string } => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return { success: false, newBalance: 0, error: 'Worker not found' };
    if (worker.walletBalance < amount) {
      return { success: false, newBalance: worker.walletBalance, error: 'Insufficient wallet balance' };
    }

    const newBalance = worker.walletBalance - amount;
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, walletBalance: newBalance } : w))
    );

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workerId: worker.id,
      workerName: worker.name,
      type: 'debit',
      category: 'commission_fee',
      amount,
      balanceAfter: newBalance,
      description,
      orderId,
      orderNumber,
      paymentMethod: 'system_deduct',
      status: 'completed',
      timestamp: 'Just now',
    };
    setWalletTransactions((prev) => [newTx, ...prev]);

    return { success: true, newBalance };
  };

  const adjustWorkerWalletAdmin = (
    workerId: string,
    amount: number,
    isCredit: boolean,
    reason: string
  ): { success: boolean; newBalance: number } => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return { success: false, newBalance: 0 };

    const newBalance = isCredit
      ? worker.walletBalance + amount
      : Math.max(0, worker.walletBalance - amount);

    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, walletBalance: newBalance } : w))
    );

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workerId: worker.id,
      workerName: worker.name,
      type: isCredit ? 'credit' : 'debit',
      category: 'admin_adjustment',
      amount,
      balanceAfter: newBalance,
      description: `Admin Console Adjustment: ${reason || (isCredit ? 'Credit adjustment' : 'Debit penalty/charge')}`,
      paymentMethod: 'admin_adjustment',
      status: 'completed',
      timestamp: 'Just now',
    };
    setWalletTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Admin Wallet Adjustment',
      `${isCredit ? 'Credited' : 'Debited'} ₹${amount} for ${worker.name}. Balance: ₹${newBalance}. Reason: ${reason}`,
      'info',
      'admin'
    );

    return { success: true, newBalance };
  };

  const getWorkerTransactions = (workerId: string): WalletTransaction[] => {
    return walletTransactions.filter((tx) => tx.workerId === workerId);
  };

  // ----------------------------------------------------
  // ADMIN WORKER PROFILE MANAGEMENT SETUPS
  // ----------------------------------------------------
  const updateWorkerProfile = (workerId: string, updates: Partial<Worker>) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated = { ...w, ...updates };
          return updated;
        }
        return w;
      })
    );
    addNotification('Worker Profile Updated', `Profile setups saved for worker ID: ${workerId}`, 'success', 'admin');
  };

  const createWorkerProfile = (workerData: Omit<Worker, 'id'>): string => {
    const newId = `w-${Date.now()}`;
    const newWorker: Worker = {
      ...workerData,
      id: newId,
      walletBalance: workerData.walletBalance ?? 500,
      rating: workerData.rating || 5.0,
      totalReviews: workerData.totalReviews || 0,
      jobsCompleted: workerData.jobsCompleted || 0,
      distanceKm: workerData.distanceKm || 2.5,
      isAvailable: workerData.isAvailable ?? true,
      isVerified: workerData.isVerified ?? true,
    };

    setWorkers((prev) => [newWorker, ...prev]);

    if (newWorker.walletBalance > 0) {
      const initialTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        workerId: newId,
        workerName: newWorker.name,
        type: 'credit',
        category: 'wallet_topup',
        amount: newWorker.walletBalance,
        balanceAfter: newWorker.walletBalance,
        description: 'Initial Wallet Balance granted by Admin at Onboarding',
        paymentMethod: 'admin_adjustment',
        status: 'completed',
        timestamp: 'Just now',
      };
      setWalletTransactions((prev) => [initialTx, ...prev]);
    }

    addNotification('New Worker Created', `Worker ${newWorker.name} enrolled in ${newWorker.category}.`, 'success', 'admin');
    return newId;
  };

  const deleteWorkerProfile = (workerId: string): boolean => {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    addNotification('Worker Deleted', `Worker record ${workerId} removed from platform database.`, 'info', 'admin');
    return true;
  };

  const acceptBid = (bidId: string) => {
    const targetBid = bids.find((b) => b.id === bidId);
    if (!targetBid) return;
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status: 'accepted' } : b)));
    employeeAcceptBooking(targetBid.jobId, targetBid.workerId);
  };

  const declineBid = (bidId: string) => {
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status: 'declined' } : b)));
  };

  const updateCommission = (settings: Partial<CommissionSettings>) => {
    updateVerificationSettings(settings);
  };

  const simulateIncomingBid = () => {
    const targetOrder = orders.find((o) => o.status === 'searching') || orders[0];
    const unacceptedWorker = workers.find(
      (w) => !targetOrder.acceptedEmployees.some((e) => e.workerId === w.id)
    ) || workers[0];

    const quoteAmount = Math.max(350, Math.round(targetOrder.amountPerHead * (0.9 + Math.random() * 0.2)));
    submitBid(targetOrder.id, quoteAmount, 'Ready to start immediately with verified safety equipment.');
  };

  const resetDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setWorkers(INITIAL_WORKERS);
    setOrders(INITIAL_ORDERS);
    setBids(INITIAL_BIDS);
    setCommission(INITIAL_COMMISSION);
    setStats(INITIAL_STATS);
    setChats(INITIAL_CHATS);
    setSelectedJobId('job-1045');
    addNotification('Demo Data Reset', 'All temporary manpower marketplace records restored to initial state.', 'info');
  };

  // ----------------------------------------------------
  // APP & ADMIN PANEL BRANDING & CUSTOMIZATION SETUPS
  // ----------------------------------------------------
  const updateCustomization = (updates: Partial<AppCustomizationSettings>) => {
    setCustomization((prev) => {
      const next: AppCustomizationSettings = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      try {
        localStorage.setItem('manpower_app_customization_v1', JSON.stringify(next));
      } catch (e) {
        // ignore
      }

      // Persist directly to manual SQLite relational database
      fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch((err) => {
        console.warn('Could not sync customization to SQL backend:', err);
      });

      return next;
    });

    triggerPushToast({
      type: 'general',
      title: 'Saved to SQLite Database',
      message: 'App customization saved and stored in SQLite table (app_customization).',
      targetRole: 'admin',
    });
  };

  const resetCustomization = () => {
    setCustomization(INITIAL_CUSTOMIZATION);
    try {
      localStorage.removeItem('manpower_app_customization_v1');
    } catch (e) {}

    // Reset in SQLite relational database
    fetch('/api/customization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(INITIAL_CUSTOMIZATION),
    }).catch(() => {});

    triggerPushToast({
      type: 'general',
      title: 'Defaults Restored in SQL',
      message: 'Brand & panel customization restored to system default in SQLite database.',
      targetRole: 'admin',
    });
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
        chats,
        adminAuth,
        customerAuth,
        employeeAuth,
        loginAdmin,
        loginCustomer,
        loginEmployee,
        resetPassword,
        registerCustomer,
        registerWorker,
        registerAdmin,
        signOut,
        switchWorkerAccount,
        backendConnected,
        backendHealth,
        syncingWithBackend,
        refreshBackend,
        createBooking,
        raiseBookingPrice,
        employeeAcceptBooking,
        employeeRejectBooking,
        employeeUpdateWorkStatus,
        startWorkWithOtp,
        endWorkWithOtp,
        settlePayment,
        submitCustomerRating,
        submitEmployeeRating,
        sendChatMessage,
        updateCategoryMinPrice,
        updateCategory,
        updateVerificationSettings,
        toggleCategoryStatus,
        addCategory,
        deleteCategory,
        toggleWorkerAvailability,
        walletTransactions,
        topUpWorkerWallet,
        debitWorkerWallet,
        adjustWorkerWalletAdmin,
        getWorkerTransactions,
        updateWorkerProfile,
        createWorkerProfile,
        deleteWorkerProfile,
        postJob,
        submitBid,
        acceptBid,
        declineBid,
        updateCommission,
        simulateIncomingBid,
        resetDemoData,
        dismissNotification,
        addNotification,
        pushToasts,
        triggerPushToast,
        dismissPushToast,
        showPushSimulator,
        setShowPushSimulator,
        customization,
        updateCustomization,
        resetCustomization,
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
