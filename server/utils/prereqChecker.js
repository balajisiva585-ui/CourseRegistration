/**
 * Validates if a student satisfies all prerequisites for a target course.
 * @param {Object} course - The course object (with populated prerequisites or prerequisiteCodes)
 * @param {Object} student - The student object (with completedCourses array)
 * @returns {Object} { isSatisfied: boolean, missingPrereqs: string[], completedPrereqs: string[] }
 */
export const checkPrerequisites = (course, student) => {
  if (!course) {
    return { isSatisfied: true, missingPrereqs: [], completedPrereqs: [] };
  }

  const completedCourseCodes = new Set(
    (student?.completedCourses || []).map((c) => (c.courseCode || '').toUpperCase().trim())
  );

  const requiredCodes = [];

  // Extract from prerequisiteCodes array
  if (Array.isArray(course.prerequisiteCodes) && course.prerequisiteCodes.length > 0) {
    course.prerequisiteCodes.forEach((code) => {
      if (code && typeof code === 'string') {
        requiredCodes.push(code.toUpperCase().trim());
      }
    });
  }

  // Extract from populated or unpopulated prerequisites array
  if (Array.isArray(course.prerequisites) && course.prerequisites.length > 0) {
    course.prerequisites.forEach((p) => {
      if (typeof p === 'object' && p?.courseCode) {
        requiredCodes.push(p.courseCode.toUpperCase().trim());
      }
    });
  }

  const uniqueRequired = [...new Set(requiredCodes)];
  const missingPrereqs = [];
  const completedPrereqs = [];

  for (const req of uniqueRequired) {
    if (completedCourseCodes.has(req)) {
      completedPrereqs.push(req);
    } else {
      missingPrereqs.push(req);
    }
  }

  return {
    isSatisfied: missingPrereqs.length === 0,
    missingPrereqs,
    completedPrereqs,
    totalRequiredCount: uniqueRequired.length,
  };
};
