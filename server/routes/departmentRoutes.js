import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, authorize('ADMIN'), createDepartment);

router.route('/:id')
  .put(protect, authorize('ADMIN'), updateDepartment)
  .delete(protect, authorize('ADMIN'), deleteDepartment);

export default router;
