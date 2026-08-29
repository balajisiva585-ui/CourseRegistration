import Course from '../models/Course.js';
import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import Registration from '../models/Registration.js';
import { checkPrerequisites } from '../utils/prereqChecker.js';
import { detectScheduleConflict } from '../utils/conflictDetector.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get all courses with search, filters, sorting & eligibility metadata
// @route   GET /api/courses
// @access  Public / Authenticated
export const getCourses = async (req, res) => {
  try {
    const {
      q,
      department,
      semester,
      credits,
      courseType,
      availableOnly,
      sortBy = 'courseCode',
      order = 'asc',
    } = req.query;

    const filter = { status: { $ne: 'Archived' } };

    // Search query across code, name, description, and facultyName
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { courseCode: regex },
        { courseName: regex },
        { facultyName: regex },
        { room: regex },
      ];
    }

    if (department && department !== 'ALL') {
      filter.department = department;
    }

    if (semester && semester !== 'ALL') {
      filter.semester = Number(semester);
    }

    if (credits && credits !== 'ALL') {
      filter.credits = Number(credits);
    }

    if (courseType && courseType !== 'ALL') {
      filter.courseType = courseType;
    }

    if (availableOnly === 'true') {
      filter.availableSeats = { $gt: 0 };
    }

    const sortOption = {};
    const sortField = sortBy || 'courseCode';
    const sortOrder = order === 'desc' ? -1 : 1;
    sortOption[sortField] = sortOrder;

    let courses = await Course.find(filter)
      .populate('department', 'name code')
      .populate('faculty', 'name email specialization')
      .populate('prerequisites', 'courseCode courseName')
      .sort(sortOption)
      .lean();

    // If a student is authenticated, enrich courses with dynamic eligibility data
    if (req.user && req.user.role === 'STUDENT' && req.user.studentProfile) {
      const student = await Student.findById(req.user.studentProfile._id);

      // Get student's current active registrations
      const activeRegistrations = await Registration.find({
        student: student._id,
        status: 'Registered',
      }).populate('course');

      const registeredCourseMap = new Map();
      const activeRegisteredCourses = [];

      for (const reg of activeRegistrations) {
        if (reg.course) {
          registeredCourseMap.set(reg.course._id.toString(), reg);
          activeRegisteredCourses.push(reg.course);
        }
      }

      courses = courses.map((course) => {
        const isRegistered = registeredCourseMap.has(course._id.toString());
        const prereqCheck = checkPrerequisites(course, student);
        const conflictCheck = detectScheduleConflict(course, activeRegisteredCourses);
        const isFull = (course.availableSeats || 0) <= 0;

        let registrationStatus = 'AVAILABLE';
        let statusReason = '';

        if (isRegistered) {
          registrationStatus = 'REGISTERED';
          statusReason = 'Already registered';
        } else if (isFull) {
          registrationStatus = 'FULL';
          statusReason = 'Course is currently at maximum capacity';
        } else if (!prereqCheck.isSatisfied) {
          registrationStatus = 'PREREQUISITE_MISSING';
          statusReason = `Missing prerequisites: ${prereqCheck.missingPrereqs.join(', ')}`;
        } else if (conflictCheck.hasConflict) {
          registrationStatus = 'SCHEDULE_CONFLICT';
          statusReason = conflictCheck.conflicts[0]?.message || 'Schedule conflict detected';
        }

        const canRegister =
          !isRegistered && !isFull && prereqCheck.isSatisfied && !conflictCheck.hasConflict;

        return {
          ...course,
          isRegistered,
          isFull,
          prereqCheck,
          conflictCheck,
          registrationStatus,
          statusReason,
          canRegister,
        };
      });
    }

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching courses.',
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public / Authenticated
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('department', 'name code headOfDepartment')
      .populate('faculty', 'name email specialization officeRoom')
      .populate('prerequisites', 'courseCode courseName credits');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    let eligibility = null;
    if (req.user && req.user.role === 'STUDENT' && req.user.studentProfile) {
      const student = await Student.findById(req.user.studentProfile._id);
      const activeRegistrations = await Registration.find({
        student: student._id,
        status: 'Registered',
      }).populate('course');

      const isRegistered = activeRegistrations.some(
        (reg) => reg.course && reg.course._id.toString() === course._id.toString()
      );
      const otherActiveCourses = activeRegistrations
        .filter((reg) => reg.course && reg.course._id.toString() !== course._id.toString())
        .map((reg) => reg.course);

      const prereqCheck = checkPrerequisites(course, student);
      const conflictCheck = detectScheduleConflict(course, otherActiveCourses);

      eligibility = {
        isRegistered,
        isPrereqSatisfied: prereqCheck.isSatisfied,
        missingPrereqs: prereqCheck.missingPrereqs,
        completedPrereqs: prereqCheck.completedPrereqs,
        hasTimeConflict: conflictCheck.hasConflict,
        conflictDetails: conflictCheck.conflicts,
        isFull: course.availableSeats <= 0,
        canRegister:
          !isRegistered &&
          course.availableSeats > 0 &&
          prereqCheck.isSatisfied &&
          !conflictCheck.hasConflict,
      };
    }

    res.json({
      success: true,
      data: course,
      eligibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course details.',
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      description,
      department,
      faculty,
      credits,
      semester,
      courseType,
      capacity,
      prerequisites,
      prerequisiteCodes,
      schedules,
      room,
    } = req.body;

    if (!courseCode || !courseName || !department || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course code, name, department, and capacity.',
      });
    }

    const codeExists = await Course.findOne({
      courseCode: courseCode.toUpperCase().trim(),
    });

    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: `Course with code ${courseCode} already exists.`,
      });
    }

    let facultyName = 'To be assigned';
    if (faculty) {
      const facultyDoc = await Faculty.findById(faculty);
      if (facultyDoc) {
        facultyName = facultyDoc.name;
      }
    }

    const newCourse = await Course.create({
      courseCode: courseCode.toUpperCase().trim(),
      courseName: courseName.trim(),
      description: description || '',
      department,
      faculty: faculty || null,
      facultyName,
      credits: Number(credits) || 3,
      semester: Number(semester) || 1,
      courseType: courseType || 'Core',
      capacity: Number(capacity),
      enrolledCount: 0,
      availableSeats: Number(capacity),
      prerequisites: prerequisites || [],
      prerequisiteCodes: prerequisiteCodes || [],
      schedules: schedules || [],
      room: room || 'Lecture Hall',
      status: 'Active',
    });

    if (faculty) {
      await Faculty.findByIdAndUpdate(faculty, {
        $addToSet: { assignedCourses: newCourse._id },
      });
    }

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'COURSE_CREATED',
      module: 'COURSE',
      recordId: newCourse._id.toString(),
      details: `Created course ${newCourse.courseCode} - ${newCourse.courseName}`,
      req,
    });

    res.status(201).json({
      success: true,
      data: newCourse,
      message: 'Course created successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating course.',
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const {
      courseCode,
      courseName,
      description,
      department,
      faculty,
      credits,
      semester,
      courseType,
      capacity,
      prerequisites,
      prerequisiteCodes,
      schedules,
      room,
      status,
    } = req.body;

    if (faculty && faculty !== String(course.faculty)) {
      const facultyDoc = await Faculty.findById(faculty);
      if (facultyDoc) {
        course.faculty = facultyDoc._id;
        course.facultyName = facultyDoc.name;
        await Faculty.findByIdAndUpdate(faculty, {
          $addToSet: { assignedCourses: course._id },
        });
      }
    }

    if (courseCode) course.courseCode = courseCode.toUpperCase().trim();
    if (courseName) course.courseName = courseName.trim();
    if (description !== undefined) course.description = description;
    if (department) course.department = department;
    if (credits !== undefined) course.credits = Number(credits);
    if (semester !== undefined) course.semester = Number(semester);
    if (courseType) course.courseType = courseType;
    if (prerequisites !== undefined) course.prerequisites = prerequisites;
    if (prerequisiteCodes !== undefined) course.prerequisiteCodes = prerequisiteCodes;
    if (schedules !== undefined) course.schedules = schedules;
    if (room !== undefined) course.room = room;
    if (status) course.status = status;

    if (capacity !== undefined) {
      course.capacity = Number(capacity);
      course.availableSeats = Math.max(0, course.capacity - (course.enrolledCount || 0));
    }

    await course.save();

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'COURSE_UPDATED',
      module: 'COURSE',
      recordId: course._id.toString(),
      details: `Updated course ${course.courseCode}`,
      req,
    });

    res.json({
      success: true,
      data: course,
      message: 'Course updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating course.',
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if any active registrations exist
    const activeCount = await Registration.countDocuments({
      course: course._id,
      status: 'Registered',
    });

    if (activeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course with ${activeCount} active student registration(s). Please drop or reassign students first.`,
      });
    }

    await Course.findByIdAndDelete(course._id);

    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'COURSE_DELETED',
      module: 'COURSE',
      recordId: course._id.toString(),
      details: `Deleted course ${course.courseCode} - ${course.courseName}`,
      req,
    });

    res.json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting course.',
    });
  }
};
