import { Router, Request, Response } from 'express';
import { db, Booking } from '../data/db.js';

export const bookingRouter = Router();

// List all bookings
bookingRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, count: db.bookings.length, bookings: db.bookings });
});

// Create new booking with 6-digit Arrival OTP
bookingRouter.post('/', (req: Request, res: Response) => {
  const {
    category_name,
    required_workers = 1,
    duration_hours = 8,
    location_address,
    shift_date = 'Today',
    start_time = '09:00 AM',
    hourly_rate = 180,
  } = req.body;

  const totalWorkerPay = Number(required_workers) * Number(duration_hours) * Number(hourly_rate);
  const fee = totalWorkerPay * (db.commissionSettings.ratePercent / 100);
  const total = totalWorkerPay + fee;
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const bookingNum = `MPL-${Date.now().toString().slice(-6)}`;

  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    booking_number: bookingNum,
    category_name: category_name || 'Warehouse Helper',
    required_workers: Number(required_workers),
    assigned_workers: 0,
    status: 'matching',
    shift_date,
    start_time,
    duration_hours: Number(duration_hours),
    location_address: location_address || 'Sector 4, Logistics Park',
    arrival_otp: otp,
    total_amount: total,
    platform_fee: fee,
  };

  db.bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// Get booking by ID
bookingRouter.get('/:id', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, booking });
});

// Mark completed & release escrow
bookingRouter.post('/:id/complete', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = 'completed';
  res.json({ success: true, booking, message: 'Escrow released successfully' });
});
