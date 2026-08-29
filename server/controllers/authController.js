import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Department from '../models/Department.js';
import { logAudit } from '../utils/auditLogger.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_course_registration_system_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let query = { email: cleanEmail };

    // Also support logging in with studentId
    if (!cleanEmail.includes('@')) {
      const student = await Student.findOne({ studentId: cleanEmail.toUpperCase() });
      if (student) {
        query = { _id: student.user };
      }
    }

    const user = await User.findOne(query)
      .populate('studentProfile')
      .populate('facultyProfile');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials.',
      });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Account role is '${user.role}', not '${role}'. Please select the correct role.`,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials.',
      });
    }

    const token = generateToken(user._id);

    // Audit log
    await logAudit({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      module: 'AUTH',
      details: `User ${user.email} logged in successfully as ${user.role}.`,
      req,
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        facultyProfile: user.facultyProfile,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, studentId, departmentId, currentSemester, phone } = req.body;

    if (!name || !email || !password || !studentId || !departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, student ID, department.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const studentIdExists = await Student.findOne({ studentId: studentId.toUpperCase().trim() });
    if (studentIdExists) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Student ID already exists.',
      });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Selected department does not exist.',
      });
    }

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: 'STUDENT',
    });

    // Create Student Profile
    const student = await Student.create({
      studentId: studentId.toUpperCase().trim(),
      user: user._id,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      department: department._id,
      currentSemester: Number(currentSemester) || 1,
      batch: '2024-2028',
      totalDegreeCredits: 160,
      completedCredits: 0,
      completedCourses: [],
      status: 'Active',
    });

    user.studentProfile = student._id;
    await user.save();

    const token = generateToken(user._id);

    await logAudit({
      user: user._id,
      userName: user.name,
      userRole: 'STUDENT',
      action: 'STUDENT_SELF_REGISTERED',
      module: 'AUTH',
      recordId: student._id.toString(),
      details: `Student account created for ID: ${student.studentId}`,
      req,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: student,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'studentProfile',
        populate: { path: 'department' },
      })
      .populate({
        path: 'facultyProfile',
        populate: { path: 'department' },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
