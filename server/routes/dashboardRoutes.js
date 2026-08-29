import express from 'express';
import {
  getStudentDashboard,
  getAdminDashboard,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/student', protect, authorize('STUDENT'), getStudentDashboard);
router.get('/admin', protect, authorize('ADMIN'), getAdminDashboard);

export default router;
