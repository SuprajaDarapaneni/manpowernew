import { HttpClient } from '../../../shared/services/httpClient';
import {
  Worker,
  JobOrder,
  Bid,
  RegisteredUser,
} from '../../../types';

export class EmployeeApiClient extends HttpClient {
  async getWorkerProfile(workerId: string): Promise<Worker | null> {
    return await this.get<Worker>(`/workers/${workerId}`);
  }

  async toggleAvailability(workerId: string): Promise<Worker | null> {
    return await this.patch<Worker>(`/workers/${workerId}/availability`);
  }

  async getAvailableJobs(): Promise<JobOrder[]> {
    const jobs = await this.get<JobOrder[]>('/jobs?status=open');
    return jobs || [];
  }

  async getMyBids(workerId: string): Promise<Bid[]> {
    const bids = await this.get<Bid[]>(`/bids?workerId=${encodeURIComponent(workerId)}`);
    return bids || [];
  }

  async submitBid(data: {
    jobId: string;
    workerId: string;
    amount: number;
    notes?: string;
    proposedTime?: string;
  }): Promise<Bid | null> {
    return await this.post<Bid>('/bids', data);
  }

  async registerWorker(workerData: {
    name: string;
    phone: string;
    category: string;
    hourlyRate: number;
    location: string;
    experienceYears?: number;
    password?: string;
  }): Promise<{ success: boolean; user?: RegisteredUser; worker?: Worker; error?: string }> {
    const res = await this.post<{ success: boolean; user: RegisteredUser; worker: Worker; error?: string }>(
      '/auth/register-worker',
      workerData
    );
    return res || { success: false, error: 'Registration failed' };
  }
}

export const employeeApi = new EmployeeApiClient();
