import { HttpClient } from '../../../shared/services/httpClient';
import {
  ServiceCategory,
  Worker,
  CommissionSettings,
  NotificationItem,
  AuthUser,
} from '../../../shared/types';

export class AdminApiService extends HttpClient {
  async getCategories(): Promise<ServiceCategory[] | null> {
    return this.get<ServiceCategory[]>('/categories');
  }

  async addCategory(data: Partial<ServiceCategory>): Promise<ServiceCategory | null> {
    return this.post<ServiceCategory>('/categories', data);
  }

  async toggleCategory(id: string): Promise<ServiceCategory | null> {
    return this.patch<ServiceCategory>(`/categories/${id}/toggle`);
  }

  async updateCategory(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory | null> {
    return this.patch<ServiceCategory>(`/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.delete(`/categories/${id}`);
  }

  async getWorkers(): Promise<Worker[] | null> {
    return this.get<Worker[]>('/workers');
  }

  async toggleWorkerAvailability(id: string): Promise<Worker | null> {
    return this.patch<Worker>(`/workers/${id}/availability`);
  }

  async getCommission(): Promise<CommissionSettings | null> {
    return this.get<CommissionSettings>('/commission');
  }

  async updateCommission(settings: Partial<CommissionSettings>): Promise<CommissionSettings | null> {
    return this.put<CommissionSettings>('/commission', settings);
  }

  async getNotifications(): Promise<NotificationItem[] | null> {
    return this.get<NotificationItem[]>('/notifications');
  }

  async dismissNotification(id: string): Promise<boolean> {
    return this.delete(`/notifications/${id}`);
  }

  async resetBackend(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/reset`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async registerAdmin(data: {
    name: string;
    email: string;
    password?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error registering admin' };
    }
  }
}

export const adminApi = new AdminApiService();
