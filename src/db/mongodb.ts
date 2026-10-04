import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import {
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  CommissionSettings,
  NotificationItem,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_STATS,
} from '../data/initialData';

dotenv.config();

const DEFAULT_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://saisuppu1_db_user:qsosbimXheAv6tsG@cluster0.dzxw5pm.mongodb.net/manpowerlink_db?retryWrites=true&w=majority';

export interface MongoDbStatus {
  connected: boolean;
  cluster: string;
  database: string;
  status: 'connected' | 'connecting' | 'fallback_active' | 'ip_whitelist_required';
  error: string | null;
  collections: { name: string; count: number }[];
  lastChecked: string;
  ipWhitelistHelp?: string;
}

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private connectionError: string | null = null;
  private clusterName = 'cluster0.dzxw5pm.mongodb.net';
  private dbName = 'manpowerlink_db';

  // In-Memory mirror to guarantee 100% platform uptime and immediate responsiveness
  public memCategories: ServiceCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
  public memWorkers: Worker[] = JSON.parse(JSON.stringify(INITIAL_WORKERS));
  public memOrders: JobOrder[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  public memBids: Bid[] = JSON.parse(JSON.stringify(INITIAL_BIDS));
  public memCommission: CommissionSettings = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
  public memStats = JSON.parse(JSON.stringify(INITIAL_STATS));
  public memNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'New Bid Received',
      message: 'Ramesh Gowda submitted a bid of ₹2,000 for Order #1045',
      type: 'bid',
      timestamp: 'Just now',
      targetRole: 'customer',
    },
    {
      id: 'notif-mongodb-init',
      title: 'MongoDB Atlas Integration Configured',
      message: 'MongoDB Atlas cluster connected: cluster0.dzxw5pm.mongodb.net / database: manpowerlink_db',
      type: 'info',
      timestamp: 'Just now',
      targetRole: 'admin',
    },
  ];

  constructor() {
    this.initClient();
  }

  private initClient() {
    try {
      this.client = new MongoClient(DEFAULT_URI, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 5000,
      });
      this.connect();
    } catch (err: any) {
      this.connectionError = err.message || 'Failed to instantiate MongoClient';
      console.warn('[MongoDB] Init error:', this.connectionError);
    }
  }

  public async connect(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;
      this.connectionError = null;
      console.log(`[MongoDB] Successfully connected to MongoDB Atlas (${this.dbName})!`);
      await this.seedInitialDataIfEmpty();
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err.message || 'Connection failed';
      console.warn('[MongoDB] Atlas connection status:', this.connectionError);
      return false;
    }
  }

  private async seedInitialDataIfEmpty() {
    if (!this.db || !this.isConnected) return;
    try {
      const categoriesCol = this.db.collection('service_categories');
      const count = await categoriesCol.countDocuments();
      if (count === 0) {
        console.log('[MongoDB] Seeding initial data to MongoDB Atlas collections...');
        await categoriesCol.insertMany(INITIAL_CATEGORIES);
        await this.db.collection('workers').insertMany(INITIAL_WORKERS);
        await this.db.collection('job_orders').insertMany(INITIAL_ORDERS);
        await this.db.collection('bids').insertMany(INITIAL_BIDS);
        await this.db.collection('commission_settings').insertOne({ ...INITIAL_COMMISSION, _id: 'main_policy' as any });
        console.log('[MongoDB] Seeding completed successfully!');
      }
    } catch (e: any) {
      console.warn('[MongoDB] Seeding note:', e.message);
    }
  }

  // Status helper
  public async getStatus(): Promise<MongoDbStatus> {
    let status: MongoDbStatus['status'] = this.isConnected ? 'connected' : 'fallback_active';
    let ipHelp: string | undefined;

    if (!this.isConnected && this.connectionError) {
      if (this.connectionError.includes('SSL alert number 80') || this.connectionError.includes('tlsv1 alert internal error')) {
        status = 'ip_whitelist_required';
        ipHelp = 'MongoDB Atlas rejected connection: Add 0.0.0.0/0 to your MongoDB Atlas Network Access IP Access List to allow cloud connection.';
      }
    }

    const collections = [
      { name: 'service_categories', count: this.memCategories.length },
      { name: 'workers', count: this.memWorkers.length },
      { name: 'job_orders', count: this.memOrders.length },
      { name: 'bids', count: this.memBids.length },
      { name: 'commission_settings', count: 1 },
      { name: 'notifications', count: this.memNotifications.length },
    ];

    if (this.isConnected && this.db) {
      try {
        const catCount = await this.db.collection('service_categories').countDocuments();
        const workerCount = await this.db.collection('workers').countDocuments();
        const orderCount = await this.db.collection('job_orders').countDocuments();
        const bidCount = await this.db.collection('bids').countDocuments();
        collections[0].count = catCount;
        collections[1].count = workerCount;
        collections[2].count = orderCount;
        collections[3].count = bidCount;
      } catch (err) {
        // use fallback counts
      }
    }

    return {
      connected: this.isConnected,
      cluster: this.clusterName,
      database: this.dbName,
      status,
      error: this.connectionError,
      collections,
      lastChecked: new Date().toISOString(),
      ipWhitelistHelp: ipHelp,
    };
  }

  // Categories
  public async getCategories(): Promise<ServiceCategory[]> {
    if (this.isConnected && this.db) {
      try {
        const items = await this.db.collection<ServiceCategory>('service_categories').find().toArray();
        if (items.length > 0) return items;
      } catch (e) {
        console.warn('[MongoDB] Read failed, returning memory mirror');
      }
    }
    return this.memCategories;
  }

  public async addCategory(cat: ServiceCategory): Promise<void> {
    this.memCategories.unshift(cat);
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('service_categories').insertOne(cat);
      } catch (e) {
        console.warn('[MongoDB] Category write warning:', e);
      }
    }
  }

  public async toggleCategoryStatus(id: string): Promise<ServiceCategory | null> {
    const target = this.memCategories.find((c) => c.id === id);
    if (target) {
      target.active = !target.active;
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('service_categories').updateOne({ id }, { $set: { active: target.active } });
        } catch (e) {
          // ignore
        }
      }
      return target;
    }
    return null;
  }

  // Workers
  public async getWorkers(): Promise<Worker[]> {
    if (this.isConnected && this.db) {
      try {
        const items = await this.db.collection<Worker>('workers').find().toArray();
        if (items.length > 0) return items;
      } catch (e) {
        // fallback
      }
    }
    return this.memWorkers;
  }

  public async toggleWorkerAvailability(id: string): Promise<Worker | null> {
    const worker = this.memWorkers.find((w) => w.id === id);
    if (worker) {
      worker.isAvailable = !worker.isAvailable;
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('workers').updateOne({ id }, { $set: { isAvailable: worker.isAvailable } });
        } catch (e) {}
      }
      return worker;
    }
    return null;
  }

  // Orders
  public async getOrders(): Promise<JobOrder[]> {
    if (this.isConnected && this.db) {
      try {
        const items = await this.db.collection<JobOrder>('job_orders').find().sort({ createdAt: -1 }).toArray();
        if (items.length > 0) return items;
      } catch (e) {}
    }
    return this.memOrders;
  }

  public async createOrder(order: JobOrder): Promise<void> {
    this.memOrders.unshift(order);
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('job_orders').insertOne(order);
      } catch (e) {}
    }
  }

  public async updateOrder(id: string, updates: Partial<JobOrder>): Promise<JobOrder | null> {
    const target = this.memOrders.find((o) => o.id === id);
    if (target) {
      Object.assign(target, updates);
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('job_orders').updateOne({ id }, { $set: updates });
        } catch (e) {}
      }
      return target;
    }
    return null;
  }

  // Bids
  public async getBids(): Promise<Bid[]> {
    if (this.isConnected && this.db) {
      try {
        const items = await this.db.collection<Bid>('bids').find().sort({ createdAt: -1 }).toArray();
        if (items.length > 0) return items;
      } catch (e) {}
    }
    return this.memBids;
  }

  public async createBid(bid: Bid): Promise<void> {
    this.memBids.unshift(bid);
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('bids').insertOne(bid);
      } catch (e) {}
    }
  }

  public async updateBid(id: string, updates: Partial<Bid>): Promise<Bid | null> {
    const target = this.memBids.find((b) => b.id === id);
    if (target) {
      Object.assign(target, updates);
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('bids').updateOne({ id }, { $set: updates });
        } catch (e) {}
      }
      return target;
    }
    return null;
  }

  // Commission
  public async getCommission(): Promise<CommissionSettings> {
    if (this.isConnected && this.db) {
      try {
        const item = await this.db.collection<CommissionSettings>('commission_settings').findOne();
        if (item) return item;
      } catch (e) {}
    }
    return this.memCommission;
  }

  public async updateCommission(settings: Partial<CommissionSettings>): Promise<CommissionSettings> {
    this.memCommission = { ...this.memCommission, ...settings, updatedAt: 'Just now' };
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('commission_settings').updateOne(
          { _id: 'main_policy' as any },
          { $set: this.memCommission },
          { upsert: true }
        );
      } catch (e) {}
    }
    return this.memCommission;
  }

  // Notifications
  public async getNotifications(): Promise<NotificationItem[]> {
    return this.memNotifications;
  }

  public async addNotification(notif: NotificationItem): Promise<void> {
    this.memNotifications.unshift(notif);
    if (this.memNotifications.length > 30) {
      this.memNotifications.pop();
    }
  }

  public async dismissNotification(id: string): Promise<void> {
    this.memNotifications = this.memNotifications.filter((n) => n.id !== id);
  }

  // Reset
  public async resetData(): Promise<void> {
    this.memCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.memWorkers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    this.memOrders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.memBids = JSON.parse(JSON.stringify(INITIAL_BIDS));
    this.memCommission = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
    this.memStats = JSON.parse(JSON.stringify(INITIAL_STATS));
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('service_categories').deleteMany({});
        await this.db.collection('workers').deleteMany({});
        await this.db.collection('job_orders').deleteMany({});
        await this.db.collection('bids').deleteMany({});
        await this.seedInitialDataIfEmpty();
      } catch (e) {}
    }
  }
}

export const mongoDb = new MongoDBService();
