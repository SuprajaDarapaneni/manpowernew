// Service Category Data Models
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseRatePerHour: number;
  minPricePerHead: number; // Admin controlled minimum price per head
  active: boolean;
  totalWorkers: number;
}
