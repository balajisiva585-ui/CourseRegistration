import express from 'express';
import {
  getColleges,
  getCollegeByIdOrCode,
  createCollege,
  updateCollege,
  deleteCollege,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCutoffs,
  predictCutoff,
  createCutoff,
  updateCutoff,
  deleteCutoff,
  bulkUploadCutoffs,
  getSeatMatrices,
  createSeatMatrix,
  updateSeatMatrix,
  deleteSeatMatrix,
  bulkUploadSeatMatrices,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  compareColleges,
  getFavorites,
  toggleFavorite,
  getHubAnalytics,
  getDistricts,
  getDataVerificationStats,
  getDistrictDirectory,
  getDataSourcesRegistry,
  reportIncorrectInfo,
  getReports,
  updateReportStatus,
  getFees,
  syncMasterData,
} from '../controllers/tneaController.js';
import {
  calculateCutoff,
  getSmartSuggestions,
  runSimulation,
  saveSimulation,
  getMySimulations,
  getSimulationByShareId,
} from '../controllers/tneaSimulatorController.js';
import { handleTneaChat } from '../controllers/tneaChatController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

// ==========================================
// Public / Student Discovery Routes
// ==========================================
router.get('/colleges', optionalAuth, getColleges);
router.get('/colleges/:idOrCode', optionalAuth, getCollegeByIdOrCode);
router.get('/departments', getDepartments);
router.get('/cutoffs', getCutoffs);
router.post('/cutoffs/predict', predictCutoff);
router.post('/chat', handleTneaChat);
router.get('/seats', getSeatMatrices);
router.get('/fees', getFees);
router.get('/applications', getApplications);
router.get('/compare', compareColleges);
router.get('/analytics', getHubAnalytics);
router.get('/districts', getDistricts);
router.get('/districts/directory', getDistrictDirectory);
router.get('/data-sources', getDataSourcesRegistry);
router.get('/verification-stats', getDataVerificationStats);
router.post('/colleges/:idOrCode/report', reportIncorrectInfo);
router.all('/sync-master-data', syncMasterData);

// ==========================================
// TNEA Allotment Simulator Routes
// ==========================================
router.post('/simulator/calculate', calculateCutoff);
router.post('/simulator/suggestions', getSmartSuggestions);
router.post('/simulator/run', runSimulation);
router.post('/simulator/save', optionalAuth, saveSimulation);
router.get('/simulator/my', protect, getMySimulations);
router.get('/simulator/share/:shareId', getSimulationByShareId);

// ==========================================
// Authenticated Student Routes
// ==========================================
router.get('/favorites', protect, getFavorites);
router.post('/favorites/toggle', protect, toggleFavorite);

// ==========================================
// Admin Management Routes
// ==========================================
// Colleges CRUD
router.post('/colleges', protect, authorize('ADMIN'), createCollege);
router.put('/colleges/:id', protect, authorize('ADMIN'), updateCollege);
router.delete('/colleges/:id', protect, authorize('ADMIN'), deleteCollege);

// Departments CRUD
router.post('/departments', protect, authorize('ADMIN'), createDepartment);
router.put('/departments/:id', protect, authorize('ADMIN'), updateDepartment);
router.delete('/departments/:id', protect, authorize('ADMIN'), deleteDepartment);

// Cutoffs CRUD & Bulk
router.post('/cutoffs', protect, authorize('ADMIN'), createCutoff);
router.put('/cutoffs/:id', protect, authorize('ADMIN'), updateCutoff);
router.delete('/cutoffs/:id', protect, authorize('ADMIN'), deleteCutoff);
router.post('/cutoffs/bulk-upload', protect, authorize('ADMIN'), bulkUploadCutoffs);

// Seat Matrix CRUD & Bulk
router.post('/seats', protect, authorize('ADMIN'), createSeatMatrix);
router.put('/seats/:id', protect, authorize('ADMIN'), updateSeatMatrix);
router.delete('/seats/:id', protect, authorize('ADMIN'), deleteSeatMatrix);
router.post('/seats/bulk-upload', protect, authorize('ADMIN'), bulkUploadSeatMatrices);

// Applications CRUD
router.post('/applications', protect, authorize('ADMIN'), createApplication);
router.put('/applications/:id', protect, authorize('ADMIN'), updateApplication);
router.delete('/applications/:id', protect, authorize('ADMIN'), deleteApplication);

// Reports Management
router.get('/reports', protect, authorize('ADMIN'), getReports);
router.put('/reports/:id', protect, authorize('ADMIN'), updateReportStatus);

export default router;
