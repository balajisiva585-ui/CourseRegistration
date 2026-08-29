import { checkPrerequisites } from './prereqChecker.js';

/**
 * Generates academic planning recommendations for a given student.
 * @param {Object} student - Student document with completed courses and department.
 * @param {Array} allActiveCourses - All active course documents in catalog.
 * @param {Array} registeredCourseIds - Set or array of Course IDs student is currently registered for.
 * @returns {Object} { recommendations: Array, advisorNotice: string }
 */
export const generateRecommendations = (student, allActiveCourses, registeredCourseIds = []) => {
  const registeredSet = new Set(registeredCourseIds.map((id) => id.toString()));
  const completedCodes = new Set(
    (student.completedCourses || []).map((c) => (c.courseCode || '').toUpperCase())
  );

  const recommendations = [];

  for (const course of allActiveCourses) {
    // Skip already registered or completed
    if (registeredSet.has(course._id.toString())) continue;
    if (completedCodes.has(course.courseCode.toUpperCase())) continue;

    // Check prerequisite eligibility
    const prereqResult = checkPrerequisites(course, student);

    let priorityScore = 0;
    const reasons = [];

    // Prioritize if prerequisites are satisfied
    if (prereqResult.isSatisfied) {
      priorityScore += 30;
      if (prereqResult.completedPrereqs.length > 0) {
        reasons.push(`Prerequisites satisfied (${prereqResult.completedPrereqs.join(', ')})`);
      } else {
        reasons.push('No prerequisites required');
      }
    } else {
      // Cannot take yet if prerequisites not satisfied
      continue;
    }

    // Match student department
    if (student.department && course.department) {
      const studentDeptId = student.department._id ? student.department._id.toString() : student.department.toString();
      const courseDeptId = course.department._id ? course.department._id.toString() : course.department.toString();
      if (studentDeptId === courseDeptId) {
        priorityScore += 40;
        reasons.push('Core Department Requirement');
      }
    }

    // Target semester alignment (within 1 semester of current student semester)
    if (Math.abs(course.semester - (student.currentSemester || 1)) <= 1) {
      priorityScore += 20;
      reasons.push(`Targeted for Semester ${course.semester}`);
    }

    // High seat availability bonus
    if (course.availableSeats > 5) {
      priorityScore += 10;
      reasons.push('High seat availability');
    }

    // Course type weighting
    if (course.courseType === 'Core') {
      priorityScore += 15;
    } else if (course.courseType === 'Elective') {
      priorityScore += 10;
      reasons.push('Specialization Elective');
    }

    recommendations.push({
      course,
      priorityScore,
      reasons,
      availableSeats: course.availableSeats,
      capacity: course.capacity,
    });
  }

  // Sort by priorityScore descending
  recommendations.sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    recommendations: recommendations.slice(0, 6), // Top recommendations
    advisorNotice:
      'These are suggested courses based on your academic information and prerequisite progress. Please confirm your study plan with your official academic advisor.',
  };
};
