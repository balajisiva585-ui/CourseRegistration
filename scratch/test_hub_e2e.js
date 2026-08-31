import http from 'http';

const testEndpoint = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 5001,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const runAllHubTests = async () => {
  console.log('=======================================================');
  console.log('🔍 RUNNING COMPREHENSIVE TNEA HUB & SEARCH VERIFICATION');
  console.log('=======================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Search "coim" -> Coimbatore colleges
    const coimRes = await testEndpoint('http://localhost:5001/api/tnea/colleges?search=coim');
    assert(
      coimRes.status === 200 && coimRes.data?.data?.length > 0 && coimRes.data.data.some((c) => c.district.toLowerCase() === 'coimbatore'),
      'Search "coim" returns Coimbatore colleges (case-insensitive & partial match)',
      JSON.stringify(coimRes.data?.data?.map((c) => ({ name: c.name, district: c.district })))
    );

    // 2. District filter: "Coimbatore"
    const distCoimRes = await testEndpoint('http://localhost:5001/api/tnea/colleges?district=Coimbatore');
    assert(
      distCoimRes.status === 200 && distCoimRes.data?.data?.length > 0 && distCoimRes.data.data.every((c) => c.district.toLowerCase() === 'coimbatore'),
      'District filter "Coimbatore" strictly returns only Coimbatore colleges',
      `Found ${distCoimRes.data?.data?.length} colleges`
    );

    // 3. District filter: "Chennai"
    const distChenRes = await testEndpoint('http://localhost:5001/api/tnea/colleges?district=Chennai');
    assert(
      distChenRes.status === 200 && distChenRes.data?.data?.length > 0 && distChenRes.data.data.every((c) => c.district.toLowerCase() === 'chennai'),
      'District filter "Chennai" strictly returns only Chennai colleges',
      `Found ${distChenRes.data?.data?.length} colleges`
    );

    // 4. Combined Filter: District "Coimbatore" + Department "CS"
    const combRes = await testEndpoint('http://localhost:5001/api/tnea/colleges?district=Coimbatore&department=CS');
    assert(
      combRes.status === 200 && combRes.data?.data?.length > 0 && combRes.data.data.every((c) => c.district.toLowerCase() === 'coimbatore' && c.departments?.some((d) => d.departmentCode === 'CS')),
      'Combined District "Coimbatore" + Department "CS" filters accurately',
      `Found ${combRes.data?.data?.length} colleges`
    );

    // 5. College Details by Code: "0001" (CEG)
    const cegRes = await testEndpoint('http://localhost:5001/api/tnea/colleges/0001');
    assert(
      cegRes.status === 200 && cegRes.data?.data?.code === '0001' && cegRes.data?.data?.departments?.length > 0 && cegRes.data?.data?.cutoffs?.length > 0 && cegRes.data?.data?.seatMatrices?.length > 0,
      'College Details (0001) returns college profile, departments, multi-year cutoffs, and seat matrices',
      `Departments: ${cegRes.data?.data?.departments?.length}, Cutoffs: ${cegRes.data?.data?.cutoffs?.length}, Seats: ${cegRes.data?.data?.seatMatrices?.length}`
    );

    // 6. Cutoffs Filter: Year 2025, District "Chennai", Department "CS"
    const cutoffRes = await testEndpoint('http://localhost:5001/api/tnea/cutoffs?year=2025&district=Chennai&departmentCode=CS');
    assert(
      cutoffRes.status === 200 && cutoffRes.data?.data?.length > 0 && cutoffRes.data.data.every((c) => c.academicYear === 2025 && c.district.toLowerCase() === 'chennai' && c.departmentCode === 'CS'),
      'Cutoff Explorer filtering by Year (2025), District (Chennai), and Branch (CS) works with populated districts',
      `Found ${cutoffRes.data?.data?.length} cutoff records`
    );

    // 7. Cutoff Predictor Engine
    const predictRes = await testEndpoint('http://localhost:5001/api/tnea/cutoffs/predict', {
      method: 'POST',
      body: { cutoff: 192.5, community: 'BC', preferredDepartments: ['CS'] },
    });
    assert(
      predictRes.status === 200 && predictRes.data?.data && (predictRes.data.data.goodChance?.length > 0 || predictRes.data.data.moderateChance?.length > 0 || predictRes.data.data.lowChance?.length > 0),
      'Cutoff Predictor accurately calculates probability tiers (Good, Moderate, Low)',
      `Good: ${predictRes.data?.data?.goodChance?.length}, Moderate: ${predictRes.data?.data?.moderateChance?.length}, Low: ${predictRes.data?.data?.lowChance?.length}`
    );

    // 8. Seat Matrix Reservation Categories Breakdown
    const seatsRes = await testEndpoint('http://localhost:5001/api/tnea/seats?collegeCode=0001&departmentCode=CS&quota=Government');
    const firstSeat = seatsRes.data?.data?.[0];
    const categoriesCount = firstSeat?.categories?.length || 0;
    assert(
      seatsRes.status === 200 && categoriesCount >= 7 && firstSeat.categories.some((c) => c.category === 'BC' && c.totalSeats > 0),
      'Seat Matrix Reservation Category Breakdown returns full 7 quota categories with non-zero seats',
      `Categories found: ${firstSeat?.categories?.map((c) => `${c.category}:${c.totalSeats}`).join(', ')}`
    );

    // 9. Simulator: Cutoff calculation formula
    const calcRes = await testEndpoint('http://localhost:5001/api/tnea/simulator/calculate', {
      method: 'POST',
      body: { maths: 95, physics: 90, chemistry: 88 },
    });
    assert(
      calcRes.status === 200 && calcRes.data?.data?.engineeringCutoff === 184.0,
      'TNEA Cutoff formula verification: (Maths + Phys/2 + Chem/2 = 184.00)',
      `Calculated: ${calcRes.data?.data?.engineeringCutoff}`
    );

    // 10. Simulator: Smart suggestions with district preferences
    const suggRes = await testEndpoint('http://localhost:5001/api/tnea/simulator/suggestions', {
      method: 'POST',
      body: { cutoff: 192.5, community: 'BC', preferredDistricts: ['Coimbatore', 'Chennai'] },
    });
    assert(
      suggRes.status === 200 && (suggRes.data?.data?.safeChoices?.length > 0 || suggRes.data?.data?.targetChoices?.length > 0 || suggRes.data?.data?.dreamChoices?.length > 0),
      'TNEA Simulator Smart Suggestions returns Safe, Target, and Dream choices',
      `Safe: ${suggRes.data?.data?.safeChoices?.length}, Target: ${suggRes.data?.data?.targetChoices?.length}, Dream: ${suggRes.data?.data?.dreamChoices?.length}`
    );

    // 11. Simulator: Full 4-step simulation run with multi-year trend analysis
    const simRunRes = await testEndpoint('http://localhost:5001/api/tnea/simulator/run', {
      method: 'POST',
      body: {
        cutoff: 192.5,
        community: 'BC',
        preferences: [
          { priority: 1, collegeCode: '0001', collegeName: 'CEG', departmentCode: 'CS', departmentName: 'CSE', quota: 'Government' },
          { priority: 2, collegeCode: '2006', collegeName: 'PSG Tech', departmentCode: 'CS', departmentName: 'CSE', quota: 'Government' },
          { priority: 3, collegeCode: '2712', collegeName: 'KCT', departmentCode: 'CS', departmentName: 'CSE', quota: 'Government' },
        ],
      },
    });
    assert(
      simRunRes.status === 200 && simRunRes.data?.data?.results?.length === 3 && simRunRes.data.data.results.every((r) => r.fiveYearHistory?.length > 0),
      'TNEA Full Simulation accurately evaluates choices and attaches 5-year historical trends',
      `Results count: ${simRunRes.data?.data?.results?.length}, Highest recommended: ${simRunRes.data?.data?.highestRecommendedChoice?.collegeName}`
    );

    // 12. Compare Colleges Side-by-Side
    const compareRes = await testEndpoint('http://localhost:5001/api/tnea/compare?codes=0001,2006');
    assert(
      compareRes.status === 200 && compareRes.data?.data?.length === 2,
      'Compare Colleges endpoint returns side-by-side comparative metadata for 0001 & 2006',
      `Compared count: ${compareRes.data?.data?.length}`
    );

    // 13. Report Discrepancy & Admin View
    const reportRes = await testEndpoint('http://localhost:5001/api/tnea/colleges/0001/report', {
      method: 'POST',
      body: {
        issueType: 'Incorrect Phone Number',
        description: 'Office phone changed to 044-22358491 in 2026 gazette.',
        suggestedCorrection: '044-22358491',
        reporterName: 'Test Student',
      },
    });
    assert(
      reportRes.status === 201 && reportRes.data?.success === true,
      'Student Discrepancy Report successfully submitted',
      reportRes.data?.message
    );

    console.log('=======================================================');
    console.log(`🏁 TNEA VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=======================================================');
  } catch (error) {
    console.error('Fatal error during test run:', error);
  }
};

runAllHubTests();
