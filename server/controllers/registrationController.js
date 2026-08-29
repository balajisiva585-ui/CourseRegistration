import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import SemesterSetting from '../models/SemesterSetting.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { checkPrerequisites } from '../utils/prereqChecker.js';
import { detectScheduleConflict } from '../utils/conflictDetector.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Register a student for a course (atomic & multi-stage validation)
// @route   POST /api/registrations
// @access  Private/Student
export const registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId to register.',
      });
    }

    // 1. Verify student identity
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    if (student.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: `Your student account status is '${student.status}'. Registration is not allowed.`,
      });
    }

    // 2. Check Semester Setting / Registration Period
    let setting = await SemesterSetting.findOne();
    if (!setting) {
      // Fallback default
      setting = {
        semesterName: 'Fall 2026 (Semester 5)',
        academicYear: '2025-2026',
        currentSemesterNumber: student.currentSemester || 5,
        maxCreditLimit: 24,
        isRegistrationOpen: true,
      };
    }

    if (!setting.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration period has ended or is currently closed by the administration.',
      });
    }

    const now = new Date();
    if (setting.registrationStartDate && now < new Date(setting.registrationStartDate)) {
      return res.status(400).json({
        success: false,
        message: `Registration has not started yet. Opens on ${new Date(setting.registrationStartDate).toLocaleDateString()}.`,
      });
    }

    if (setting.registrationEndDate && now > new Date(setting.registrationEndDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration period has ended.',
      });
    }

    // 3. Verify Course exists & is active
    const course = await Course.findById(courseId).populate('prerequisites');
    if (!course || course.status === 'Archived') {
      return res.status(404).json({
        success: false,
        message: 'Course not found or is currently archived.',
      });
    }

    // 4. Check Duplicate Registration
    const existingRegistration = await Registration.findOne({
      student: student._id,
      course: course._id,
      semester: setting.currentSemesterNumber || student.currentSemester,
      status: 'Registered',
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Course is already registered for this semester.',
      });
    }

    // 5. Check Prerequisites
    const prereqCheck = checkPrerequisites(course, student);
    if (!prereqCheck.isSatisfied) {
      return res.status(400).json({
        success: false,
        message: `Prerequisite not completed: ${prereqCheck.missingPrereqs.join(', ')}. You must complete the prerequisite courses before enrolling.`,
        missingPrereqs: prereqCheck.missingPrereqs,
      });
    }

    // 6. Check Available Seats
    if (course.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No seats available. This course has reached its maximum capacity.',
      });
    }

    // 7. Check Timetable Schedule Conflicts with student's active registered courses
    const activeRegistrations = await Registration.find({
      student: student._id,
      status: 'Registered',
    }).populate('course');

    const activeCourses = activeRegistrations.map((r) => r.course).filter(Boolean);
    const conflictCheck = detectScheduleConflict(course, activeCourses);

    if (conflictCheck.hasConflict) {
      const firstConflict = conflictCheck.conflicts[0];
      return res.status(400).json({
        success: false,
        message: `Schedule conflict detected: ${course.courseCode} overlaps with your registered course ${firstConflict.conflictingCourseCode} on ${firstConflict.day}.`,
        conflictDetails: conflictCheck.conflicts,
      });
    }

    // 8. Check Credit Limit
    const currentRegisteredCredits = activeCourses.reduce(
      (sum, c) => sum + (c.credits || 0),
      0
    );
    const totalWithNewCourse = currentRegisteredCredits + (course.credits || 0);
    const maxCreditLimit = setting.maxCreditLimit || 24;

    if (totalWithNewCourse > maxCreditLimit) {
      return res.status(400).json({
        success: false,
        message: `Maximum credit limit reached. Current registered credits: ${currentRegisteredCredits}, Course credits: ${course.credits}, Maximum allowed: ${maxCreditLimit}.`,
      });
    }

    // 9. Atomic Seat Update (prevents race condition when 2 students compete for 1 seat)
    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: course._id,
        availableSeats: { $gt: 0 },
      },
      {
        $inc: { enrolledCount: 1, availableSeats: -1 },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(400).json({
        success: false,
        message: 'No seats available. The last remaining seat was just occupied.',
      });
    }

    // Check if course is now full
    if (updatedCourse.availableSeats === 0) {
      await Course.findByIdAndUpdate(course._id, { status: 'Full' });

      // Notify Admins that course is full
      const admins = await User.find({ role: 'ADMIN' });
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          role: 'ADMIN',
          title: `Course Full Alert: ${course.courseCode}`,
          message: `${course.courseCode} - ${course.courseName} has reached 100% capacity (${course.capacity}/${course.capacity}).`,
          type: 'COURSE_FULL',
        });
      }
    }

    // 10. Create Registration Record
    const regId = `REG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const registration = await Registration.create({
      registrationId: regId,
      student: student._id,
      course: course._id,
      semester: setting.currentSemesterNumber || student.currentSemester,
      academicYear: setting.academicYear || '2025-2026',
      registrationDate: new Date(),
      status: 'Registered',
    });

    // 11. Create In-App Notification for Student
    await Notification.create({
      recipient: req.user._id,
      role: 'STUDENT',
      title: `Registration Successful: ${course.courseCode}`,
      message: `You have successfully enrolled in ${course.courseCode} - ${course.courseName} (${course.credits} Credits). Schedule: ${course.schedules?.map((s) => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')}. Room: ${course.room}`,
      type: 'REGISTRATION_SUCCESS',
    });

    // 12. Create Audit Log
    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: 'STUDENT',
      action: 'COURSE_REGISTERED',
      module: 'REGISTRATION',
      recordId: registration._id.toString(),
      details: `Student ${student.studentId} registered for ${course.courseCode} (${course.credits} cr)`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Course registered successfully.',
      data: {
        registration,
        course: updatedCourse,
        totalRegisteredCredits: totalWithNewCourse,
        remainingCreditsAllowed: maxCreditLimit - totalWithNewCourse,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Drop a registered course
// @route   DELETE /api/registrations/:id
// @access  Private/Student
export const dropCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const registration = await Registration.findOne({
      _id: id,
      student: student._id,
      status: 'Registered',
    }).populate('course');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Active registration record not found.',
      });
    }

    // Check drop period policy
    const setting = await SemesterSetting.findOne();
    if (setting && setting.allowDropPeriod === false) {
      return res.status(400).json({
        success: false,
        message: 'Course drop period is currently closed by the university registrar.',
      });
    }

    // 1. Atomically restore course seat
    if (registration.course) {
      await Course.findByIdAndUpdate(registration.course._id, {
        $inc: { enrolledCount: -1, availableSeats: 1 },
        status: 'Active',
      });
    }

    // 2. Update Registration status to Dropped
    registration.status = 'Dropped';
    registration.dropDate = new Date();
    registration.dropReason = reason || 'Student voluntary drop';
    await registration.save();

    // 3. Create Notification
    await Notification.create({
      recipient: req.user._id,
      role: 'STUDENT',
      title: `Course Dropped: ${registration.course?.courseCode || 'Course'}`,
      message: `You dropped ${registration.course?.courseCode} - ${registration.course?.courseName}. Your seat has been released.`,
      type: 'COURSE_DROPPED',
    });

    // 4. Audit Log
    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: 'STUDENT',
      action: 'COURSE_DROPPED',
      module: 'REGISTRATION',
      recordId: registration._id.toString(),
      details: `Student ${student.studentId} dropped ${registration.course?.courseCode}. Reason: ${registration.dropReason}`,
      req,
    });

    res.json({
      success: true,
      message: 'Course dropped successfully.',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error dropping course.',
    });
  }
};

// @desc    Get currently logged-in student's active registrations
// @route   GET /api/registrations/my
// @access  Private/Student
export const getMyRegistrations = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const registrations = await Registration.find({
      student: student._id,
      status: 'Registered',
    })
      .populate({
        path: 'course',
        populate: [
          { path: 'department', select: 'name code' },
          { path: 'faculty', select: 'name email specialization' },
        ],
      })
      .sort({ createdAt: -1 });

    const totalCredits = registrations.reduce(
      (sum, reg) => sum + (reg.course?.credits || 0),
      0
    );

    res.json({
      success: true,
      count: registrations.length,
      totalCredits,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student registrations.',
    });
  }
};

// @desc    Get student's full registration history (Registered, Dropped, Completed)
// @route   GET /api/registrations/history
// @access  Private/Student
export const getRegistrationHistory = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const history = await Registration.find({
      student: student._id,
    })
      .populate({
        path: 'course',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching registration history.',
    });
  }
};

// @desc    Get all registrations (Admin monitor view)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const { semester, status, courseId, studentId, search } = req.query;
    const filter = {};

    if (semester && semester !== 'ALL') filter.semester = Number(semester);
    if (status && status !== 'ALL') filter.status = status;
    if (courseId) filter.course = courseId;

    let query = Registration.find(filter)
      .populate({
        path: 'student',
        select: 'studentId name email currentSemester batch',
        populate: { path: 'department', select: 'name code' },
      })
      .populate({
        path: 'course',
        select: 'courseCode courseName credits capacity enrolledCount availableSeats schedules room',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ createdAt: -1 });

    let registrations = await query.exec();

    // In-memory filter for studentId or search terms if provided
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      registrations = registrations.filter(
        (reg) =>
          reg.registrationId?.toLowerCase().includes(term) ||
          reg.student?.name?.toLowerCase().includes(term) ||
          reg.student?.studentId?.toLowerCase().includes(term) ||
          reg.course?.courseCode?.toLowerCase().includes(term) ||
          reg.course?.courseName?.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching registrations.',
    });
  }
};

// @desc    Admin override drop/cancel a registration
// @route   DELETE /api/registrations/admin/:id
// @access  Private/Admin
export const adminDropRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const registration = await Registration.findById(id)
      .populate('student')
      .populate('course');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found.',
      });
    }

    if (registration.status === 'Registered' && registration.course) {
      await Course.findByIdAndUpdate(registration.course._id, {
        $inc: { enrolledCount: -1, availableSeats: 1 },
        status: 'Active',
      });
    }

    registration.status = 'Dropped';
    registration.dropDate = new Date();
    registration.dropReason = `Admin override: ${reason || 'Administrative action'}`;
    await registration.save();

    // Notify Student
    if (registration.student?.user) {
      await Notification.create({
        recipient: registration.student.user,
        role: 'STUDENT',
        title: `Registration Modified by Admin: ${registration.course?.courseCode}`,
        message: `Your registration for ${registration.course?.courseCode} has been cancelled by the administrator. Reason: ${registration.dropReason}`,
        type: 'COURSE_DROPPED',
      });
    }

    // Audit Log
    await logAudit({
      user: req.user._id,
      userName: req.user.name,
      userRole: 'ADMIN',
      action: 'ADMIN_OVERRIDE_REGISTRATION_DROP',
      module: 'REGISTRATION',
      recordId: registration._id.toString(),
      details: `Admin cancelled registration for student ${registration.student?.studentId} in course ${registration.course?.courseCode}`,
      req,
    });

    res.json({
      success: true,
      message: 'Registration cancelled by admin.',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling registration.',
    });
  }
};
