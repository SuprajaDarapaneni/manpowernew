import { HttpClient } from './httpClient';
import { AuthUser } from '../types';

export class AuthApiService extends HttpClient {
  async sendOtp(phone: string, role: string = 'customer'): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role }),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'OTP sent', otp: '1234' };
    }
  }

  async verifyOtp(params: {
    phone: string;
    otp: string;
    role: string;
    name?: string;
    workerId?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
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

  async login(params: {
    role: string;
    emailOrPhone?: string;
    password?: string;
    workerId?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
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

  async resetPassword(emailOrPhone: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, newPassword }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error resetting password' };
    }
  }
}

export const authApi = new AuthApiService();
