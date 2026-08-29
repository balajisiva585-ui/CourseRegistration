import SemesterSetting from '../models/SemesterSetting.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get active semester settings
// @route   GET /api/settings
// @access  Public / Authenticated
export const getSettings = async (req, res) => {
  try {
    let setting = await SemesterSetting.findOne();
    if (!setting) {
      setting = await SemesterSetting.create({
        semesterName: 'Fall 2026 (Semester 5)',
        academicYear: '2025-2026',
        currentSemesterNumber: 5,
        maxCreditLimit: 24,
        minCreditLimit: 12,
        isRegistrationOpen: true,
        allowDropPeriod: true,
      });
    }

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching semester settings.',
    });
  }
};

// @desc    Update semester settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const {
      semesterName,
      academicYear,
      currentSemesterNumber,
      maxCreditLimit,
      minCreditLimit,
      registrationStartDate,
      registrationEndDate,
      isRegistrationOpen,
      allowDropPeriod,
    } = req.body;

    let setting = await SemesterSetting.findOne();
    if (!setting) {
      setting = new SemesterSetting();
    }

    if (semesterName) setting.semesterName = semesterName;
    if (academicYear) setting.academicYear = academicYear;
    if (currentSemesterNumber !== undefined) setting.currentSemesterNumber = Number(currentSemesterNumber);
    if (maxCreditLimit !== undefined) setting.maxCreditLimit = Number(maxCreditLimit);
    if (minCreditLimit !== undefined) setting.minCreditLimit = Number(minCreditLimit);
    if (registrationStartDate) setting.registrationStartDate = registrationStartDate;
    if (registrationEndDate) setting.registrationEndDate = registrationEndDate;
    if (isRegistrationOpen !== undefined) setting.isRegistrationOpen = Boolean(isRegistrationOpen);
    if (allowDropPeriod !== undefined) setting.allowDropPeriod = Boolean(allowDropPeriod);

    await setting.save();

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'SETTINGS_UPDATED',
      module: 'SETTINGS',
      recordId: setting._id.toString(),
      details: `Updated semester settings: Max Credits=${setting.maxCreditLimit}, Open=${setting.isRegistrationOpen}`,
      req,
    });

    res.json({
      success: true,
      data: setting,
      message: 'Semester settings updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating settings.',
    });
  }
};
