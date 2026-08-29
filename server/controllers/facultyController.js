import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get all faculty members
// @route   GET /api/faculty
// @access  Public / Authenticated
export const getFacultyList = async (req, res) => {
  try {
    const { department, q } = req.query;
    const filter = {};

    if (department && department !== 'ALL') filter.department = department;
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ name: regex }, { facultyId: regex }, { specialization: regex }];
    }

    const faculty = await Faculty.find(filter)
      .populate('department', 'name code')
      .populate('assignedCourses', 'courseCode courseName credits capacity enrolledCount')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching faculty.',
    });
  }
};

// @desc    Get single faculty details
// @route   GET /api/faculty/:id
// @access  Authenticated
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('department', 'name code')
      .populate('assignedCourses');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found.',
      });
    }

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching faculty details.',
    });
  }
};

// @desc    Get assigned courses for logged-in Faculty
// @route   GET /api/faculty/me/courses
// @access  Private/Faculty
export const getMyFacultyCourses = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found.',
      });
    }

    const courses = await Course.find({ faculty: faculty._id })
      .populate('department', 'name code')
      .sort({ courseCode: 1 });

    // Fetch enrolled students count for each course
    const coursesWithRosters = await Promise.all(
      courses.map(async (course) => {
        const registrations = await Registration.find({
          course: course._id,
          status: 'Registered',
        }).populate({
          path: 'student',
          select: 'studentId name email currentSemester batch',
          populate: { path: 'department', select: 'name code' },
        });

        const students = registrations.map((r) => ({
          registrationId: r.registrationId,
          registrationDate: r.registrationDate,
          student: r.student,
        }));

        return {
          ...course.toObject(),
          enrolledStudentsCount: students.length,
          students,
        };
      })
    );

    res.json({
      success: true,
      faculty,
      count: coursesWithRosters.length,
      data: coursesWithRosters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assigned courses.',
    });
  }
};

// @desc    Get enrolled students list for a specific course
// @route   GET /api/faculty/courses/:courseId/students
// @access  Private/Faculty & Admin
export const getEnrolledStudentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const registrations = await Registration.find({
      course: courseId,
      status: 'Registered',
    }).populate({
      path: 'student',
      select: 'studentId name email phone currentSemester batch status',
      populate: { path: 'department', select: 'name code' },
    });

    const students = registrations.map((r) => ({
      registrationId: r.registrationId,
      registrationDate: r.registrationDate,
      semester: r.semester,
      student: r.student,
    }));

    res.json({
      success: true,
      course: {
        _id: course._id,
        courseCode: course.courseCode,
        courseName: course.courseName,
        capacity: course.capacity,
        enrolledCount: students.length,
        availableSeats: Math.max(0, course.capacity - students.length),
      },
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course roster.',
    });
  }
};

// @desc    Admin create new faculty
// @route   POST /api/faculty
// @access  Private/Admin
export const createFaculty = async (req, res) => {
  try {
    const { facultyId, name, email, password, phone, department, specialization, officeRoom } = req.body;

    if (!facultyId || !name || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide faculty ID, name, email, and department.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    const facultyExists = await Faculty.findOne({ facultyId: facultyId.toUpperCase().trim() });
    if (facultyExists) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this Faculty ID already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: password || 'Faculty@123',
      role: 'FACULTY',
    });

    const faculty = await Faculty.create({
      facultyId: facultyId.toUpperCase().trim(),
      user: user._id,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      department,
      specialization: specialization || 'General Computer Science',
      officeRoom: officeRoom || 'Faculty Block',
    });

    user.facultyProfile = faculty._id;
    await user.save();

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_CREATED_FACULTY',
      module: 'FACULTY',
      recordId: faculty._id.toString(),
      details: `Created faculty profile for ${faculty.facultyId} (${faculty.name})`,
      req,
    });

    res.status(201).json({
      success: true,
      data: faculty,
      message: 'Faculty member created successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating faculty.',
    });
  }
};

// @desc    Admin update faculty
// @route   PUT /api/faculty/:id
// @access  Private/Admin
export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found.',
      });
    }

    const { name, phone, department, specialization, officeRoom, assignedCourses } = req.body;

    if (name) faculty.name = name;
    if (phone !== undefined) faculty.phone = phone;
    if (department) faculty.department = department;
    if (specialization) faculty.specialization = specialization;
    if (officeRoom) faculty.officeRoom = officeRoom;
    if (assignedCourses !== undefined) faculty.assignedCourses = assignedCourses;

    await faculty.save();

    if (name && faculty.user) {
      await User.findByIdAndUpdate(faculty.user, { name });
    }

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_UPDATED_FACULTY',
      module: 'FACULTY',
      recordId: faculty._id.toString(),
      details: `Updated faculty ${faculty.facultyId}`,
      req,
    });

    res.json({
      success: true,
      data: faculty,
      message: 'Faculty member updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating faculty.',
    });
  }
};

// @desc    Admin delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found.',
      });
    }

    if (faculty.user) {
      await User.findByIdAndDelete(faculty.user);
    }

    // Unassign faculty from courses
    await Course.updateMany(
      { faculty: faculty._id },
      { $set: { faculty: null, facultyName: 'To be assigned' } }
    );

    await Faculty.findByIdAndDelete(faculty._id);

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_DELETED_FACULTY',
      module: 'FACULTY',
      recordId: faculty._id.toString(),
      details: `Deleted faculty ${faculty.facultyId} (${faculty.name})`,
      req,
    });

    res.json({
      success: true,
      message: 'Faculty member deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting faculty.',
    });
  }
};
