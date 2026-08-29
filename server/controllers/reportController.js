import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';

// Helper to format rows as CSV
const generateCSV = (headers, rows) => {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCell).join(','));
  return [headerLine, ...dataLines].join('\n');
};

// @desc    Get aggregated reports data
// @route   GET /api/reports/data
// @access  Private/Admin
export const getReportData = async (req, res) => {
  try {
    const { type = 'COURSE_ENROLLMENT', department, semester } = req.query;

    let result = { type, data: [] };

    if (type === 'COURSE_ENROLLMENT') {
      const filter = { status: { $ne: 'Archived' } };
      if (department && department !== 'ALL') filter.department = department;
      if (semester && semester !== 'ALL') filter.semester = Number(semester);

      const courses = await Course.find(filter)
        .populate('department', 'name code')
        .populate('faculty', 'name')
        .sort({ enrolledCount: -1 });

      result.data = courses.map((c) => ({
        id: c._id,
        courseCode: c.courseCode,
        courseName: c.courseName,
        department: c.department?.name || 'N/A',
        faculty: c.facultyName || 'TBA',
        credits: c.credits,
        semester: c.semester,
        capacity: c.capacity,
        enrolledCount: c.enrolledCount,
        availableSeats: c.availableSeats,
        utilizationRate: `${Math.round(((c.enrolledCount || 0) / (c.capacity || 1)) * 100)}%`,
        status: c.status,
      }));
    } else if (type === 'STUDENT_REGISTRATION') {
      const filter = { status: 'Registered' };
      if (semester && semester !== 'ALL') filter.semester = Number(semester);

      const registrations = await Registration.find(filter)
        .populate({
          path: 'student',
          populate: { path: 'department', select: 'name code' },
        })
        .populate('course', 'courseCode courseName credits')
        .sort({ registrationDate: -1 });

      result.data = registrations.map((r) => ({
        registrationId: r.registrationId,
        studentId: r.student?.studentId || 'N/A',
        studentName: r.student?.name || 'N/A',
        department: r.student?.department?.name || 'N/A',
        courseCode: r.course?.courseCode || 'N/A',
        courseName: r.course?.courseName || 'N/A',
        credits: r.course?.credits || 0,
        semester: r.semester,
        registrationDate: r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A',
      }));
    } else if (type === 'DEPARTMENT_SUMMARY') {
      const departments = await Department.find();
      const summary = await Promise.all(
        departments.map(async (d) => {
          const courses = await Course.find({ department: d._id, status: { $ne: 'Archived' } });
          const studentCount = await Student.countDocuments({ department: d._id });
          const totalCapacity = courses.reduce((sum, c) => sum + (c.capacity || 0), 0);
          const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

          return {
            departmentCode: d.code,
            departmentName: d.name,
            headOfDepartment: d.headOfDepartment,
            totalStudents: studentCount,
            totalCourses: courses.length,
            totalCapacity,
            totalEnrolled,
            seatUtilization: totalCapacity > 0 ? `${Math.round((totalEnrolled / totalCapacity) * 100)}%` : '0%',
          };
        })
      );
      result.data = summary;
    } else if (type === 'FACULTY_WORKLOAD') {
      const faculty = await Faculty.find().populate('department', 'name code').populate('assignedCourses');
      result.data = faculty.map((f) => {
        const totalTeachingCredits = (f.assignedCourses || []).reduce((sum, c) => sum + (c.credits || 0), 0);
        const totalStudentsTaught = (f.assignedCourses || []).reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
        return {
          facultyId: f.facultyId,
          name: f.name,
          email: f.email,
          department: f.department?.name || 'N/A',
          specialization: f.specialization,
          assignedCoursesCount: (f.assignedCourses || []).length,
          totalTeachingCredits,
          totalStudentsTaught,
        };
      });
    } else {
      // General registration history report
      const history = await Registration.find()
        .populate('student', 'studentId name email')
        .populate('course', 'courseCode courseName credits')
        .sort({ createdAt: -1 })
        .limit(200);

      result.data = history.map((h) => ({
        registrationId: h.registrationId,
        studentId: h.student?.studentId || 'N/A',
        studentName: h.student?.name || 'N/A',
        courseCode: h.course?.courseCode || 'N/A',
        courseName: h.course?.courseName || 'N/A',
        status: h.status,
        semester: h.semester,
        registrationDate: h.registrationDate ? new Date(h.registrationDate).toLocaleDateString() : 'N/A',
        dropDate: h.dropDate ? new Date(h.dropDate).toLocaleDateString() : '-',
        dropReason: h.dropReason || '-',
      }));
    }

    res.json({
      success: true,
      type,
      count: result.data.length,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating report.',
    });
  }
};

// @desc    Export report as CSV file download
// @route   GET /api/reports/export-csv
// @access  Private/Admin
export const exportReportCSV = async (req, res) => {
  try {
    const { type = 'COURSE_ENROLLMENT', department, semester } = req.query;

    let headers = [];
    let rows = [];
    const filename = `academic_report_${type.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'COURSE_ENROLLMENT') {
      headers = [
        'Course Code',
        'Course Name',
        'Department',
        'Faculty',
        'Credits',
        'Semester',
        'Capacity',
        'Enrolled',
        'Available Seats',
        'Utilization Rate',
        'Status',
      ];

      const filter = { status: { $ne: 'Archived' } };
      if (department && department !== 'ALL') filter.department = department;
      if (semester && semester !== 'ALL') filter.semester = Number(semester);

      const courses = await Course.find(filter)
        .populate('department', 'name')
        .sort({ enrolledCount: -1 });

      rows = courses.map((c) => [
        c.courseCode,
        c.courseName,
        c.department?.name || 'N/A',
        c.facultyName || 'TBA',
        c.credits,
        c.semester,
        c.capacity,
        c.enrolledCount,
        c.availableSeats,
        `${Math.round(((c.enrolledCount || 0) / (c.capacity || 1)) * 100)}%`,
        c.status,
      ]);
    } else if (type === 'STUDENT_REGISTRATION') {
      headers = [
        'Registration ID',
        'Student ID',
        'Student Name',
        'Department',
        'Course Code',
        'Course Name',
        'Credits',
        'Semester',
        'Date',
      ];

      const filter = { status: 'Registered' };
      if (semester && semester !== 'ALL') filter.semester = Number(semester);

      const registrations = await Registration.find(filter)
        .populate({ path: 'student', populate: { path: 'department' } })
        .populate('course')
        .sort({ registrationDate: -1 });

      rows = registrations.map((r) => [
        r.registrationId,
        r.student?.studentId || 'N/A',
        r.student?.name || 'N/A',
        r.student?.department?.name || 'N/A',
        r.course?.courseCode || 'N/A',
        r.course?.courseName || 'N/A',
        r.course?.credits || 0,
        r.semester,
        r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A',
      ]);
    } else {
      // General registration log
      headers = [
        'Registration ID',
        'Student ID',
        'Student Name',
        'Course Code',
        'Course Name',
        'Status',
        'Semester',
        'Registration Date',
        'Drop Date',
        'Drop Reason',
      ];

      const regs = await Registration.find()
        .populate('student', 'studentId name')
        .populate('course', 'courseCode courseName')
        .sort({ createdAt: -1 });

      rows = regs.map((r) => [
        r.registrationId,
        r.student?.studentId || 'N/A',
        r.student?.name || 'N/A',
        r.course?.courseCode || 'N/A',
        r.course?.courseName || 'N/A',
        r.status,
        r.semester,
        r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A',
        r.dropDate ? new Date(r.dropDate).toLocaleDateString() : '-',
        r.dropReason || '-',
      ]);
    }

    const csvContent = generateCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating CSV export.',
    });
  }
};
