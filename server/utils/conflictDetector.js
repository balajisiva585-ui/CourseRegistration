/**
 * Helper to convert "HH:MM" format (24-hour) into total minutes from midnight.
 * e.g., "09:30" -> 570
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Checks if two schedule slots conflict (overlap on same day).
 */
export const checkSlotOverlap = (slotA, slotB) => {
  if (slotA.day !== slotB.day) return false;

  const startA = timeToMinutes(slotA.startTime);
  const endA = timeToMinutes(slotA.endTime);
  const startB = timeToMinutes(slotB.startTime);
  const endB = timeToMinutes(slotB.endTime);

  // Overlap condition: startA < endB && endA > startB
  return startA < endB && endA > startB;
};

/**
 * Compares new course's schedules against an array of existing courses.
 * @param {Object} newCourse - The course the student wants to register for.
 * @param {Array} existingCourses - The list of courses the student is already registered for.
 * @returns {Object} { hasConflict: boolean, conflicts: Array }
 */
export const detectScheduleConflict = (newCourse, existingCourses) => {
  const conflicts = [];

  if (!newCourse || !newCourse.schedules || !Array.isArray(existingCourses)) {
    return { hasConflict: false, conflicts: [] };
  }

  for (const existingCourse of existingCourses) {
    if (!existingCourse.schedules) continue;

    for (const newSlot of newCourse.schedules) {
      for (const existSlot of existingCourse.schedules) {
        if (checkSlotOverlap(newSlot, existSlot)) {
          conflicts.push({
            conflictingCourseId: existingCourse._id,
            conflictingCourseCode: existingCourse.courseCode,
            conflictingCourseName: existingCourse.courseName,
            day: newSlot.day,
            newCourseTime: `${newSlot.startTime} - ${newSlot.endTime}`,
            existingCourseTime: `${existSlot.startTime} - ${existSlot.endTime}`,
            message: `Time conflict on ${newSlot.day}: ${newCourse.courseCode} (${newSlot.startTime}-${newSlot.endTime}) overlaps with registered course ${existingCourse.courseCode} (${existSlot.startTime}-${existSlot.endTime})`,
          });
        }
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};
