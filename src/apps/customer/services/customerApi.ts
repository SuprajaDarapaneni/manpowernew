import { HttpClient } from '../../../shared/services/httpClient';
import {
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  RegisteredUser,
} from '../../../types';

export class CustomerApiClient extends HttpClient {
  async getCategories(): Promise<ServiceCategory[]> {
    const data = await this.get<ServiceCategory[]>('/categories');
    return data || [];
  }

  async getWorkers(category?: string): Promise<Worker[]> {
    const endpoint = category
      ? `/workers?category=${encodeURIComponent(category)}&available=true`
      : '/workers?available=true';
    const data = await this.get<Worker[]>(endpoint);
    return data || [];
  }

  async getOrders(customerId?: string): Promise<JobOrder[]> {
    const endpoint = customerId ? `/jobs?customerId=${encodeURIComponent(customerId)}` : '/jobs';
    const data = await this.get<JobOrder[]>(endpoint);
    return data || [];
  }

  async createJobOrder(orderData: Partial<JobOrder>): Promise<JobOrder | null> {
    return await this.post<JobOrder>('/jobs', orderData);
  }

  async getBidsForJob(jobId: string): Promise<Bid[]> {
    const data = await this.get<Bid[]>(`/bids?jobId=${encodeURIComponent(jobId)}`);
    return data || [];
  }

  async acceptBid(bidId: string): Promise<{ success: boolean; data?: any }> {
    const res = await this.post<{ success: boolean; data: any }>(`/bids/${bidId}/accept`);
    return res || { success: false };
  }

  async declineBid(bidId: string): Promise<boolean> {
    const res = await this.post<{ success: boolean }>(`/bids/${bidId}/decline`);
    return Boolean(res?.success);
  }

  async registerCustomer(customerData: {
    name: string;
    businessName: string;
    phone: string;
    location: string;
    password?: string;
  }): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
    const res = await this.post<{ success: boolean; user: RegisteredUser; error?: string }>(
      '/auth/register-customer',
      customerData
    );
    return res || { success: false, error: 'Registration failed' };
  }

  async deleteAccount(emailOrPhone: string): Promise<boolean> {
    const res = await this.post<{ success: boolean }>('/auth/delete-account', { emailOrPhone });
    return Boolean(res?.success);
  }
}

export const customerApi = new CustomerApiClient();
