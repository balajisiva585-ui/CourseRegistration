import Student from '../models/Student.js';
import Registration from '../models/Registration.js';

// @desc    Get student weekly timetable schedule
// @route   GET /api/timetable/student
// @access  Private/Student
export const getStudentTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
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

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timetableByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    let totalSlots = 0;

    for (const reg of activeRegistrations) {
      const course = reg.course;
      if (!course || !course.schedules) continue;

      for (const slot of course.schedules) {
        if (timetableByDay[slot.day]) {
          timetableByDay[slot.day].push({
            courseId: course._id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            courseType: course.courseType,
            credits: course.credits,
            room: course.room || 'TBA',
            facultyName: course.facultyName || 'Faculty',
            startTime: slot.startTime,
            endTime: slot.endTime,
            timeSlot: `${slot.startTime} - ${slot.endTime}`,
          });
          totalSlots++;
        }
      }
    }

    // Sort each day's slots chronologically
    for (const day of days) {
      timetableByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    res.json({
      success: true,
      data: {
        days,
        timetableByDay,
        totalRegisteredCourses: activeRegistrations.length,
        totalSlots,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating timetable.',
    });
  }
};
