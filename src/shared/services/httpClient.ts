// Shared Base HTTP Client

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

export class HttpClient {
  protected baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  protected async get<T>(endpoint: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch {
      return null;
    }
  }

  protected async post<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch {
      return null;
    }
  }

  protected async put<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch {
      return null;
    }
  }

  protected async patch<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch {
      return null;
    }
  }

  protected async delete(endpoint: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

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

  async reconnectDb(): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/db/reconnect`, { method: 'POST' });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

export const httpClient = new HttpClient();
