import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import { generateRecommendations } from '../utils/recommender.js';

// @desc    Get academic planning recommendations
// @route   GET /api/recommendations
// @access  Private/Student
export const getRecommendations = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('department');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const activeRegistrations = await Registration.find({
      student: student._id,
      status: 'Registered',
    });

    const registeredCourseIds = activeRegistrations.map((r) => r.course);

    const allCourses = await Course.find({ status: { $ne: 'Archived' } })
      .populate('department', 'name code')
      .populate('prerequisites', 'courseCode courseName');

    const result = generateRecommendations(student, allCourses, registeredCourseIds);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating recommendations.',
    });
  }
};
