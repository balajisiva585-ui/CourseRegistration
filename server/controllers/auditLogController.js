import AuditLog from '../models/AuditLog.js';

// @desc    Get system audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const { module, userRole, q, limit = 100 } = req.query;
    const filter = {};

    if (module && module !== 'ALL') filter.module = module;
    if (userRole && userRole !== 'ALL') filter.userRole = userRole;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ action: regex }, { details: regex }, { userName: regex }];
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching audit logs.',
    });
  }
};
