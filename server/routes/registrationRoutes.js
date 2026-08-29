import express from 'express';
import {
  registerCourse,
  dropCourse,
  getMyRegistrations,
  getRegistrationHistory,
  getAllRegistrations,
  adminDropRegistration,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('STUDENT'), registerCourse)
  .get(protect, authorize('ADMIN'), getAllRegistrations);

router.get('/my', protect, authorize('STUDENT'), getMyRegistrations);
router.get('/history', protect, authorize('STUDENT'), getRegistrationHistory);

router.delete('/:id', protect, authorize('STUDENT'), dropCourse);
router.delete('/admin/:id', protect, authorize('ADMIN'), adminDropRegistration);

export default router;
