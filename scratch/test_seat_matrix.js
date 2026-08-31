import http from 'http';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5001${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function runSeatMatrixTests() {
  console.log('\n--- Running Comprehensive Seat Availability Matrix Verification ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message} | ${details}`);
      failed++;
    }
  }

  try {
    // TEST 1: CEG (0001) + CS + 2025 + Round 2 + Government
    const cegCsR2 = await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2025&round=Round+2&quota=Government');
    assert(
      cegCsR2.success && cegCsR2.data.length === 1 && cegCsR2.data[0].collegeCode === '0001' && cegCsR2.data[0].departmentCode === 'CS' && (cegCsR2.data[0].counsellingRound === 2 || cegCsR2.data[0].round === 'Round 2'),
      'TEST 1: CEG + CS + 2025 + Round 2 + Government returns seat data',
      `Found: ${cegCsR2.data?.length} records`
    );
    const catCount = cegCsR2.data[0]?.categories?.length || 0;
    assert(catCount === 7, `TEST 1b: All 7 reservation categories present (Found: ${catCount})`);

    // TEST 2: Round 1 vs Round 2 vs Round 3 returns distinct availability
    const r1 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2025&round=Round+1&quota=Government')).data[0];
    const r2 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2025&round=Round+2&quota=Government')).data[0];
    const r3 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2025&round=Round+3&quota=Government')).data[0];
    assert(
      r1 && r2 && r3 && r1.totalAvailable > r2.totalAvailable && r2.totalAvailable > r3.totalAvailable,
      `TEST 2: Round progression reflects decreasing seat availability (R1 Avail: ${r1?.totalAvailable}, R2 Avail: ${r2?.totalAvailable}, R3 Avail: ${r3?.totalAvailable})`
    );

    // TEST 3: Year 2024 vs 2025 vs 2026
    const y24 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2024&round=Round+2&quota=Government')).data[0];
    const y25 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2025&round=Round+2&quota=Government')).data[0];
    const y26 = (await makeRequest('/api/tnea/seats?collegeCode=0001&departmentCode=CS&academicYear=2026&round=Round+2&quota=Government')).data[0];
    assert(
      y24 && y25 && y26 && y24.academicYear === 2024 && y25.academicYear === 2025 && y26.academicYear === 2026,
      'TEST 3: Multi-year seat matrices (2024, 2025, 2026) populated and queryable'
    );

    // TEST 4: Management Quota vs Government Quota for Autonomous Institution (2006 PSG Tech)
    const psgGov = (await makeRequest('/api/tnea/seats?collegeCode=2006&departmentCode=CS&academicYear=2025&round=Round+1&quota=Government')).data[0];
    const psgMgmt = (await makeRequest('/api/tnea/seats?collegeCode=2006&departmentCode=CS&academicYear=2025&round=Round+1&quota=Management')).data[0];
    assert(
      psgGov && psgMgmt && psgGov.quota === 'Government' && psgMgmt.quota === 'Management',
      `TEST 4: PSG Tech Government (${psgGov?.totalIntake} seats) and Management (${psgMgmt?.totalIntake} seats) quotas separated`
    );

    // TEST 5: Overall Quota returns all quota records for college/branch
    const psgAll = await makeRequest('/api/tnea/seats?collegeCode=2006&departmentCode=CS&academicYear=2025&round=Round+1&quota=Overall');
    assert(
      psgAll.success && psgAll.data.length >= 2,
      `TEST 5: Overall Quota returns multiple quotas (Government + Management) (Count: ${psgAll.data?.length})`
    );

    // TEST 6: Other colleges (Kongu 2711, Thiagarajar 5008, GCT 2005)
    const kongu = (await makeRequest('/api/tnea/seats?collegeCode=2711&departmentCode=CS&academicYear=2025&round=Round+2&quota=Government')).data[0];
    const tce = (await makeRequest('/api/tnea/seats?collegeCode=5008&departmentCode=EC&academicYear=2025&round=Round+2&quota=Government')).data[0];
    assert(
      kongu && tce,
      `TEST 6: Other institutions work for Round 2 (Kongu: ${kongu?.collegeName}, TCE: ${tce?.collegeName})`
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`SEAT MATRIX TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runSeatMatrixTests();
