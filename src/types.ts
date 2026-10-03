export type AppViewRole = 'admin' | 'customer' | 'employee' | 'split';

export type CustomerScreen = 
  | 'home' 
  | 'post-job' 
  | 'view-bids' 
  | 'order-confirmation' 
  | 'my-orders'
  | 'profile';

export type EmployeeScreen = 
  | 'dashboard' 
  | 'job-details' 
  | 'available-jobs' 
  | 'my-bids'
  | 'earnings';

export type AdminTab = 
  | 'dashboard' 
  | 'categories' 
  | 'orders' 
  | 'commission' 
  | 'workers' 
  | 'payments' 
  | 'reports';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseRatePerHour: number;
  active: boolean;
  totalWorkers: number;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  category: string;
  skills: string[];
  hourlyRate: number;
  location: string;
  distanceKm: number;
  jobsCompleted: number;
  isAvailable: boolean;
  isVerified: boolean;
  walletBalance: number;
}

export interface Bid {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerRating: number;
  workerJobsCompleted: number;
  amount: number;
  proposedTime?: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface JobOrder {
  id: string;
  orderNumber: string; // e.g. "#1045"
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  title: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  workingHours: number;
  requiredWorkers: number;
  minBudget: number;
  maxBudget: number;
  specialInstructions?: string;
  status: 'open' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedWorkerIds: string[];
  totalAgreedAmount: number;
  commissionDeducted: number;
  createdAt: string;
}

export interface CommissionSettings {
  type: 'percentage' | 'fixed';
  percentage: number; // e.g. 10%
  fixedAmount: number; // e.g. ₹50 per worker/order
  minimumOrderFee: number;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'bid';
  timestamp: string;
  targetRole?: AppViewRole;
}
