import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const adminRouter = Router();

// Overview metrics
adminRouter.get('/overview', (req: Request, res: Response) => {
  const totalBookings = db.bookings.length;
  const activeBookings = db.bookings.filter((b) => b.status === 'in_progress' || b.status === 'arrived').length;
  const totalGmv = db.bookings.reduce((sum, b) => sum + b.total_amount, 0);
  const totalFees = db.bookings.reduce((sum, b) => sum + b.platform_fee, 0);

  res.json({
    success: true,
    stats: {
      totalBookings,
      activeBookings,
      totalGmv,
      totalFees,
      verifiedWorkersCount: db.workers.filter((w) => w.kyc_status === 'verified').length,
      pendingKycCount: db.workers.filter((w) => w.kyc_status === 'pending').length,
    },
  });
});

// Workers list
adminRouter.get('/workers', (req: Request, res: Response) => {
  res.json({ success: true, count: db.workers.length, workers: db.workers });
});

// Worker KYC review
adminRouter.post('/workers/:id/verify', (req: Request, res: Response) => {
  const { status } = req.body;
  const worker = db.workers.find((w) => w.id === req.params.id);
  if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
  worker.kyc_status = status === 'rejected' ? 'rejected' : 'verified';
  res.json({ success: true, worker, message: `Worker KYC ${worker.kyc_status}` });
});

// Commission configuration
adminRouter.get('/commission', (req: Request, res: Response) => {
  res.json({ success: true, commission: db.commissionSettings });
});

adminRouter.post('/commission', (req: Request, res: Response) => {
  const { model, ratePercent, fixedFeeAmount } = req.body;
  if (model) db.commissionSettings.model = model;
  if (ratePercent !== undefined) db.commissionSettings.ratePercent = Number(ratePercent);
  if (fixedFeeAmount !== undefined) db.commissionSettings.fixedFeeAmount = Number(fixedFeeAmount);
  res.json({ success: true, commission: db.commissionSettings, message: 'Commission rules updated' });
});
