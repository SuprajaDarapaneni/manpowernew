import {
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  CommissionSettings,
  NotificationItem,
  AuthUser,
} from '../types';

export interface HealthResponse {
  status: string;
  server: string;
  version: string;
  database?: string;
  dbEngine?: string;
  mongodb?: {
    cluster: string;
    database: string;
    status: string;
    connected: boolean;
    ipWhitelistHelp?: string;
  };
  uptimeSeconds: number;
  timestamp: string;
  counts: {
    categories: number;
    workers: number;
    orders: number;
    bids: number;
  };
}

export interface DbInfoResponse {
  success: boolean;
  databaseName: string;
  databaseType: string;
  cluster?: string;
  connectionString?: string;
  status: string;
  connectedToAtlas?: boolean;
  ipWhitelistHelp?: string;
  schemaVersion: string;
  tables: Array<{ name: string; recordCount: number; description: string }>;
  defaultAdminUser: string;
}

class ApiService {
  private baseUrl = '/api';

  async checkHealth(): Promise<HealthResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getDbInfo(): Promise<DbInfoResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/db/info`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async reconnectDb(): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/db/reconnect`, { method: 'POST' });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Authentication Methods
  async sendOtp(phone: string, role: string = 'customer'): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role }),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Simulated OTP sent', otp: '1234' };
    }
  }

  async verifyOtp(params: { phone: string; otp: string; role: string; name?: string; workerId?: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  }

  async login(params: { role: string; emailOrPhone?: string; password?: string; workerId?: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  }

  async logout(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/logout`, { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  }

  async getCategories(): Promise<ServiceCategory[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/categories`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async addCategory(data: Partial<ServiceCategory>): Promise<ServiceCategory | null> {
    try {
      const res = await fetch(`${this.baseUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async toggleCategory(id: string): Promise<ServiceCategory | null> {
    try {
      const res = await fetch(`${this.baseUrl}/categories/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async getWorkers(): Promise<Worker[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/workers`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async toggleWorkerAvailability(id: string): Promise<Worker | null> {
    try {
      const res = await fetch(`${this.baseUrl}/workers/${id}/availability`, {
        method: 'PATCH',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async getJobs(): Promise<JobOrder[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/jobs`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async createJob(jobData: Partial<JobOrder>): Promise<JobOrder | null> {
    try {
      const res = await fetch(`${this.baseUrl}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async getBids(): Promise<Bid[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/bids`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async submitBid(bidData: { jobId: string; workerId: string; amount: number; notes?: string }): Promise<Bid | null> {
    try {
      const res = await fetch(`${this.baseUrl}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async acceptBid(bidId: string): Promise<{ bid: Bid; order: JobOrder; worker: Worker; commissionDeducted: number } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/bids/${bidId}/accept`, {
        method: 'POST',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async declineBid(bidId: string): Promise<Bid | null> {
    try {
      const res = await fetch(`${this.baseUrl}/bids/${bidId}/decline`, {
        method: 'POST',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async getCommission(): Promise<CommissionSettings | null> {
    try {
      const res = await fetch(`${this.baseUrl}/commission`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async updateCommission(settings: Partial<CommissionSettings>): Promise<CommissionSettings | null> {
    try {
      const res = await fetch(`${this.baseUrl}/commission`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async getNotifications(): Promise<NotificationItem[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/notifications`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async dismissNotification(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/notifications/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async simulateIncomingBid(): Promise<Bid | null> {
    try {
      const res = await fetch(`${this.baseUrl}/simulate-bid`, {
        method: 'POST',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  async resetBackend(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/reset`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiService();
