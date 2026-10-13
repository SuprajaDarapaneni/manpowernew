import { Router, Request, Response } from 'express';

export const authRouter = Router();

// Admin login
authRouter.post('/admin', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if ((email === 'admin@gmail.com' && password === 'admin') ||
      (email === 'admin@manpowerlink.com' && password === 'admin123')) {
    return res.json({
      success: true,
      token: 'jwt_admin_mock_session_token_2026',
      user: { email, role: 'admin', name: 'Platform Administrator' }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Customer OTP login
authRouter.post('/customer', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });
  // Default OTP is 1234
  if (otp && otp !== '1234') {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  return res.json({
    success: true,
    token: 'jwt_customer_mock_session_token_2026',
    user: { phone, role: 'customer', company: 'Kiran Transport & Co' }
  });
});

// Employee OTP login
authRouter.post('/employee', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });
  if (otp && otp !== '1234') {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  return res.json({
    success: true,
    token: 'jwt_employee_mock_session_token_2026',
    user: { phone, role: 'employee', name: 'Ramesh Gowda', category: 'Warehouse Helper' }
  });
});
