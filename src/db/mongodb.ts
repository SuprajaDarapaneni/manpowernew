import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import {
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  CommissionSettings,
  NotificationItem,
  RegisteredUser,
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

export const INITIAL_USERS: RegisteredUser[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    role: 'admin',
    emailOrPhone: 'admin@gmail.com',
    password: 'admin',
    verified: true,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'admin-2',
    name: 'Platform Admin',
    role: 'admin',
    emailOrPhone: 'admin@manpowerlink.com',
    password: 'admin123',
    verified: true,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'cust-101',
    name: 'Kiran Transport & Co.',
    businessName: 'Kiran Transport & Co.',
    role: 'customer',
    emailOrPhone: '+91 98450 11223',
    location: 'Mangalore, Karnataka',
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'cust-102',
    name: 'Apex Warehousing Ltd',
    businessName: 'Apex Warehousing Ltd',
    role: 'customer',
    emailOrPhone: '+91 98450 44556',
    location: 'Bangalore, Karnataka',
    password: '1234',
    verified: true,
    createdAt: '2026-10-02T09:30:00Z',
  },
  {
    id: 'cust-103',
    name: 'Skyline Events & Catering',
    businessName: 'Skyline Events & Catering',
    role: 'customer',
    emailOrPhone: '+91 98450 77889',
    location: 'Udupi, Karnataka',
    password: '1234',
    verified: true,
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'w-ramesh',
    name: 'Ramesh Gowda',
    role: 'employee',
    emailOrPhone: '+91 98765 43210',
    workerCategory: 'Loading & Unloading',
    hourlyRate: 250,
    location: 'Baikampady, Mangalore',
    rating: 4.8,
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'w-suresh',
    name: 'Suresh Poojary',
    role: 'employee',
    emailOrPhone: '+91 98765 11223',
    workerCategory: 'Masonry & Concrete',
    hourlyRate: 350,
    location: 'Surathkal, Mangalore',
    rating: 4.9,
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'w-manjunath',
    name: 'Manjunath Rao',
    role: 'employee',
    emailOrPhone: '+91 97410 88231',
    workerCategory: 'Packing & Moving',
    hourlyRate: 290,
    location: 'Kankanady, Mangalore',
    rating: 4.9,
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T09:30:00Z',
  },
  {
    id: 'w-venkatesh',
    name: 'Venkatesh Prasad',
    role: 'employee',
    emailOrPhone: '+91 94480 66522',
    workerCategory: 'Construction Support',
    hourlyRate: 270,
    location: 'Kadri Hills, Mangalore',
    rating: 4.7,
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'w-priya',
    name: "Priya D'Souza",
    role: 'employee',
    emailOrPhone: '+91 99001 44552',
    workerCategory: 'House Cleaning',
    hourlyRate: 220,
    location: 'Bejai, Mangalore',
    rating: 4.9,
    password: '1234',
    verified: true,
    createdAt: '2026-10-01T10:30:00Z',
  },
];

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
  public memUsers: RegisteredUser[] = JSON.parse(JSON.stringify(INITIAL_USERS));
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
      await this.syncAndEnsureUsers();
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
        await this.db.collection('users').insertMany(INITIAL_USERS);
        await this.db.collection('commission_settings').insertOne({ ...INITIAL_COMMISSION, _id: 'main_policy' as any });
        console.log('[MongoDB] Seeding completed successfully!');
      }
    } catch (e: any) {
      console.warn('[MongoDB] Seeding note:', e.message);
    }
  }

  public async syncAndEnsureUsers(): Promise<void> {
    if (!this.db || !this.isConnected) return;
    try {
      const usersCol = this.db.collection<RegisteredUser>('users');
      for (const initialUser of INITIAL_USERS) {
        const cleanDigits = initialUser.emailOrPhone.replace(/[\s+-]/g, '');
        const query: any = {
          $or: [
            { id: initialUser.id },
            { emailOrPhone: initialUser.emailOrPhone },
            { emailOrPhone: initialUser.emailOrPhone.toLowerCase() },
          ],
        };
        if (cleanDigits.length >= 8) {
          query.$or.push({ emailOrPhone: { $regex: cleanDigits.slice(-10), $options: 'i' } });
        }

        const existing = await usersCol.findOne(query);
        if (!existing) {
          await usersCol.insertOne(initialUser);
          console.log(`[MongoDB] Added missing initial user to Atlas: ${initialUser.name} (${initialUser.emailOrPhone})`);
        } else if (!existing.password || existing.password !== initialUser.password) {
          await usersCol.updateOne(
            { _id: existing._id },
            { $set: { password: initialUser.password, role: initialUser.role, verified: true } }
          );
          console.log(`[MongoDB] Verified & updated credentials in Atlas for: ${initialUser.name}`);
        }
      }

      // Also ensure all workers exist in workers collection
      const workersCol = this.db.collection<Worker>('workers');
      for (const w of INITIAL_WORKERS) {
        const existingWorker = await workersCol.findOne({ id: w.id });
        if (!existingWorker) {
          await workersCol.insertOne(w);
          console.log(`[MongoDB] Added missing worker profile to Atlas: ${w.name}`);
        }
      }

      // Refresh in-memory mirror from Atlas
      const atlasUsers = await usersCol.find().toArray();
      if (atlasUsers.length > 0) {
        this.memUsers = atlasUsers;
      }
      const atlasWorkers = await workersCol.find().toArray();
      if (atlasWorkers.length > 0) {
        this.memWorkers = atlasWorkers;
      }
    } catch (e: any) {
      console.warn('[MongoDB] syncAndEnsureUsers warning:', e.message);
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
      { name: 'users', count: this.memUsers.length },
      { name: 'service_categories', count: this.memCategories.length },
      { name: 'workers', count: this.memWorkers.length },
      { name: 'job_orders', count: this.memOrders.length },
      { name: 'bids', count: this.memBids.length },
      { name: 'commission_settings', count: 1 },
      { name: 'notifications', count: this.memNotifications.length },
    ];

    if (this.isConnected && this.db) {
      try {
        const userCount = await this.db.collection('users').countDocuments();
        const catCount = await this.db.collection('service_categories').countDocuments();
        const workerCount = await this.db.collection('workers').countDocuments();
        const orderCount = await this.db.collection('job_orders').countDocuments();
        const bidCount = await this.db.collection('bids').countDocuments();
        collections[0].count = userCount;
        collections[1].count = catCount;
        collections[2].count = workerCount;
        collections[3].count = orderCount;
        collections[4].count = bidCount;
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

  public async updateCategory(id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | null> {
    const target = this.memCategories.find((c) => c.id === id);
    if (target) {
      Object.assign(target, updates);
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('service_categories').updateOne({ id }, { $set: updates });
        } catch (e) {
          // ignore
        }
      }
      return target;
    }
    return null;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const index = this.memCategories.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.memCategories.splice(index, 1);
      if (this.isConnected && this.db) {
        try {
          await this.db.collection('service_categories').deleteOne({ id });
        } catch (e) {
          // ignore
        }
      }
      return true;
    }
    return false;
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

  public async addWorker(worker: Worker): Promise<void> {
    this.memWorkers.unshift(worker);
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('workers').insertOne(worker);
      } catch (e) {
        console.warn('[MongoDB] Worker insert warning:', e);
      }
    }
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

  // Users
  public async getUsers(): Promise<RegisteredUser[]> {
    if (this.isConnected && this.db) {
      try {
        const items = await this.db.collection<RegisteredUser>('users').find().toArray();
        if (items && items.length > 0) return items;
      } catch (e) {}
    }
    return this.memUsers;
  }

  public async addUser(user: RegisteredUser): Promise<void> {
    const existingIndex = this.memUsers.findIndex((u) => u.id === user.id || u.emailOrPhone === user.emailOrPhone);
    if (existingIndex >= 0) {
      this.memUsers[existingIndex] = { ...this.memUsers[existingIndex], ...user };
    } else {
      this.memUsers.unshift(user);
    }

    if (this.isConnected && this.db) {
      try {
        await this.db.collection('users').updateOne(
          { $or: [{ id: user.id }, { emailOrPhone: user.emailOrPhone }] },
          { $set: user },
          { upsert: true }
        );
      } catch (e) {
        console.warn('[MongoDB] User upsert warning:', e);
      }
    }
  }

  public async findUser(emailOrPhone: string): Promise<RegisteredUser | undefined> {
    const clean = emailOrPhone.trim().toLowerCase();
    const cleanNumeric = emailOrPhone.replace(/[\s+-]/g, '');

    if (this.isConnected && this.db) {
      try {
        const query: any = {
          $or: [
            { emailOrPhone: emailOrPhone.trim() },
            { id: emailOrPhone.trim() },
            { emailOrPhone: clean },
          ],
        };
        if (cleanNumeric.length >= 7) {
          query.$or.push({ emailOrPhone: { $regex: cleanNumeric.slice(-10), $options: 'i' } });
        }
        const found = await this.db.collection<RegisteredUser>('users').findOne(query);
        if (found) return found;
      } catch (e) {}
    }

    return this.memUsers.find((u) => {
      const uEmailOrPhone = u.emailOrPhone.toLowerCase();
      const uNumeric = u.emailOrPhone.replace(/[\s+-]/g, '');
      return (
        uEmailOrPhone === clean ||
        u.id.toLowerCase() === clean ||
        (cleanNumeric.length > 5 && uNumeric.includes(cleanNumeric.slice(-8))) ||
        (Boolean((u as any).phone) && (u as any).phone.replace(/[\s+-]/g, '').includes(cleanNumeric.slice(-8)))
      );
    });
  }

  public async updateUserPassword(emailOrPhone: string, newPassword: string): Promise<boolean> {
    const clean = emailOrPhone.trim().toLowerCase();
    const cleanNumeric = emailOrPhone.replace(/[\s+-]/g, '');

    // Update in memory
    const user = this.memUsers.find((u) => {
      const uEmailOrPhone = u.emailOrPhone.toLowerCase();
      const uNumeric = u.emailOrPhone.replace(/[\s+-]/g, '');
      return (
        uEmailOrPhone === clean ||
        u.id.toLowerCase() === clean ||
        (cleanNumeric.length > 5 && uNumeric === cleanNumeric)
      );
    });

    if (user) {
      user.password = newPassword;
    }

    // Update in MongoDB
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('users').updateOne(
          {
            $or: [
              { emailOrPhone: emailOrPhone.trim() },
              { emailOrPhone: clean },
              { id: emailOrPhone.trim() },
            ],
          },
          { $set: { password: newPassword } }
        );
      } catch (e) {
        console.warn('[MongoDB] updateUserPassword warning:', e);
      }
    }

    return true;
  }

  public async deleteUser(emailOrPhone: string): Promise<boolean> {
    const clean = emailOrPhone.trim().toLowerCase();
    const cleanNumeric = emailOrPhone.replace(/[\s+-]/g, '');

    // Remove from in-memory array
    const initialLen = this.memUsers.length;
    this.memUsers = this.memUsers.filter((u) => {
      const uEmailOrPhone = u.emailOrPhone.toLowerCase();
      const uNumeric = u.emailOrPhone.replace(/[\s+-]/g, '');
      const match =
        uEmailOrPhone === clean ||
        u.id.toLowerCase() === clean ||
        (cleanNumeric.length > 5 && uNumeric === cleanNumeric);
      return !match;
    });

    // Also remove from workers if registered as worker
    this.memWorkers = this.memWorkers.filter((w) => {
      const wPhone = w.phone.replace(/[\s+-]/g, '');
      return wPhone !== cleanNumeric && w.id !== clean;
    });

    // Remove from MongoDB Atlas
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('users').deleteMany({
          $or: [
            { emailOrPhone: emailOrPhone.trim() },
            { emailOrPhone: clean },
            { id: emailOrPhone.trim() },
          ],
        });
        await this.db.collection('workers').deleteMany({
          $or: [
            { phone: emailOrPhone.trim() },
            { id: emailOrPhone.trim() },
          ],
        });
      } catch (e) {
        console.warn('[MongoDB] deleteUser warning:', e);
      }
    }

    return true;
  }

  // Reset
  public async resetData(): Promise<void> {
    this.memCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.memWorkers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    this.memOrders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.memBids = JSON.parse(JSON.stringify(INITIAL_BIDS));
    this.memCommission = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
    this.memStats = JSON.parse(JSON.stringify(INITIAL_STATS));
    this.memUsers = JSON.parse(JSON.stringify(INITIAL_USERS));
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('service_categories').deleteMany({});
        await this.db.collection('workers').deleteMany({});
        await this.db.collection('job_orders').deleteMany({});
        await this.db.collection('bids').deleteMany({});
        await this.db.collection('users').deleteMany({});
        await this.seedInitialDataIfEmpty();
      } catch (e) {}
    }
  }
}

export const mongoDb = new MongoDBService();
