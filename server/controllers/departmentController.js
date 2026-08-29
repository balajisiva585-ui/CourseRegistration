import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get all departments with course and student counts
// @route   GET /api/departments
// @access  Public / Authenticated
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();

    const deptsWithStats = await Promise.all(
      departments.map(async (dept) => {
        const [courseCount, studentCount] = await Promise.all([
          Course.countDocuments({ department: dept._id, status: { $ne: 'Archived' } }),
          Student.countDocuments({ department: dept._id }),
        ]);

        return {
          ...dept,
          courseCount,
          studentCount,
        };
      })
    );

    res.json({
      success: true,
      count: deptsWithStats.length,
      data: deptsWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching departments.',
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  try {
    const { departmentId, name, code, headOfDepartment, description } = req.body;

    if (!departmentId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department ID, name, and code.',
      });
    }

    const existing = await Department.findOne({
      $or: [{ departmentId }, { code: code.toUpperCase() }, { name }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Department with this ID, code, or name already exists.',
      });
    }

    const department = await Department.create({
      departmentId,
      name,
      code: code.toUpperCase(),
      headOfDepartment: headOfDepartment || 'To be assigned',
      description: description || '',
    });

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_CREATED_DEPARTMENT',
      module: 'DEPARTMENT',
      recordId: department._id.toString(),
      details: `Created department ${department.name} (${department.code})`,
      req,
    });

    res.status(201).json({
      success: true,
      data: department,
      message: 'Department created successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating department.',
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    const { name, code, headOfDepartment, description } = req.body;

    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (headOfDepartment) department.headOfDepartment = headOfDepartment;
    if (description !== undefined) department.description = description;

    await department.save();

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_UPDATED_DEPARTMENT',
      module: 'DEPARTMENT',
      recordId: department._id.toString(),
      details: `Updated department ${department.code}`,
      req,
    });

    res.json({
      success: true,
      data: department,
      message: 'Department updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating department.',
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    const courseCount = await Course.countDocuments({ department: department._id });
    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department associated with ${courseCount} courses.`,
      });
    }

    await Department.findByIdAndDelete(department._id);

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_DELETED_DEPARTMENT',
      module: 'DEPARTMENT',
      recordId: department._id.toString(),
      details: `Deleted department ${department.name}`,
      req,
    });

    res.json({
      success: true,
      message: 'Department deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting department.',
    });
  }
};
