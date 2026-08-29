import express from 'express';
import { getReportData, exportReportCSV } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/data', getReportData);
router.get('/export-csv', exportReportCSV);

export default router;
