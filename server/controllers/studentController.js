import Student from '../models/Student.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import bcrypt from 'bcryptjs';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const { q, department, semester, status } = req.query;
    const filter = {};

    if (department && department !== 'ALL') filter.department = department;
    if (semester && semester !== 'ALL') filter.currentSemester = Number(semester);
    if (status && status !== 'ALL') filter.status = status;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ name: regex }, { studentId: regex }, { email: regex }];
    }

    const students = await Student.find(filter)
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching students.',
    });
  }
};

// @desc    Get single student details with registrations
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('department', 'name code');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const registrations = await Registration.find({ student: student._id })
      .populate('course', 'courseCode courseName credits')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        student,
        registrations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student details.',
    });
  }
};

// @desc    Admin create new student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      phone,
      department,
      currentSemester,
      batch,
      completedCredits,
      completedCourses,
      status,
    } = req.body;

    if (!name || !email || !studentId || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, student ID, and department.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    const existingStudent = await Student.findOne({ studentId: studentId.toUpperCase().trim() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this Student ID already exists.',
      });
    }

    // Create User account
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: password || 'Student@123',
      role: 'STUDENT',
    });

    const student = await Student.create({
      studentId: studentId.toUpperCase().trim(),
      user: user._id,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      department,
      currentSemester: Number(currentSemester) || 1,
      batch: batch || '2024-2028',
      totalDegreeCredits: 160,
      completedCredits: Number(completedCredits) || 0,
      completedCourses: completedCourses || [],
      status: status || 'Active',
    });

    user.studentProfile = student._id;
    await user.save();

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_CREATED_STUDENT',
      module: 'STUDENT',
      recordId: student._id.toString(),
      details: `Created student account ${student.studentId} (${student.name})`,
      req,
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student created successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating student.',
    });
  }
};

// @desc    Admin update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const {
      name,
      phone,
      department,
      currentSemester,
      batch,
      completedCredits,
      completedCourses,
      status,
    } = req.body;

    if (name) student.name = name;
    if (phone !== undefined) student.phone = phone;
    if (department) student.department = department;
    if (currentSemester !== undefined) student.currentSemester = Number(currentSemester);
    if (batch) student.batch = batch;
    if (completedCredits !== undefined) student.completedCredits = Number(completedCredits);
    if (completedCourses !== undefined) student.completedCourses = completedCourses;
    if (status) student.status = status;

    await student.save();

    if (name && student.user) {
      await User.findByIdAndUpdate(student.user, { name });
    }

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_UPDATED_STUDENT',
      module: 'STUDENT',
      recordId: student._id.toString(),
      details: `Updated student record for ${student.studentId}`,
      req,
    });

    res.json({
      success: true,
      data: student,
      message: 'Student updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating student.',
    });
  }
};

// @desc    Admin delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    // Delete user account and registrations
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }
    await Registration.deleteMany({ student: student._id });
    await Student.findByIdAndDelete(student._id);

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_DELETED_STUDENT',
      module: 'STUDENT',
      recordId: student._id.toString(),
      details: `Deleted student ${student.studentId} (${student.name})`,
      req,
    });

    res.json({
      success: true,
      message: 'Student deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting student.',
    });
  }
};
