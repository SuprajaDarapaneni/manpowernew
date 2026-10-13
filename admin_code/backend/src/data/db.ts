// Clean, self-contained in-memory data store with pre-seeded data

export interface ServiceCategory {
  id: string;
  name: string;
  baseHourlyRate: number;
  description: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  category_name: string;
  required_workers: number;
  assigned_workers: number;
  status: 'matching' | 'assigned' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  shift_date: string;
  start_time: string;
  duration_hours: number;
  location_address: string;
  arrival_otp: string;
  total_amount: number;
  platform_fee: number;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  category: string;
  rating: number;
  completed_shifts: number;
  kyc_status: 'verified' | 'pending' | 'rejected';
  hourly_rate: number;
}

export class DataStore {
  categories: ServiceCategory[] = [
    { id: 'cat-wh', name: 'Warehouse Helper', baseHourlyRate: 180, description: 'Sorting, packing, stacking and pallet loading' },
    { id: 'cat-lu', name: 'Loading & Unloading', baseHourlyRate: 200, description: 'Freight handling, heavy cargo container unloading' },
    { id: 'cat-cs', name: 'Construction Support', baseHourlyRate: 190, description: 'Masonry assistance, material hauling, concrete mix' },
    { id: 'cat-es', name: 'Event Stewards', baseHourlyRate: 220, description: 'Banquet setup, crowd assistance, venue logistics' },
    { id: 'cat-ic', name: 'Industrial Cleaning', baseHourlyRate: 175, description: 'Sanitization, floor scrubbing, post-build cleanup' },
  ];

  bookings: Booking[] = [
    {
      id: 'bk-101',
      booking_number: 'MPL-882104',
      category_name: 'Warehouse Helper',
      required_workers: 4,
      assigned_workers: 4,
      status: 'in_progress',
      shift_date: 'Today',
      start_time: '08:00 AM',
      duration_hours: 8,
      location_address: 'Sector 4, Logistics Park, Bengaluru',
      arrival_otp: '482910',
      total_amount: 5760.0,
      platform_fee: 576.0,
    },
    {
      id: 'bk-102',
      booking_number: 'MPL-882106',
      category_name: 'Event Stewards',
      required_workers: 2,
      assigned_workers: 1,
      status: 'matching',
      shift_date: 'Tomorrow',
      start_time: '10:00 AM',
      duration_hours: 6,
      location_address: 'Grand Palace Banquets, Palace Road',
      arrival_otp: '391042',
      total_amount: 2640.0,
      platform_fee: 264.0,
    },
  ];

  workers: Worker[] = [
    { id: 'wrk-1', name: 'Ramesh Gowda', phone: '+91 98765 43210', category: 'Warehouse Helper', rating: 4.9, completed_shifts: 142, kyc_status: 'verified', hourly_rate: 180 },
    { id: 'wrk-2', name: 'Suresh Patil', phone: '+91 98765 11223', category: 'Construction Support', rating: 4.8, completed_shifts: 98, kyc_status: 'verified', hourly_rate: 190 },
    { id: 'wrk-3', name: 'Manjunath Hegde', phone: '+91 97410 88231', category: 'Loading & Unloading', rating: 5.0, completed_shifts: 0, kyc_status: 'pending', hourly_rate: 200 },
    { id: 'wrk-4', name: 'Priya D\'Souza', phone: '+91 99001 44552', category: 'Industrial Cleaning', rating: 4.9, completed_shifts: 76, kyc_status: 'verified', hourly_rate: 175 },
  ];

  commissionSettings = {
    model: 'percentage',
    ratePercent: 10,
    fixedFeeAmount: 150,
  };
}

export const db = new DataStore();
