import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('ADMIN', 'FACULTY'), getStudents)
  .post(authorize('ADMIN'), createStudent);

router.route('/:id')
  .get(authorize('ADMIN', 'FACULTY'), getStudentById)
  .put(authorize('ADMIN'), updateStudent)
  .delete(authorize('ADMIN'), deleteStudent);

export default router;
