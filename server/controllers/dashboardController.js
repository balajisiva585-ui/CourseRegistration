import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Course from '../models/Course.js';
import Department from '../models/Department.js';
import Registration from '../models/Registration.js';
import SemesterSetting from '../models/SemesterSetting.js';
import { generateRecommendations } from '../utils/recommender.js';

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
// @access  Private/Student
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('department', 'name code');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const activeRegistrations = await Registration.find({
      student: student._id,
      status: 'Registered',
    }).populate({
      path: 'course',
      populate: [
        { path: 'department', select: 'name code' },
        { path: 'faculty', select: 'name' },
      ],
    });

    const registeredCourses = activeRegistrations.map((r) => r.course).filter(Boolean);
    const registeredCourseIds = registeredCourses.map((c) => c._id);

    const totalRegisteredCredits = registeredCourses.reduce(
      (sum, c) => sum + (c.credits || 0),
      0
    );

    const completedCredits = student.completedCredits || 0;
    const requiredCredits = student.totalDegreeCredits || 160;
    const progressPercentage = Math.min(
      100,
      Math.round(((completedCredits + totalRegisteredCredits) / requiredCredits) * 100)
    );

    // Available courses count
    const availableCoursesCount = await Course.countDocuments({
      status: 'Active',
      availableSeats: { $gt: 0 },
    });

    // Upcoming weekly schedule
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const upcomingSchedule = [];

    for (const course of registeredCourses) {
      if (course.schedules) {
        for (const slot of course.schedules) {
          upcomingSchedule.push({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            courseCode: course.courseCode,
            courseName: course.courseName,
            room: course.room,
            facultyName: course.facultyName || 'Faculty',
            credits: course.credits,
          });
        }
      }
    }

    upcomingSchedule.sort((a, b) => {
      const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    // Smart Recommendations
    const allActiveCourses = await Course.find({ status: { $ne: 'Archived' } })
      .populate('department', 'name code')
      .populate('prerequisites', 'courseCode courseName');

    const { recommendations, advisorNotice } = generateRecommendations(
      student,
      allActiveCourses,
      registeredCourseIds
    );

    const setting = await SemesterSetting.findOne();

    res.json({
      success: true,
      data: {
        student: {
          _id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          department: student.department?.name || 'Department',
          departmentCode: student.department?.code || '',
          currentSemester: student.currentSemester,
          batch: student.batch,
        },
        stats: {
          registeredCoursesCount: registeredCourses.length,
          totalRegisteredCredits,
          completedCredits,
          requiredCredits,
          progressPercentage,
          availableCoursesCount,
          maxCreditLimit: setting?.maxCreditLimit || 24,
        },
        upcomingSchedule,
        recommendations,
        advisorNotice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student dashboard.',
    });
  }
};

// @desc    Get admin dashboard analytics & metrics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalCourses,
      totalDepartments,
      totalRegistrations,
      courses,
      departments,
      recentRegistrations,
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Course.countDocuments({ status: { $ne: 'Archived' } }),
      Department.countDocuments(),
      Registration.countDocuments({ status: 'Registered' }),
      Course.find({ status: { $ne: 'Archived' } }).populate('department', 'name code'),
      Department.find(),
      Registration.find()
        .populate('student', 'studentId name')
        .populate('course', 'courseCode courseName credits')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    let totalCapacity = 0;
    let totalEnrolled = 0;
    let fullCoursesCount = 0;

    courses.forEach((c) => {
      totalCapacity += c.capacity || 0;
      totalEnrolled += c.enrolledCount || 0;
      if ((c.availableSeats || 0) <= 0 || c.status === 'Full') {
        fullCoursesCount++;
      }
    });

    const totalAvailableSeats = Math.max(0, totalCapacity - totalEnrolled);
    const overallUtilizationRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    // 1. Department-wise registration stats
    const deptStatsMap = {};
    departments.forEach((d) => {
      deptStatsMap[d._id.toString()] = {
        name: d.name,
        code: d.code,
        courseCount: 0,
        enrolledCount: 0,
        capacity: 0,
      };
    });

    courses.forEach((c) => {
      const deptId = c.department?._id?.toString() || c.department?.toString();
      if (deptId && deptStatsMap[deptId]) {
        deptStatsMap[deptId].courseCount += 1;
        deptStatsMap[deptId].enrolledCount += c.enrolledCount || 0;
        deptStatsMap[deptId].capacity += c.capacity || 0;
      }
    });

    const departmentChartData = Object.values(deptStatsMap).map((item) => ({
      name: item.code,
      fullName: item.name,
      courses: item.courseCount,
      enrolled: item.enrolledCount,
      capacity: item.capacity,
    }));

    // 2. Most Popular Courses
    const popularCourses = [...courses]
      .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
      .slice(0, 6)
      .map((c) => ({
        code: c.courseCode,
        name: c.courseName,
        enrolled: c.enrolledCount,
        capacity: c.capacity,
        fillRate: Math.round(((c.enrolledCount || 0) / (c.capacity || 1)) * 100),
      }));

    // 3. Seat Utilization Data for Pie/Bar Chart
    const seatUtilizationData = [
      { name: 'Enrolled Seats', value: totalEnrolled, color: '#3b82f6' },
      { name: 'Available Seats', value: totalAvailableSeats, color: '#10b981' },
    ];

    // 4. Semester Distribution
    const semesterMap = {};
    for (let s = 1; s <= 8; s++) {
      semesterMap[s] = { semester: `Sem ${s}`, courseCount: 0, enrolledCount: 0 };
    }

    courses.forEach((c) => {
      const sem = c.semester || 1;
      if (semesterMap[sem]) {
        semesterMap[sem].courseCount += 1;
        semesterMap[sem].enrolledCount += c.enrolledCount || 0;
      }
    });

    const semesterChartData = Object.values(semesterMap);

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalFaculty,
          totalCourses,
          totalDepartments,
          totalRegistrations,
          totalCapacity,
          totalEnrolled,
          totalAvailableSeats,
          fullCoursesCount,
          overallUtilizationRate,
        },
        charts: {
          departmentChartData,
          popularCourses,
          seatUtilizationData,
          semesterChartData,
        },
        recentRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin dashboard analytics.',
    });
  }
};
