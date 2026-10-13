// Unified API Service facade for Admin Portal and Platform Core
import { HttpClient, HealthResponse, DbInfoResponse } from '../shared/services/httpClient';
import { authApi } from '../shared/services/authApi';
import { adminApi } from '../apps/admin/services/adminApi';

export type { HealthResponse, DbInfoResponse };

class ApiFacade extends HttpClient {
  // System
  checkHealth = () => adminApi.checkHealth();
  getDbInfo = () => adminApi.getDbInfo();
  reconnectDb = () => adminApi.reconnectDb();
  resetBackend = () => adminApi.resetBackend();

  // Auth
  sendOtp = (phone: string, role?: string) => authApi.sendOtp(phone, role);
  verifyOtp = (params: any) => authApi.verifyOtp(params);
  login = (params: any) => authApi.login(params);
  logout = () => authApi.logout();
  resetPassword = (emailOrPhone: string, newPassword: string) => authApi.resetPassword(emailOrPhone, newPassword);

  // Admin Categories & Workers
  getCategories = () => adminApi.getCategories();
  addCategory = (data: any) => adminApi.addCategory(data);
  updateCategory = (id: string, data: any) => adminApi.updateCategory(id, data);
  deleteCategory = (id: string) => adminApi.deleteCategory(id);
  toggleCategory = (id: string) => adminApi.toggleCategory(id);
  getWorkers = () => adminApi.getWorkers();
  toggleWorkerAvailability = (id: string) => adminApi.toggleWorkerAvailability(id);
  getCommission = () => adminApi.getCommission();
  updateCommission = (settings: any) => adminApi.updateCommission(settings);
  getNotifications = () => adminApi.getNotifications();
  dismissNotification = (id: string) => adminApi.dismissNotification(id);

  // Orders & Bids (Operations Management)
  getJobs = async () => this.get<any[]>('/orders');
  createJob = async (jobData: any) => this.post<any>('/orders', jobData);
  acceptBid = async (bidId: string) => this.patch<any>(`/bids/${bidId}/accept`);
  declineBid = async (bidId: string) => this.patch<any>(`/bids/${bidId}/decline`);
  getBids = async () => this.get<any[]>('/bids');
  submitBid = async (data: any) => this.post<any>('/bids', data);
  simulateIncomingBid = async () => this.post<any>('/bids/simulate');
}

export const api = new ApiFacade();
export { authApi, adminApi };
