// Job Order, Booking & Execution Data Models
export type WorkType = 'scheduled' | 'instant';

export type TimeSlotType = 
  | 'full_day_8h'   // Full day 8 hours
  | 'half_day_4h'   // Half day 4 hours
  | 'hourly'        // Hourly basis
  | 'work_basis'    // Work/task completion basis
  | 'custom';       // Custom duration

export interface FoodTiffinServices {
  morningTiffin: boolean;
  lunch: boolean;
  eveningTeaTiffin: boolean;
  drinkingWaterProvided: boolean;
  safetyEquipmentProvided: boolean;
  heavyLiftingRequired?: boolean;
}

export type OrderStatus = 
  | 'searching'       // Created -> Searching Employees
  | 'confirmed'       // Required count reached -> Confirmed / Ready for work
  | 'in_progress'     // Worker arrived & Start OTP entered
  | 'work_completed'  // Work finished & End OTP entered, ready for payment
  | 'paid'            // Payment settled (Cash / Online) & Ratings submitted
  | 'cancelled'
  | 'open'
  | 'bidding'
  | 'assigned'
  | 'completed';

export type EmployeeWorkStatus = 
  | 'assigned'        // Worker accepted job
  | 'going_to_work'   // En route to work point
  | 'arrived'         // Arrived at work location
  | 'working'         // Started work with OTP
  | 'completed';      // Finished with OTP

export interface EmployeeAssignment {
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerAvatar: string;
  workerRating: number;
  acceptedAt: string;
  status: EmployeeWorkStatus;
  startedAt?: string;
  endedAt?: string;
  actualHoursWorked?: number;
  overtimeHours?: number;
  overtimePay?: number;
}

export interface PriceRevision {
  previousAmount: number;
  newAmount: number;
  revisedAt: string;
  reason?: string;
}

export interface CustomerRating {
  stars: number;
  quality: number;
  workQuality?: number;
  punctuality: number;
  behaviour: number;
  behavior?: number;
  comment: string;
  submittedAt: string;
}

export interface EmployeeRating {
  stars: number;
  workClarity: number;
  paymentExperience: number;
  workingConditions: number;
  comment: string;
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: 'customer' | 'employee';
  senderName: string;
  message: string;
  timestamp: string;
  isLocation?: boolean;
}

export interface JobOrder {
  id: string;
  orderNumber: string; // e.g. "#1045"
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  title: string;

  // Booking Parameters
  amountPerHead: number;
  requiredWorkers: number;
  location: string;
  locationLandmark?: string;
  workType: WorkType;
  timeSlotType: TimeSlotType;
  workingHours: number;
  scheduledDateFrom: string;
  scheduledDateTo: string;
  scheduledTimeFrom: string;
  scheduledTimeTo: string;
  foodServices: FoodTiffinServices;
  specialInstructions?: string;

  // Pricing & Breakdown
  minPricePerHead: number;
  estimatedManpowerCost: number; // amountPerHead * requiredWorkers
  platformFee: number;
  taxAmount: number;
  overtimeHours?: number;
  overtimeHourlyRate?: number;
  overtimeTotal?: number;
  finalTotalAmount: number;

  // Matching & Fulfillment
  status: OrderStatus;
  acceptedEmployees: EmployeeAssignment[];
  rejectedWorkerIds: { workerId: string; reason?: string; timestamp: string }[];
  priceRevisions: PriceRevision[];

  // OTP Verification
  startOtp: string; // 4-digit code e.g. "4821"
  endOtp: string;   // 4-digit code e.g. "7932"
  startOtpVerified: boolean;
  endOtpVerified: boolean;
  actualStartTime?: string;
  actualEndTime?: string;
  actualHoursWorked?: number;

  // Payment & Ratings
  paymentMethod?: 'cash' | 'online' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'disputed';
  cashCollected?: boolean;
  customerRating?: CustomerRating;
  employeeRating?: EmployeeRating;

  // Legacy compatibility fields
  scheduledDate?: string;
  scheduledTime?: string;
  durationHours?: number;
  pricePerHead?: number;
  notes?: string;
  minBudget?: number;
  maxBudget?: number;
  assignedWorkerIds?: string[];
  totalAgreedAmount?: number;
  commissionDeducted?: number;

  createdAt: string;
}
