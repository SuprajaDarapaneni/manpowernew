// Authentication & User Data Models
export type AppViewRole = 'admin' | 'customer' | 'employee' | 'split';

export interface AuthUser {
  id: string;
  name: string;
  role: 'admin' | 'customer' | 'employee';
  emailOrPhone: string;
  avatar?: string;
  token: string;
  businessName?: string;
  workerCategory?: string;
  rating?: number;
  verified: boolean;
  location?: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  role: 'admin' | 'customer' | 'employee';
  emailOrPhone: string;
  password?: string;
  businessName?: string;
  location?: string;
  workerCategory?: string;
  hourlyRate?: number;
  skills?: string[];
  avatar?: string;
  rating?: number;
  verified: boolean;
  walletBalance?: number;
  jobsCompleted?: number;
  createdAt: string;
}
