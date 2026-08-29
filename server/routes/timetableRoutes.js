import express from 'express';
import { getStudentTimetable } from '../controllers/timetableController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/', protect, authorize('STUDENT'), getStudentTimetable);
router.get('/student', protect, authorize('STUDENT'), getStudentTimetable);

export default router;
