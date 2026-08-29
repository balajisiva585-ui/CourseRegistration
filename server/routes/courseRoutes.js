import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getCourses)
  .post(protect, authorize('ADMIN'), createCourse);

router.route('/:id')
  .get(optionalAuth, getCourseById)
  .put(protect, authorize('ADMIN'), updateCourse)
  .delete(protect, authorize('ADMIN'), deleteCourse);

export default router;
