import express from 'express';
import { getAcademicProgress } from '../controllers/academicProgressController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/', protect, authorize('STUDENT'), getAcademicProgress);

export default router;
