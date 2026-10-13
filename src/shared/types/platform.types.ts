// Platform, Navigation & Commission Models
import { AppViewRole } from './auth.types';

export type CustomerScreen = 
  | 'home' 
  | 'post-job' 
  | 'bids'
  | 'orders'
  | 'view-bids' 
  | 'order-confirmation' 
  | 'my-orders'
  | 'order-detail'
  | 'chat'
  | 'profile';

export type EmployeeScreen = 
  | 'dashboard' 
  | 'job-details' 
  | 'available-jobs' 
  | 'available'
  | 'my-bids'
  | 'bids'
  | 'chat'
  | 'earnings'
  | 'profile';

export type AdminTab = 
  | 'dashboard' 
  | 'categories' 
  | 'orders' 
  | 'commission' 
  | 'workers' 
  | 'payments' 
  | 'reports'
  | 'customization';

export type LogoIconType = 
  | 'users' 
  | 'shield' 
  | 'hardhat' 
  | 'briefcase' 
  | 'zap' 
  | 'flame' 
  | 'sparkles' 
  | 'building' 
  | 'hammer' 
  | 'rocket'
  | 'wrench'
  | 'activity';

export type LogoShapeType = 'squircle' | 'rounded' | 'circle' | 'square';

export type LogoGradientType = 
  | 'red-yellow' 
  | 'ruby-gold' 
  | 'amber-fire' 
  | 'crimson-black' 
  | 'gold-dark'
  | 'sunset-gradient';

export type AdminThemeMode = 'slate-900' | 'zinc-950' | 'red-950' | 'charcoal-dark';

export interface AppCustomizationSettings {
  appName: string;
  tagline: string;
  logoType: 'icon' | 'image';
  logoIcon: LogoIconType;
  logoImageUrl: string;
  logoShape: LogoShapeType;
  logoGradient: LogoGradientType;
  
  // Theme & Colors
  primaryColor: string;
  accentColor: string;
  adminSidebarTheme: AdminThemeMode;
  
  // App Titles & Greetings
  adminPanelTitle: string;
  customerAppTitle: string;
  employeeAppTitle: string;
  customerWelcomeHeading: string;
  customerWelcomeSubheading: string;
  workerGreeting: string;
  currencySymbol: string;
  
  // Contact & Support
  supportPhone: string;
  supportEmail: string;
  supportCity: string;
  supportHours: string;
  
  // Announcement Broadcast Banner
  showAnnouncementBanner: boolean;
  announcementText: string;
  announcementType: 'advisory' | 'urgent' | 'offer' | 'info';
  announcementTarget: 'all' | 'customer' | 'employee';
  
  // Feature Toggles
  showPushSimulatorFloating: boolean;
  enableSoundChimes: boolean;
  
  updatedAt: string;
}

export interface CommissionSettings {
  type: 'percentage' | 'fixed';
  percentage: number;
  fixedAmount: number;
  minimumOrderFee: number;
  minWalletBalance: number;
  commissionDebitedOnAccept: boolean;
  lowBalanceAlertThreshold: number;
  startOtpRequired: boolean;
  endOtpRequired: boolean;
  overtimeHourlyRateMultiplier: number;
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

export type PushNotificationType = 'bid' | 'job_accepted' | 'payment' | 'order' | 'otp' | 'general';

export interface PushToast {
  id: string;
  title: string;
  message: string;
  type: PushNotificationType;
  targetRole: 'customer' | 'employee' | 'admin' | 'all';
  timestamp: string;
  orderId?: string;
  amount?: number;
  workerName?: string;
  customerName?: string;
  actionLabel?: string;
  actionScreen?: 'view-bids' | 'order-detail' | 'job-details' | 'my-bids' | 'earnings' | 'available-jobs';
  read?: boolean;
}
