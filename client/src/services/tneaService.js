import api from './api';

export const tneaService = {
  // Colleges
  getColleges: async (params = {}) => {
    const res = await api.get('/tnea/colleges', { params });
    return res.data;
  },

  getCollegeDetails: async (idOrCode) => {
    const res = await api.get(`/tnea/colleges/${idOrCode}`);
    return res.data;
  },

  createCollege: async (data) => {
    const res = await api.post('/tnea/colleges', data);
    return res.data;
  },

  updateCollege: async (id, data) => {
    const res = await api.put(`/tnea/colleges/${id}`, data);
    return res.data;
  },

  deleteCollege: async (id) => {
    const res = await api.delete(`/tnea/colleges/${id}`);
    return res.data;
  },

  // Departments
  getDepartments: async () => {
    const res = await api.get('/tnea/departments');
    return res.data;
  },

  createDepartment: async (data) => {
    const res = await api.post('/tnea/departments', data);
    return res.data;
  },

  updateDepartment: async (id, data) => {
    const res = await api.put(`/tnea/departments/${id}`, data);
    return res.data;
  },

  deleteDepartment: async (id) => {
    const res = await api.delete(`/tnea/departments/${id}`);
    return res.data;
  },

  // Cutoffs
  getCutoffs: async (params = {}) => {
    const res = await api.get('/tnea/cutoffs', { params });
    return res.data;
  },

  predictCutoff: async (payload) => {
    const res = await api.post('/tnea/cutoffs/predict', payload);
    return res.data;
  },

  createCutoff: async (data) => {
    const res = await api.post('/tnea/cutoffs', data);
    return res.data;
  },

  updateCutoff: async (id, data) => {
    const res = await api.put(`/tnea/cutoffs/${id}`, data);
    return res.data;
  },

  deleteCutoff: async (id) => {
    const res = await api.delete(`/tnea/cutoffs/${id}`);
    return res.data;
  },

  bulkUploadCutoffs: async (records) => {
    const res = await api.post('/tnea/cutoffs/bulk-upload', { records });
    return res.data;
  },

  // Seat Matrix
  getSeatMatrices: async (params = {}) => {
    const res = await api.get('/tnea/seats', { params });
    return res.data;
  },

  createSeatMatrix: async (data) => {
    const res = await api.post('/tnea/seats', data);
    return res.data;
  },

  updateSeatMatrix: async (id, data) => {
    const res = await api.put(`/tnea/seats/${id}`, data);
    return res.data;
  },

  deleteSeatMatrix: async (id) => {
    const res = await api.delete(`/tnea/seats/${id}`);
    return res.data;
  },

  bulkUploadSeatMatrices: async (records) => {
    const res = await api.post('/tnea/seats/bulk-upload', { records });
    return res.data;
  },

  // Applications
  getApplications: async (params = {}) => {
    const res = await api.get('/tnea/applications', { params });
    return res.data;
  },

  createApplication: async (data) => {
    const res = await api.post('/tnea/applications', data);
    return res.data;
  },

  updateApplication: async (id, data) => {
    const res = await api.put(`/tnea/applications/${id}`, data);
    return res.data;
  },

  deleteApplication: async (id) => {
    const res = await api.delete(`/tnea/applications/${id}`);
    return res.data;
  },

  // Compare
  compareColleges: async (codes) => {
    const res = await api.get('/tnea/compare', { params: { codes } });
    return res.data;
  },

  // Favorites
  getFavorites: async () => {
    const res = await api.get('/tnea/favorites');
    return res.data;
  },

  toggleFavorite: async (collegeId, savedDepartments = []) => {
    const res = await api.post('/tnea/favorites/toggle', { collegeId, savedDepartments });
    return res.data;
  },

  // Analytics & Metadata
  getHubAnalytics: async () => {
    const res = await api.get('/tnea/analytics');
    return res.data;
  },

  getDistricts: async () => {
    const res = await api.get('/tnea/districts');
    return res.data;
  },

  getDistrictDirectory: async () => {
    const res = await api.get('/tnea/districts/directory');
    return res.data;
  },

  getDataSources: async () => {
    const res = await api.get('/tnea/data-sources');
    return res.data;
  },

  getDataVerificationStats: async () => {
    const res = await api.get('/tnea/verification-stats');
    return res.data;
  },

  // Student Incorrect Data Report
  reportIncorrectInfo: async (idOrCode, reportData) => {
    const res = await api.post(`/tnea/colleges/${idOrCode}/report`, reportData);
    return res.data;
  },

  getReports: async () => {
    const res = await api.get('/tnea/reports');
    return res.data;
  },

  updateReportStatus: async (id, updateData) => {
    const res = await api.put(`/tnea/reports/${id}`, updateData);
    return res.data;
  },

  // ==========================================
  // TNEA Allotment Simulator APIs
  // ==========================================
  calculateCutoff: async (marksPayload) => {
    const res = await api.post('/tnea/simulator/calculate', marksPayload);
    return res.data;
  },

  getSmartSuggestions: async (payload) => {
    const res = await api.post('/tnea/simulator/suggestions', payload);
    return res.data;
  },

  runSimulation: async (payload) => {
    const res = await api.post('/tnea/simulator/run', payload);
    return res.data;
  },

  saveSimulation: async (payload) => {
    const res = await api.post('/tnea/simulator/save', payload);
    return res.data;
  },

  getMySimulations: async () => {
    const res = await api.get('/tnea/simulator/my');
    return res.data;
  },

  getSimulationByShareId: async (shareId) => {
    const res = await api.get(`/tnea/simulator/share/${shareId}`);
    return res.data;
  },
};

export default tneaService;

