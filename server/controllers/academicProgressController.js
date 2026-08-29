import Student from '../models/Student.js';
import Registration from '../models/Registration.js';

// @desc    Get student academic progress details
// @route   GET /api/academic-progress
// @access  Private/Student
export const getAcademicProgress = async (req, res) => {
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
    }).populate('course');

    const currentCourses = activeRegistrations.map((r) => r.course).filter(Boolean);
    const currentRegisteredCredits = currentCourses.reduce(
      (sum, c) => sum + (c.credits || 0),
      0
    );

    const completedCourses = student.completedCourses || [];
    const completedCredits = student.completedCredits || 0;
    const totalRequiredCredits = student.totalDegreeCredits || 160;
    const remainingCredits = Math.max(0, totalRequiredCredits - completedCredits - currentRegisteredCredits);
    const completionPercentage = Math.min(
      100,
      Math.round(((completedCredits + currentRegisteredCredits) / totalRequiredCredits) * 100)
    );

    // Group completed courses by semester
    const semesterBreakdown = {};
    for (let s = 1; s <= 8; s++) {
      semesterBreakdown[s] = {
        semester: s,
        courses: [],
        totalCredits: 0,
      };
    }

    completedCourses.forEach((course) => {
      const sem = course.semesterCompleted || 1;
      if (semesterBreakdown[sem]) {
        semesterBreakdown[sem].courses.push(course);
        semesterBreakdown[sem].totalCredits += course.credits || 0;
      }
    });

    res.json({
      success: true,
      data: {
        student: {
          studentId: student.studentId,
          name: student.name,
          department: student.department?.name,
          currentSemester: student.currentSemester,
          batch: student.batch,
        },
        creditSummary: {
          completedCredits,
          currentRegisteredCredits,
          totalRequiredCredits,
          remainingCredits,
          completionPercentage,
        },
        completedCourses,
        currentCourses,
        semesterBreakdown: Object.values(semesterBreakdown),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching academic progress.',
    });
  }
};
