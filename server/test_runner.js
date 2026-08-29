const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('=======================================================');
  console.log('🧪 RUNNING COMPREHENSIVE END-TO-END SYSTEM TEST SUITE');
  console.log('=======================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, extraInfo = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${extraInfo ? `(${extraInfo})` : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await (await fetch(`${BASE_URL}/health`)).json();
    assert(healthRes?.status === 'online', 'Server Health Check Endpoint (/api/health)');

    // 2. Authentication - Student Login
    const stuLoginRes = await (await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', password: 'Student@123' }),
    })).json();
    assert(stuLoginRes?.success && stuLoginRes?.data?.token, 'Student Login (student@example.com)');
    const studentToken = stuLoginRes.data.token;

    // 3. Authentication - Admin Login
    const adminLoginRes = await (await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@123' }),
    })).json();
    assert(adminLoginRes?.success && adminLoginRes?.data?.role === 'ADMIN', 'Admin Login (admin@example.com)');
    const adminToken = adminLoginRes.data.token;

    // 4. Authentication - Faculty Login
    const facLoginRes = await (await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'faculty@example.com', password: 'Faculty@123' }),
    })).json();
    assert(facLoginRes?.success && facLoginRes?.data?.role === 'FACULTY', 'Faculty Login (faculty@example.com)');
    const facultyToken = facLoginRes.data.token;

    // 5. Auth Profile check with Bearer token
    const profileRes = await (await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(profileRes?.success && profileRes?.data?.email === 'student@example.com', 'Protected Profile Check (/api/auth/profile)');

    // 6. Student Dashboard
    const stuDashRes = await (await fetch(`${BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(stuDashRes?.success && stuDashRes?.data?.student, 'Student Dashboard Metrics & Courses');

    // 7. Course Catalog
    const coursesRes = await (await fetch(`${BASE_URL}/courses`)).json();
    assert(coursesRes?.success && Array.isArray(coursesRes?.data) && coursesRes.data.length > 0, 'Course Catalog Listing');
    const courses = coursesRes.data;

    // 8. Timetable
    const timetableRes = await (await fetch(`${BASE_URL}/timetable/student`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(timetableRes?.success && timetableRes?.data?.timetableByDay, 'Student Weekly Timetable Generation');

    // 9. Academic Progress
    const progressRes = await (await fetch(`${BASE_URL}/academic-progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(progressRes?.success && progressRes?.data?.creditSummary, 'Student Academic Progress & Degree Audit');

    // 10. AI Recommendations
    const recsRes = await (await fetch(`${BASE_URL}/recommendations`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(recsRes?.success && Array.isArray(recsRes?.data?.recommendations), 'Rule-based Course Recommendations');

    // 11. Notifications
    const notifsRes = await (await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })).json();
    assert(notifsRes?.success && Array.isArray(notifsRes?.data), 'In-App Notifications Retrieval');

    // 12. Faculty Dashboard & Rosters
    const facCoursesRes = await (await fetch(`${BASE_URL}/faculty/me/courses`, {
      headers: { Authorization: `Bearer ${facultyToken}` },
    })).json();
    assert(facCoursesRes?.success && Array.isArray(facCoursesRes?.data), 'Faculty Assigned Courses & Enrolled Rosters');

    // 13. Admin Dashboard
    const adminDashRes = await (await fetch(`${BASE_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(adminDashRes?.success && adminDashRes?.data?.summary, 'Admin Dashboard Aggregated Statistics');

    // 14. Admin Students Management
    const adminStudsRes = await (await fetch(`${BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(adminStudsRes?.success && Array.isArray(adminStudsRes?.data), 'Admin Students Directory Listing');

    // 15. Admin Faculty Management
    const adminFacRes = await (await fetch(`${BASE_URL}/faculty`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(adminFacRes?.success && Array.isArray(adminFacRes?.data), 'Admin Faculty Directory Listing');

    // 16. Admin Department Management
    const adminDeptsRes = await (await fetch(`${BASE_URL}/departments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(adminDeptsRes?.success && Array.isArray(adminDeptsRes?.data), 'Admin Departments Listing');

    // 17. Admin Registration Monitoring
    const adminRegsRes = await (await fetch(`${BASE_URL}/registrations`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(adminRegsRes?.success && Array.isArray(adminRegsRes?.data), 'Admin Live Registrations Monitor');

    // 18. Admin Reports Data
    const reportRes = await (await fetch(`${BASE_URL}/reports/data?type=COURSE_ENROLLMENT`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(reportRes?.success && Array.isArray(reportRes?.data), 'Admin Analytical Reports Endpoint');

    // 19. Admin CSV Export
    const csvRes = await (await fetch(`${BASE_URL}/reports/export-csv?type=COURSE_ENROLLMENT`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).text();
    assert(typeof csvRes === 'string' && csvRes.includes('Course Code'), 'Admin CSV Export Generation');

    // 20. Admin Audit Logs
    const auditRes = await (await fetch(`${BASE_URL}/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(auditRes?.success && Array.isArray(auditRes?.data), 'Security & System Audit Logs Query');

    // 21. Admin System Settings
    const settingsRes = await (await fetch(`${BASE_URL}/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })).json();
    assert(settingsRes?.success && settingsRes?.data?.maxCreditLimit, 'Semester Configurations & Rules');

    // 22. Test Prerequisite Engine Validation Logic (CS506 has prerequisite ADV999 which is not satisfied)
    const missingPrereqCourse = courses.find((c) => c.courseCode === 'CS506');
    if (missingPrereqCourse) {
      const regAttempt = await (await fetch(`${BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ courseId: missingPrereqCourse._id }),
      })).json();
      assert(!regAttempt.success && regAttempt.message?.includes('Prerequisite'), 'Prerequisite Validation Engine (CS506 missing prereq rejected)');
    }

    // 23. Test Capacity Enforcement (CS505 has 0 available seats)
    const fullCourse = courses.find((c) => c.courseCode === 'CS505');
    if (fullCourse) {
      const fullRegAttempt = await (await fetch(`${BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ courseId: fullCourse._id }),
      })).json();
      assert(!fullRegAttempt.success && fullRegAttempt.message?.includes('capacity') || fullRegAttempt.message?.includes('seats'), 'Course Capacity Limit Validation (Full course rejected)');
    }

    // 24. Test Duplicate Registration Detection (CS501 is already enrolled in seed data)
    const duplicateCourse = courses.find((c) => c.courseCode === 'CS501');
    if (duplicateCourse) {
      const dupRegRes = await (await fetch(`${BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ courseId: duplicateCourse._id }),
      })).json();
      assert(!dupRegRes.success && dupRegRes.message?.includes('already registered'), 'Duplicate Registration Detection Engine');
    }

    // 25. Test Successful Registration on Eligible Course (CS503)
    const eligibleCourse = courses.find((c) => c.courseCode === 'CS503');
    if (eligibleCourse) {
      const validRegRes = await (await fetch(`${BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ courseId: eligibleCourse._id }),
      })).json();
      assert(validRegRes.success && validRegRes.data?.registration, `Course Registration Engine Success (${eligibleCourse.courseCode})`);

      const createdRegId = validRegRes.data.registration._id;

      // 26. Test Drop Course Operation
      const dropRes = await (await fetch(`${BASE_URL}/registrations/${createdRegId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ reason: 'Student schedule preference adjustment' }),
      })).json();
      assert(dropRes.success, `Course Drop & Seat Restoration Operation (${eligibleCourse.courseCode})`);
    }

    console.log('\n=======================================================');
    console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=======================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runTests();
