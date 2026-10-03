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
} from './src/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_STATS,
} from './src/data/initialData';

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
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      server: 'ManPowerLink Express Backend',
      version: '1.2.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      counts: {
        categories: dbCategories.length,
        workers: dbWorkers.length,
        orders: dbOrders.length,
        bids: dbBids.length,
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
    const { name, icon, description, baseRatePerHour } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }

    const newCategory: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name,
      icon: icon || 'Briefcase',
      description: description || 'Professional temporary workforce services',
      baseRatePerHour: Number(baseRatePerHour) || 200,
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
      const updatedAssigned = Array.from(new Set([...order.assignedWorkerIds, targetBid.workerId]));
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
