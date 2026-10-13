// Worker & Partner Data Models
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
  aadhaarNo?: string;
  experienceYears?: number;
  minBalanceOverride?: number;
  isSuspended?: boolean;
  upiId?: string;
  bankAccountNo?: string;
}

export interface WalletTransaction {
  id: string;
  workerId: string;
  workerName?: string;
  type: 'credit' | 'debit';
  category: 'commission_fee' | 'wallet_topup' | 'job_payout' | 'admin_adjustment' | 'refund';
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  orderNumber?: string;
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'admin_adjustment' | 'system_deduct';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
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
