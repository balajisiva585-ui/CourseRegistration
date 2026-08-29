import express from 'express';
import {
  getFacultyList,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getMyFacultyCourses,
  getEnrolledStudentsForCourse,
} from '../controllers/facultyController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/me/courses', protect, authorize('FACULTY'), getMyFacultyCourses);
router.get('/courses/:courseId/students', protect, authorize('FACULTY', 'ADMIN'), getEnrolledStudentsForCourse);

router.route('/')
  .get(getFacultyList)
  .post(protect, authorize('ADMIN'), createFaculty);

router.route('/:id')
  .get(getFacultyById)
  .put(protect, authorize('ADMIN'), updateFaculty)
  .delete(protect, authorize('ADMIN'), deleteFaculty);

export default router;
