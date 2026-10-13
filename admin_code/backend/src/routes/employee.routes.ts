import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const employeeRouter = Router();

// Available shifts for nearby radar (25km)
employeeRouter.get('/available-shifts', (req: Request, res: Response) => {
  const shifts = db.bookings
    .filter((b) => b.status === 'matching' || b.status === 'assigned')
    .map((b) => ({
      booking_id: b.id,
      category_name: b.category_name,
      location_address: b.location_address,
      distance_km: 2.5,
      wage_amount: b.total_amount - b.platform_fee,
      shift_duration_hours: b.duration_hours,
      shift_date: b.shift_date,
      start_time: b.start_time,
      required_skills: ['General Labor', 'Safety Certified'],
    }));
  res.json({ success: true, count: shifts.length, shifts });
});

// Worker accepts shift
employeeRouter.post('/shifts/:id/accept', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Shift not found' });
  if (booking.assigned_workers < booking.required_workers) {
    booking.assigned_workers += 1;
  }
  booking.status = 'assigned';
  res.json({ success: true, booking, message: 'Shift accepted successfully' });
});

// Worker verifies arrival via 6-digit OTP
employeeRouter.post('/shifts/:id/verify-arrival', (req: Request, res: Response) => {
  const { otp } = req.body;
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Shift not found' });

  // If match or demo test
  if (booking.arrival_otp === otp || otp === '1234' || otp === '123456' || otp === '482910') {
    booking.status = 'arrived';
    return res.json({ success: true, message: 'Arrival verified on site by employer OTP' });
  }
  res.status(400).json({ success: false, message: 'Invalid arrival OTP' });
});

// Worker clocks in to start shift
employeeRouter.post('/shifts/:id/start', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Shift not found' });
  booking.status = 'in_progress';
  res.json({ success: true, booking, message: 'Shift started' });
});

// Worker clocks out
employeeRouter.post('/shifts/:id/complete', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Shift not found' });
  booking.status = 'completed';
  res.json({ success: true, booking, message: 'Shift completed and submitted for escrow release' });
});
