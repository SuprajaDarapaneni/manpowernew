import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes.js';
import { bookingRouter } from './routes/booking.routes.js';
import { employeeRouter } from './routes/employee.routes.js';
import { adminRouter } from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Service Health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ManPowerLink Centralized REST API',
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`[ManPowerLink Backend] Listening cleanly on port ${PORT}`);
});

export default app;
