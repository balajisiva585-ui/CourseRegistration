import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import academicProgressRoutes from './routes/academicProgressRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import tneaRoutes from './routes/tneaRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      // Allow localhost, 127.0.0.1, and private network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      const allowedPattern = /^(https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?)$/;
      if (allowedPattern.test(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root & API Index Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'Tamil Nadu Engineering College Central Hub API',
    version: '1.0.0',
    documentation: '/api',
    frontend: 'http://localhost:5173',
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    system: 'Tamil Nadu Engineering College Central Hub API',
    endpoints: {
      health: '/api/health',
      colleges: '/api/tnea/colleges',
      cutoffs: '/api/tnea/cutoffs',
      seats: '/api/tnea/seats',
      districts: '/api/tnea/districts/directory',
      dataSources: '/api/tnea/data-sources',
      analytics: '/api/tnea/analytics',
      simulator: '/api/tnea/simulator/estimate',
      compare: '/api/tnea/compare?codes=0001,2006,1315',
    },
    frontendApp: 'http://localhost:5173',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Tamil Nadu Engineering College Central Hub API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/academic-progress', academicProgressRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/tnea', tneaRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize DB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`=======================================================`);
      console.log(`🎓 Smart Course Registration API Server running on ${HOST}:${PORT}`);
      console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
