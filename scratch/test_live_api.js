const BASE_URL = 'http://localhost:5001/api/tnea';

async function runLiveTests() {
  console.log(`--- Running Live API Verification on ${BASE_URL} ---\n`);
  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} - ${details}`);
      failed++;
    }
  }

  // Helper fetch
  const get = async (path) => {
    const res = await fetch(`${BASE_URL}${path}`);
    return await res.json();
  };

  const post = async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  };

  // Test 1: Empty filters -> ALL colleges
  const t1 = await get('/cutoffs?year=2025&round=Round+1&limit=50');
  assert(t1.success && t1.pagination.total >= 40, 'Empty filters returns full multi-college dataset', `Total records: ${t1.pagination?.total}`);
  const t1Colleges = new Set(t1.data.map(r => r.collegeCode));
  assert(t1Colleges.size > 5, 'Results include multiple distinct colleges across TN', `Distinct colleges: ${t1Colleges.size}`);

  // Test 2: Min Cutoff = 180
  const t2 = await get('/cutoffs?year=2025&round=Round+1&minCutoff=180&limit=50');
  const allGte180 = t2.data.every(r => r.ocCutoff >= 180);
  const noneLt180 = !t2.data.some(r => r.ocCutoff < 180);
  assert(t2.success && allGte180 && noneLt180 && t2.data.length > 0, 'Min Cutoff = 180: All records ocCutoff >= 180 and none < 180', `Returned ${t2.data.length} records`);
  const t2Colleges = new Set(t2.data.map(r => r.collegeCode));
  assert(t2Colleges.size > 3, 'Min Cutoff = 180: Returns multiple colleges across TN (not single college)', `Found ${t2Colleges.size} distinct colleges`);

  // Test 3: Min Cutoff = 150
  const t3 = await get('/cutoffs?year=2025&round=Round+1&minCutoff=150&limit=50');
  const allGte150 = t3.data.every(r => r.ocCutoff >= 150);
  assert(t3.success && allGte150 && t3.pagination.total >= t2.pagination.total, 'Min Cutoff = 150: Returns superset of Min Cutoff = 180', `150 total: ${t3.pagination.total}, 180 total: ${t2.pagination.total}`);

  // Test 4: District = Coimbatore
  const t4 = await get('/cutoffs?year=2025&round=Round+1&district=Coimbatore&limit=50');
  const allCbe = t4.data.every(r => r.district.toLowerCase() === 'coimbatore');
  const cbeColleges = new Set(t4.data.map(r => r.collegeCode));
  assert(t4.success && allCbe && cbeColleges.size >= 4, 'District = Coimbatore: Strictly Coimbatore colleges returned', `Colleges (${cbeColleges.size}): ${[...cbeColleges].join(', ')}`);

  // Test 5: District = All
  const t5 = await get('/cutoffs?year=2025&round=Round+1&district=All&limit=50');
  const distSet = new Set(t5.data.map(r => r.district).filter(Boolean));
  assert(t5.success && distSet.size >= 3, 'District = All: Returns records from multiple districts', `Districts: ${[...distSet].join(', ')}`);

  // Test 6: Search box 'PSG'
  const t6 = await get('/cutoffs?year=2025&round=Round+1&collegeName=PSG&limit=50');
  const psgMatched = t6.data.some(r => r.collegeCode === '2006' || r.collegeCode === '2025');
  assert(t6.success && psgMatched && t6.data.length > 0, "Search 'PSG' matches PSG Tech / PSG iTech cutoffs", `Found ${t6.data.length} records`);

  // Test 7: Search by code '0001'
  const t7 = await get('/cutoffs?year=2025&round=Round+1&collegeName=0001&limit=50');
  assert(t7.success && t7.data.length > 0 && t7.data[0].collegeCode === '0001', "Search by 4-digit code '0001' matches CEG Anna University", `Found ${t7.data.length} records`);

  // Test 8: Search by code '2711'
  const t8 = await get('/cutoffs?year=2025&round=Round+1&collegeName=2711&limit=50');
  assert(t8.success && t8.data.length > 0 && t8.data[0].collegeCode === '2711', "Search by code '2711' matches Kongu Engineering College", `Found ${t8.data.length} records`);

  // Test 9: Department = CS
  const t9 = await get('/cutoffs?year=2025&round=Round+1&departmentCode=CS&limit=50');
  const allCS = t9.data.every(r => r.departmentCode === 'CS');
  assert(t9.success && allCS && t9.data.length > 10, 'Department = CS returns CSE records across all colleges', `Found ${t9.data.length} CSE records`);

  // Test 10: Multi-round support (Round 2)
  const t10 = await get('/cutoffs?year=2025&round=Round+2&limit=50');
  const allR2 = t10.data.every(r => r.round === 'Round 2');
  assert(t10.success && allR2 && t10.data.length > 0, 'Round 2 filter returns Round 2 cutoff records', `Found ${t10.data.length} Round 2 records`);

  // Test 11: Seat matrix categories
  const t11 = await get('/seats?collegeCode=0001&academicYear=2025&round=Round+1&quota=Government');
  const hasCategories = t11.data.length > 0 && t11.data[0].categories?.length >= 7;
  assert(t11.success && hasCategories, 'Seat matrix provides all 7 reservation quotas (OC, BC, BCM, MBC/DNC, SC, SCA, ST)', `Categories count: ${t11.data[0]?.categories?.length}`);

  // Test 12: Predictor endpoint
  const t12 = await post('/cutoffs/predict', { cutoff: 188.5, community: 'OC' });
  const count = (t12.results?.goodChance?.length || 0) + (t12.results?.moderateChance?.length || 0) + (t12.results?.lowChance?.length || 0);
  const hasPredictions = t12.success && count > 0;
  assert(hasPredictions, 'Cutoff Predictor generates high-confidence college recommendations', `Recommendations count: ${count}`);

  console.log(`\n========================================`);
  console.log(`LIVE API TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runLiveTests().catch(err => {
  console.error('Live Test Error:', err);
  process.exit(1);
});
