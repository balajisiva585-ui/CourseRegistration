import AuditLog from '../models/AuditLog.js';

/**
 * Creates an audit log entry in the background.
 */
export const logAudit = async ({
  user,
  userName = 'System',
  userRole = 'SYSTEM',
  action,
  module,
  recordId = '',
  details = '',
  req = null,
}) => {
  try {
    const ipAddress =
      req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';

    await AuditLog.create({
      user: user?._id || user,
      userName: userName || user?.name || 'System',
      userRole: userRole || user?.role || 'SYSTEM',
      action,
      module,
      recordId: recordId ? String(recordId) : '',
      details: typeof details === 'object' ? JSON.stringify(details) : String(details),
      ipAddress: String(ipAddress),
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};
