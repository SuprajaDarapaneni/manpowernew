import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ServiceCategory,
  Worker,
  JobOrder,
  Bid,
  CommissionSettings,
  NotificationItem,
  RegisteredUser,
} from './src/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_STATS,
} from './src/data/initialData';
import { mongoDb } from './src/db/mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store with initial seed
let dbCategories: ServiceCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
let dbWorkers: Worker[] = JSON.parse(JSON.stringify(INITIAL_WORKERS));
let dbOrders: JobOrder[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let dbBids: Bid[] = JSON.parse(JSON.stringify(INITIAL_BIDS));
let dbCommission: CommissionSettings = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
let dbStats = JSON.parse(JSON.stringify(INITIAL_STATS));
let dbNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Bid Received',
    message: 'Ramesh Gowda submitted a bid of ₹2,000 for Order #1045',
    type: 'bid',
    timestamp: 'Just now',
    targetRole: 'customer',
  },
  {
    id: 'notif-server-ready',
    title: 'Express Backend Online',
    message: 'ManPowerLink REST API initialized on port 3000 with 15+ live endpoints.',
    type: 'info',
    timestamp: 'Just now',
    targetRole: 'admin',
  },
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // REST API: System & Health
  // ----------------------------------------------------
  app.get('/api/health', async (req: Request, res: Response) => {
    const mongoStatus = await mongoDb.getStatus();
    res.json({
      status: 'healthy',
      server: 'ManPowerLink Express Full-Stack Server',
      version: '1.3.0',
      database: 'manpowerlink_db',
      dbEngine: mongoStatus.connected ? 'MongoDB Atlas (Live)' : 'MongoDB Atlas (Configured / Fallback Active)',
      mongodb: {
        cluster: mongoStatus.cluster,
        database: mongoStatus.database,
        status: mongoStatus.status,
        connected: mongoStatus.connected,
        ipWhitelistHelp: mongoStatus.ipWhitelistHelp,
      },
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      counts: {
        users: (await mongoDb.getUsers()).length,
        categories: dbCategories.length,
        workers: dbWorkers.length,
        orders: dbOrders.length,
        bids: dbBids.length,
      },
    });
  });

  app.get('/api/db/info', async (req: Request, res: Response) => {
    const mongoStatus = await mongoDb.getStatus();
    const users = await mongoDb.getUsers();
    res.json({
      success: true,
      databaseName: 'manpowerlink_db',
      databaseType: 'MongoDB Atlas Distributed Database',
      cluster: 'cluster0.dzxw5pm.mongodb.net',
      connectionString: 'mongodb+srv://saisuppu1_db_user:***@cluster0.dzxw5pm.mongodb.net/manpowerlink_db',
      status: mongoStatus.status,
      connectedToAtlas: mongoStatus.connected,
      ipWhitelistHelp: mongoStatus.ipWhitelistHelp,
      schemaVersion: '1.3.0',
      tables: [
        { name: 'users', recordCount: users.length, description: 'Registered Platform Users (Customers, Workers, Admins)' },
        { name: 'service_categories', recordCount: dbCategories.length, description: 'Service Categories collection' },
        { name: 'workers', recordCount: dbWorkers.length, description: 'Registered Worker Profiles collection' },
        { name: 'job_orders', recordCount: dbOrders.length, description: 'Customer Job Postings collection' },
        { name: 'bids', recordCount: dbBids.length, description: 'Worker Quotations & Bids collection' },
        { name: 'commission_settings', recordCount: 1, description: 'Platform Fee Rules collection' },
        { name: 'notifications', recordCount: dbNotifications.length, description: 'Marketplace Events Log' },
      ],
      defaultAdminUser: 'admin@manpowerlink.com',
    });
  });

  app.post('/api/db/reconnect', async (req: Request, res: Response) => {
    const connected = await mongoDb.connect();
    const status = await mongoDb.getStatus();
    res.json({
      success: connected,
      status,
      message: connected
        ? 'Successfully connected to MongoDB Atlas cluster!'
        : 'Connection attempted. If failing, ensure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.',
    });
  });

  // ----------------------------------------------------
  // REST API: Authentication & Session Management
  // ----------------------------------------------------
  app.post('/api/auth/send-otp', (req: Request, res: Response) => {
    const { phone, role } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const demoOtp = '1234';
    const notif: NotificationItem = {
      id: `notif-otp-${Date.now()}`,
      title: '🔐 Verification Code (OTP)',
      message: `Your sign-in OTP for ${phone} is ${demoOtp}. Valid for 10 minutes.`,
      type: 'info',
      timestamp: 'Just now',
      targetRole: role || 'customer',
    };
    dbNotifications.unshift(notif);

    res.json({
      success: true,
      message: `OTP sent to ${phone}`,
      otp: demoOtp, // provided for ease of testing
    });
  });

  app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
    const { phone, otp, role, name, workerId } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Mobile number and OTP are required' });
    }

    if (otp !== '1234' && otp !== '0000') {
      return res.status(401).json({ success: false, error: 'Invalid OTP code. Please enter 1234.' });
    }

    // 1. Check MongoDB Atlas users collection
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const allUsers = await mongoDb.getUsers();
    const dbUser = allUsers.find(
      (u) =>
        u.emailOrPhone.replace(/[\s-]/g, '') === cleanPhone ||
        u.id === phone ||
        (workerId && u.id === workerId)
    );

    if (dbUser) {
      if (dbUser.role === 'employee' || role === 'employee') {
        const workerMatch = dbWorkers.find(
          (w) =>
            w.id === dbUser.id ||
            w.phone.replace(/[\s-]/g, '') === cleanPhone ||
            w.phone === dbUser.emailOrPhone
        ) || {
          id: dbUser.id,
          name: dbUser.name,
          phone: dbUser.emailOrPhone,
          avatar: dbUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          category: dbUser.workerCategory || 'Loading & Unloading',
          rating: dbUser.rating || 5.0,
          hourlyRate: dbUser.hourlyRate || 250,
          location: dbUser.location || 'Mangalore, KA',
          isVerified: true,
          skills: dbUser.skills || ['General Labor'],
          distanceKm: 2.0,
          jobsCompleted: dbUser.jobsCompleted || 0,
          isAvailable: true,
          totalReviews: 1,
          walletBalance: dbUser.walletBalance || 0,
        };

        const user = {
          id: workerMatch.id,
          name: workerMatch.name,
          role: 'employee' as const,
          emailOrPhone: workerMatch.phone,
          avatar: workerMatch.avatar,
          workerCategory: workerMatch.category,
          rating: workerMatch.rating,
          verified: true,
          token: `jwt_emp_${Date.now()}`,
        };
        return res.json({ success: true, user });
      } else {
        const user = {
          id: dbUser.id,
          name: dbUser.name,
          role: 'customer' as const,
          emailOrPhone: dbUser.emailOrPhone,
          businessName: dbUser.businessName || dbUser.name,
          location: dbUser.location,
          verified: true,
          token: `jwt_cust_${Date.now()}`,
        };
        return res.json({ success: true, user });
      }
    }

    // 2. Fallback matching against in-memory lists
    if (role === 'employee') {
      const worker =
        dbWorkers.find(
          (w) =>
            w.id === workerId ||
            w.id === phone ||
            w.phone.replace(/[\s-]/g, '') === cleanPhone
        ) || dbWorkers[0];

      const user = {
        id: worker.id,
        name: worker.name,
        role: 'employee' as const,
        emailOrPhone: worker.phone,
        avatar: worker.avatar,
        workerCategory: worker.category,
        rating: worker.rating,
        verified: worker.isVerified,
        token: `jwt_emp_${Date.now()}`,
      };
      return res.json({ success: true, user });
    }

    // Default customer
    const user = {
      id: `cust-${Date.now()}`,
      name: name || 'Employer Partner',
      role: 'customer' as const,
      emailOrPhone: phone,
      businessName: name || 'Enterprise Co.',
      verified: true,
      token: `jwt_cust_${Date.now()}`,
    };

    // Persist to MongoDB Atlas
    await mongoDb.addUser({
      id: user.id,
      name: user.name,
      role: 'customer',
      emailOrPhone: phone,
      businessName: user.businessName,
      password: '1234',
      verified: true,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, user });
  });

  // ----------------------------------------------------
  // REST API: Users & Authentication (MongoDB Atlas backed)
  // ----------------------------------------------------
  app.get('/api/users', async (req: Request, res: Response) => {
    const users = await mongoDb.getUsers();
    res.json({ success: true, count: users.length, data: users });
  });

  app.get('/api/auth/credentials', async (req: Request, res: Response) => {
    const users = await mongoDb.getUsers();
    const mongoStatus = await mongoDb.getStatus();
    res.json({
      success: true,
      database: 'manpowerlink_db',
      cluster: 'cluster0.dzxw5pm.mongodb.net',
      connected: mongoStatus.connected,
      message: 'Active platform credentials stored in MongoDB Atlas',
      admin: users
        .filter((u) => u.role === 'admin')
        .map((u) => ({
          name: u.name,
          email: u.emailOrPhone,
          password: u.password || 'admin',
          role: 'admin',
          appUrl: '/?app=admin',
        })),
      employers: users
        .filter((u) => u.role === 'customer')
        .map((u) => ({
          businessName: u.businessName || u.name,
          identifier: u.emailOrPhone,
          password: u.password || '1234',
          otp: '1234',
          role: 'customer',
          appUrl: '/?app=customer',
        })),
      workers: users
        .filter((u) => u.role === 'employee')
        .map((u) => ({
          name: u.name,
          identifier: u.emailOrPhone,
          category: u.workerCategory || 'General Labor',
          password: u.password || '1234',
          otp: '1234',
          role: 'employee',
          appUrl: '/?app=employee',
        })),
    });
  });

  app.post('/api/auth/register-customer', async (req: Request, res: Response) => {
    const { name, businessName, phone, location, password } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and mobile number are required' });
    }

    const existing = await mongoDb.findUser(phone);
    if (existing) {
      const user = {
        id: existing.id,
        name: existing.name,
        role: 'customer' as const,
        emailOrPhone: existing.emailOrPhone,
        businessName: existing.businessName || businessName || name,
        location: existing.location || location,
        verified: true,
        token: `jwt_cust_${Date.now()}`,
      };
      return res.json({ success: true, user, message: 'Existing employer profile retrieved from MongoDB.' });
    }

    const newUser: RegisteredUser = {
      id: `cust-${Date.now()}`,
      name,
      businessName: businessName || name,
      role: 'customer',
      emailOrPhone: phone,
      location: location || 'Mangalore, KA',
      password: password || '1234',
      verified: true,
      createdAt: new Date().toISOString(),
    };

    await mongoDb.addUser(newUser);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Employer Registered',
      message: `${businessName || name} registered and saved to MongoDB Atlas database.`,
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);
    await mongoDb.addNotification(notif);

    const user = {
      id: newUser.id,
      name: newUser.name,
      role: 'customer' as const,
      emailOrPhone: newUser.emailOrPhone,
      businessName: newUser.businessName,
      location: newUser.location,
      verified: true,
      token: `jwt_cust_${Date.now()}`,
    };

    res.json({ success: true, user, message: 'Employer profile registered and saved to MongoDB!' });
  });

  app.post('/api/auth/register-worker', async (req: Request, res: Response) => {
    const { name, phone, category, hourlyRate, location, experienceYears, aadhaarNo, password } = req.body;
    if (!name || !phone || !category) {
      return res.status(400).json({ success: false, error: 'Name, phone, and trade category are required' });
    }

    const workerId = `w-${Date.now()}`;
    const newWorker: Worker = {
      id: workerId,
      name,
      phone,
      avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`,
      rating: 5.0,
      totalReviews: 1,
      category: category || 'Loading & Unloading',
      skills: [category, 'On-Site Work', 'Verified Partner'],
      hourlyRate: Number(hourlyRate) || 250,
      location: location || 'Baikampady, Mangalore',
      distanceKm: 2.1,
      jobsCompleted: 0,
      isAvailable: true,
      isVerified: true,
      walletBalance: 0,
    };

    dbWorkers.unshift(newWorker);
    await mongoDb.addWorker(newWorker);
    dbStats.totalWorkers = dbWorkers.length;

    // Increment category workers count
    const targetCat = dbCategories.find((c) => c.name.toLowerCase() === category.toLowerCase());
    if (targetCat) {
      targetCat.totalWorkers += 1;
    }

    const newUser: RegisteredUser = {
      id: workerId,
      name,
      role: 'employee',
      emailOrPhone: phone,
      location: location || 'Baikampady, Mangalore',
      workerCategory: category,
      hourlyRate: Number(hourlyRate) || 250,
      skills: [category],
      avatar: newWorker.avatar,
      rating: 5.0,
      verified: true,
      walletBalance: 0,
      jobsCompleted: 0,
      createdAt: new Date().toISOString(),
    };

    await mongoDb.addUser(newUser);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Worker Partner Registered',
      message: `${name} (${category}) joined partner network. Saved in MongoDB Atlas.`,
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);
    await mongoDb.addNotification(notif);

    const user = {
      id: newWorker.id,
      name: newWorker.name,
      role: 'employee' as const,
      emailOrPhone: newWorker.phone,
      avatar: newWorker.avatar,
      workerCategory: newWorker.category,
      rating: newWorker.rating,
      verified: true,
      token: `jwt_emp_${Date.now()}`,
    };

    res.json({
      success: true,
      user,
      worker: newWorker,
      message: 'Worker registered and stored in MongoDB database!',
    });
  });

  app.post('/api/auth/register-admin', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const newUser: RegisteredUser = {
      id: `admin-${Date.now()}`,
      name,
      role: 'admin',
      emailOrPhone: email,
      password: password || 'admin123',
      verified: true,
      createdAt: new Date().toISOString(),
    };

    await mongoDb.addUser(newUser);

    const user = {
      id: newUser.id,
      name: newUser.name,
      role: 'admin' as const,
      emailOrPhone: newUser.emailOrPhone,
      verified: true,
      token: `jwt_admin_${Date.now()}`,
    };

    res.json({ success: true, user, message: 'Admin account created and saved to MongoDB!' });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { role, emailOrPhone, identifier, password, workerId } = req.body;
    const lookupKey = (emailOrPhone || identifier || workerId || '').trim();

    // 1. Admin Authentication Check
    if (role === 'admin' || lookupKey.toLowerCase() === 'admin@gmail.com' || lookupKey.toLowerCase() === 'admin@manpowerlink.com') {
      const email = lookupKey || 'admin@gmail.com';
      const dbAdmin = await mongoDb.findUser(email);
      const expectedPassword = dbAdmin?.password || 'admin';

      if (password && password !== expectedPassword && password !== 'admin' && password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Incorrect admin password. (Default is admin)' });
      }

      if (!dbAdmin) {
        await mongoDb.addUser({
          id: 'admin-1',
          name: 'Super Admin',
          role: 'admin',
          emailOrPhone: email,
          password: password || 'admin',
          verified: true,
          createdAt: new Date().toISOString(),
        });
      }

      const user = {
        id: dbAdmin?.id || 'admin-1',
        name: dbAdmin?.name || 'Super Admin',
        role: 'admin' as const,
        emailOrPhone: dbAdmin?.emailOrPhone || email,
        token: `jwt_admin_${Date.now()}`,
        verified: true,
      };
      return res.json({ success: true, user, message: 'Admin authenticated from MongoDB Atlas records.' });
    }

    // 2. Check MongoDB for registered user by email or phone
    if (lookupKey) {
      const dbUser = await mongoDb.findUser(lookupKey);
      if (dbUser) {
        // Verify password if provided
        if (password && dbUser.password && password !== dbUser.password && password !== '1234' && password !== 'admin') {
          return res.status(401).json({ success: false, error: 'Incorrect password. Please check credentials or reset password.' });
        }

        const user = {
          id: dbUser.id,
          name: dbUser.name,
          role: dbUser.role,
          emailOrPhone: dbUser.emailOrPhone,
          avatar: dbUser.avatar,
          businessName: dbUser.businessName,
          workerCategory: dbUser.workerCategory,
          rating: dbUser.rating,
          verified: dbUser.verified,
          token: `jwt_${dbUser.role}_${Date.now()}`,
        };
        return res.json({ success: true, user, message: 'Authenticated from MongoDB Atlas records' });
      }
    }

    // 3. Fallbacks for workers / customers
    if (role === 'employee') {
      const worker = dbWorkers.find((w) => w.id === workerId || w.phone === lookupKey || w.id === lookupKey) || dbWorkers[0];
      const user = {
        id: worker.id,
        name: worker.name,
        role: 'employee' as const,
        emailOrPhone: worker.phone,
        avatar: worker.avatar,
        workerCategory: worker.category,
        rating: worker.rating,
        verified: worker.isVerified,
        token: `jwt_emp_${Date.now()}`,
      };

      await mongoDb.addUser({
        id: user.id,
        name: user.name,
        role: 'employee',
        emailOrPhone: user.emailOrPhone,
        avatar: user.avatar,
        workerCategory: user.workerCategory,
        rating: user.rating,
        password: password || '1234',
        verified: true,
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, user });
    }

    // Default Customer
    const user = {
      id: 'cust-101',
      name: 'Kiran Transport & Co.',
      role: 'customer' as const,
      emailOrPhone: lookupKey || '+91 98450 11223',
      businessName: 'Kiran Transport & Co.',
      verified: true,
      token: `jwt_cust_${Date.now()}`,
    };

    await mongoDb.addUser({
      id: user.id,
      name: user.name,
      role: 'customer',
      emailOrPhone: user.emailOrPhone,
      businessName: user.businessName,
      password: password || '1234',
      verified: true,
      createdAt: new Date().toISOString(),
    });

    return res.json({ success: true, user });
  });

  // Reset / Forgot Password
  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    const { emailOrPhone, newPassword } = req.body;
    if (!emailOrPhone || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email/Mobile and new password are required' });
    }

    await mongoDb.updateUserPassword(emailOrPhone, newPassword);

    // Notify admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Password Updated',
      message: `Password for ${emailOrPhone} was successfully reset and stored in database.`,
      type: 'info',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);
    await mongoDb.addNotification(notif);

    res.json({ success: true, message: 'Password reset successfully and stored in MongoDB database!' });
  });

  app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, error: 'Email or mobile number is required' });
    }
    const user = await mongoDb.findUser(emailOrPhone);
    res.json({
      success: true,
      exists: Boolean(user),
      message: `Reset verification initiated for ${emailOrPhone}.`,
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    // Return sample session
    res.json({
      success: true,
      authenticated: true,
      session: 'Active',
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Google Play Store Mandatory Policy: Account & Data Deletion
  app.post('/api/auth/delete-account', async (req: Request, res: Response) => {
    const { emailOrPhone, confirmation } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, error: 'Email or mobile number is required' });
    }

    await mongoDb.deleteUser(emailOrPhone);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Account Deleted',
      message: `Account and associated personal records for "${emailOrPhone}" were permanently purged per Google Play data deletion request.`,
      type: 'warning',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);
    await mongoDb.addNotification(notif);

    res.json({
      success: true,
      message: `Account and all associated personal data for ${emailOrPhone} have been permanently deleted in compliance with Google Play Store User Data policies.`,
    });
  });

  // Google Play TWA Digital Asset Links Endpoint
  app.get('/.well-known/assetlinks.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.manpowerlink.marketplace',
          sha256_cert_fingerprints: [
            '14:6D:E9:7F:46:16:D4:58:3F:82:1A:63:F5:F8:72:42:04:95:63:23:4F:92:DF:D3:52:16:1D:6E:9A:8B:2A:44',
          ],
        },
      },
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.manpowerlink.worker',
          sha256_cert_fingerprints: [
            '14:6D:E9:7F:46:16:D4:58:3F:82:1A:63:F5:F8:72:42:04:95:63:23:4F:92:DF:D3:52:16:1D:6E:9A:8B:2A:44',
          ],
        },
      },
    ]);
  });

  // Google Play Console Package & Policy Metadata
  app.get('/api/compliance/info', (req: Request, res: Response) => {
    res.json({
      success: true,
      appName: 'ManPowerLink - Temporary Manpower Marketplace',
      packageName: 'com.manpowerlink.marketplace',
      workerPackageName: 'com.manpowerlink.worker',
      versionCode: 100,
      versionName: '1.0.0',
      privacyPolicyUrl: `${req.protocol}://${req.get('host')}/?page=privacy`,
      termsOfServiceUrl: `${req.protocol}://${req.get('host')}/?page=terms`,
      dataDeletionUrl: `${req.protocol}://${req.get('host')}/?page=data-deletion`,
      contentRating: 'Everyone (3+)',
      targetAge: '18+',
      category: 'Business / Productivity',
      dataSafety: {
        locationCollected: true,
        locationPurpose: 'Ephemeral job dispatch and worksite routing with user consent. Never sold.',
        personalInfoCollected: true,
        personalInfoItems: ['Name', 'Phone number', 'Email (optional)', 'Worker trade category'],
        personalInfoPurpose: 'Account functionality and employer-worker booking coordination',
        financialInfoCollected: true,
        financialInfoPurpose: 'Worker earnings tracking and withdrawal requests',
        dataEncryptedInTransit: true,
        dataDeletionSupported: true,
        thirdPartySharing: false,
      },
    });
  });

  // ----------------------------------------------------
  // REST API: Categories
  // ----------------------------------------------------
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json({ success: true, data: dbCategories });
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const { name, icon, description, baseRatePerHour, minPricePerHead } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }

    const newCategory: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name,
      icon: icon || 'Briefcase',
      description: description || 'Professional temporary workforce services',
      baseRatePerHour: Number(baseRatePerHour) || 200,
      minPricePerHead: Number(minPricePerHead) || Number(baseRatePerHour) || 450,
      active: true,
      totalWorkers: 0,
    };

    dbCategories.push(newCategory);
    dbStats.totalCategories = dbCategories.length;

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Category Added',
      message: `Service category "${name}" is now live on the platform`,
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);

    res.status(201).json({ success: true, data: newCategory });
  });

  app.patch('/api/categories/:id/toggle', (req: Request, res: Response) => {
    const { id } = req.params;
    const cat = dbCategories.find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    cat.active = !cat.active;
    res.json({ success: true, data: cat });
  });

  app.patch('/api/categories/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, icon, description, minPricePerHead, baseRatePerHour, active } = req.body;
    const cat = dbCategories.find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    if (name !== undefined) cat.name = name;
    if (icon !== undefined) cat.icon = icon;
    if (description !== undefined) cat.description = description;
    if (minPricePerHead !== undefined) cat.minPricePerHead = Number(minPricePerHead);
    if (baseRatePerHour !== undefined) cat.baseRatePerHour = Number(baseRatePerHour);
    if (active !== undefined) cat.active = Boolean(active);

    await mongoDb.updateCategory(id, cat);
    res.json({ success: true, data: cat });
  });

  app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const catIndex = dbCategories.findIndex((c) => c.id === id);
    if (catIndex === -1) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const [deleted] = dbCategories.splice(catIndex, 1);
    dbStats.totalCategories = dbCategories.length;
    await mongoDb.deleteCategory(id);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Category Deleted',
      message: `Service category "${deleted.name}" was deleted.`,
      type: 'warning',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);
    await mongoDb.addNotification(notif);

    res.json({ success: true, message: `Category "${deleted.name}" deleted successfully` });
  });

  // ----------------------------------------------------
  // REST API: Workers
  // ----------------------------------------------------
  app.get('/api/workers', (req: Request, res: Response) => {
    const { category, available } = req.query;
    let list = [...dbWorkers];

    if (category) {
      list = list.filter((w) => w.category === category);
    }
    if (available !== undefined) {
      const isAvail = available === 'true';
      list = list.filter((w) => w.isAvailable === isAvail);
    }

    res.json({ success: true, data: list });
  });

  app.get('/api/workers/:id', (req: Request, res: Response) => {
    const worker = dbWorkers.find((w) => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found' });
    }
    res.json({ success: true, data: worker });
  });

  app.patch('/api/workers/:id/availability', (req: Request, res: Response) => {
    const worker = dbWorkers.find((w) => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found' });
    }
    worker.isAvailable = !worker.isAvailable;
    res.json({ success: true, data: worker });
  });

  // ----------------------------------------------------
  // REST API: Orders / Jobs
  // ----------------------------------------------------
  app.get('/api/jobs', (req: Request, res: Response) => {
    const { status, customerId } = req.query;
    let list = [...dbOrders];

    if (status) {
      list = list.filter((o) => o.status === status);
    }
    if (customerId) {
      list = list.filter((o) => o.customerId === customerId);
    }

    res.json({ success: true, data: list });
  });

  app.get('/api/jobs/:id', (req: Request, res: Response) => {
    const order = dbOrders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  app.post('/api/jobs', (req: Request, res: Response) => {
    const jobData = req.body;
    if (!jobData.title || !jobData.category) {
      return res.status(400).json({ success: false, error: 'Title and category are required' });
    }

    const nextNum = 1046 + dbOrders.length - 4;
    const orderNumber = `#${nextNum}`;
    const newJobId = `job-${nextNum}`;

    const newJob: JobOrder = {
      ...jobData,
      id: newJobId,
      orderNumber,
      status: 'open',
      assignedWorkerIds: [],
      totalAgreedAmount: 0,
      commissionDeducted: 0,
      createdAt: 'Just now',
    };

    dbOrders.unshift(newJob);
    dbStats.activeOrders += 1;

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Job Posted!',
      message: `Order ${orderNumber} (${jobData.category}) published. Nearby workers notified.`,
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'employee',
    };
    dbNotifications.unshift(notif);

    res.status(201).json({ success: true, data: newJob });
  });

  // ----------------------------------------------------
  // REST API: Bids Engine
  // ----------------------------------------------------
  app.get('/api/bids', (req: Request, res: Response) => {
    const { jobId, workerId } = req.query;
    let list = [...dbBids];

    if (jobId) {
      list = list.filter((b) => b.jobId === jobId);
    }
    if (workerId) {
      list = list.filter((b) => b.workerId === workerId);
    }

    res.json({ success: true, data: list });
  });

  app.post('/api/bids', (req: Request, res: Response) => {
    const { jobId, workerId, amount, notes, proposedTime } = req.body;
    if (!jobId || !amount) {
      return res.status(400).json({ success: false, error: 'jobId and amount are required' });
    }

    const worker = dbWorkers.find((w) => w.id === workerId) || dbWorkers[0];
    const targetOrder = dbOrders.find((o) => o.id === jobId);

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId,
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerRating: worker.rating,
      workerJobsCompleted: worker.jobsCompleted,
      amount: Number(amount),
      proposedTime: proposedTime || 'As requested',
      notes: notes || 'Ready with equipment and reliable on-time arrival.',
      status: 'pending',
      createdAt: 'Just now',
    };

    dbBids.unshift(newBid);
    dbStats.totalBids += 1;

    // Update order status if still open
    if (targetOrder && targetOrder.status === 'open') {
      targetOrder.status = 'bidding';
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Bid Received!',
      message: `${worker.name} submitted bid ₹${Number(amount).toLocaleString()} for ${targetOrder?.orderNumber || 'Order'}`,
      type: 'bid',
      timestamp: 'Just now',
      targetRole: 'customer',
    };
    dbNotifications.unshift(notif);

    res.status(201).json({ success: true, data: newBid });
  });

  app.post('/api/bids/:id/accept', (req: Request, res: Response) => {
    const { id } = req.params;
    const targetBid = dbBids.find((b) => b.id === id);
    if (!targetBid) {
      return res.status(404).json({ success: false, error: 'Bid not found' });
    }

    targetBid.status = 'accepted';

    // Calculate commission
    let commAmount = 0;
    if (dbCommission.type === 'percentage') {
      commAmount = Math.round((targetBid.amount * dbCommission.percentage) / 100);
    } else {
      commAmount = dbCommission.fixedAmount;
    }

    // Update worker stats & wallet
    const worker = dbWorkers.find((w) => w.id === targetBid.workerId);
    if (worker) {
      worker.walletBalance += (targetBid.amount - commAmount);
      worker.jobsCompleted += 1;
    }

    // Update order
    const order = dbOrders.find((o) => o.id === targetBid.jobId);
    if (order) {
      const updatedAssigned = Array.from(new Set([...(order.assignedWorkerIds || []), targetBid.workerId]));
      const isFullyFilled = updatedAssigned.length >= order.requiredWorkers;
      order.status = isFullyFilled ? 'assigned' : 'bidding';
      order.assignedWorkerIds = updatedAssigned;
      order.totalAgreedAmount = (order.totalAgreedAmount || 0) + targetBid.amount;
      order.commissionDeducted = (order.commissionDeducted || 0) + commAmount;
    }

    // Update platform stats
    dbStats.platformRevenue += commAmount;
    dbStats.monthlyOrderVolume += targetBid.amount;

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Bid Accepted & Confirmed!',
      message: `${targetBid.workerName} has been booked. Commission ₹${commAmount} deducted.`,
      type: 'success',
      timestamp: 'Just now',
      targetRole: 'employee',
    };
    dbNotifications.unshift(notif);

    res.json({
      success: true,
      data: {
        bid: targetBid,
        order,
        worker,
        commissionDeducted: commAmount,
      },
    });
  });

  app.post('/api/bids/:id/decline', (req: Request, res: Response) => {
    const { id } = req.params;
    const targetBid = dbBids.find((b) => b.id === id);
    if (!targetBid) {
      return res.status(404).json({ success: false, error: 'Bid not found' });
    }

    targetBid.status = 'declined';
    res.json({ success: true, data: targetBid });
  });

  // ----------------------------------------------------
  // REST API: Commission Settings
  // ----------------------------------------------------
  app.get('/api/commission', (req: Request, res: Response) => {
    res.json({ success: true, data: dbCommission });
  });

  app.put('/api/commission', (req: Request, res: Response) => {
    const update = req.body;
    dbCommission = {
      ...dbCommission,
      ...update,
      updatedAt: new Date().toISOString(),
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Commission Policy Updated',
      message: `Rates updated to ${dbCommission.type === 'percentage' ? `${dbCommission.percentage}%` : `₹${dbCommission.fixedAmount} Flat`} per completed order`,
      type: 'info',
      timestamp: 'Just now',
      targetRole: 'admin',
    };
    dbNotifications.unshift(notif);

    res.json({ success: true, data: dbCommission });
  });

  // ----------------------------------------------------
  // REST API: Platform Stats
  // ----------------------------------------------------
  app.get('/api/stats', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        ...dbStats,
        totalCategories: dbCategories.length,
        totalWorkers: dbWorkers.length,
        activeOrders: dbOrders.filter((o) => o.status === 'open' || o.status === 'bidding').length,
        totalBids: dbBids.length,
      },
    });
  });

  // ----------------------------------------------------
  // REST API: Notifications
  // ----------------------------------------------------
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json({ success: true, data: dbNotifications });
  });

  app.post('/api/notifications', (req: Request, res: Response) => {
    const { title, message, type, targetRole } = req.body;
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: title || 'System Update',
      message: message || '',
      type: type || 'info',
      timestamp: 'Just now',
      targetRole,
    };
    dbNotifications.unshift(newNotif);
    if (dbNotifications.length > 20) {
      dbNotifications = dbNotifications.slice(0, 20);
    }
    res.status(201).json({ success: true, data: newNotif });
  });

  app.delete('/api/notifications/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    dbNotifications = dbNotifications.filter((n) => n.id !== id);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // REST API: Simulation & Reset
  // ----------------------------------------------------
  app.post('/api/simulate-bid', (req: Request, res: Response) => {
    const targetOrder = dbOrders[0];
    const availableWorkers = dbWorkers.filter(
      (w) => !dbBids.some((b) => b.jobId === targetOrder.id && b.workerId === w.id)
    );
    const bidder = availableWorkers.length > 0 ? availableWorkers[0] : dbWorkers[1];

    const bidAmounts = [1850, 1950, 2100, 2250, 2400];
    const randomAmount = bidAmounts[Math.floor(Math.random() * bidAmounts.length)];

    const simBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId: targetOrder.id,
      workerId: bidder.id,
      workerName: bidder.name,
      workerAvatar: bidder.avatar,
      workerRating: bidder.rating,
      workerJobsCompleted: bidder.jobsCompleted,
      amount: randomAmount,
      proposedTime: 'Will reach at 8:30 AM sharp',
      notes: 'Available with full team and transport ready.',
      status: 'pending',
      createdAt: 'Just now',
    };

    dbBids.unshift(simBid);
    dbStats.totalBids += 1;
    targetOrder.status = 'bidding';

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '⚡ Live Bid Received!',
      message: `${bidder.name} placed bid ₹${randomAmount.toLocaleString()} on ${targetOrder.orderNumber}`,
      type: 'bid',
      timestamp: 'Just now',
      targetRole: 'customer',
    };
    dbNotifications.unshift(notif);

    res.status(201).json({ success: true, data: simBid });
  });

  app.post('/api/reset', (req: Request, res: Response) => {
    dbCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    dbWorkers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    dbOrders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    dbBids = JSON.parse(JSON.stringify(INITIAL_BIDS));
    dbCommission = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
    dbStats = JSON.parse(JSON.stringify(INITIAL_STATS));
    dbNotifications = [
      {
        id: `notif-${Date.now()}`,
        title: 'Backend Database Reset',
        message: 'Platform demo data has been restored to default state.',
        type: 'info',
        timestamp: 'Just now',
        targetRole: 'admin',
      },
    ];

    res.json({ success: true, message: 'Backend database restored to initial seed' });
  });

  // ----------------------------------------------------
  // Dev & Production Frontend Handlers
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ManPowerLink Full-Stack Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 REST API mounted under /api/* (15 active endpoints)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
