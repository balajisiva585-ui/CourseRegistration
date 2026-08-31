import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5001/api/tnea${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, status: res.statusCode });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      `http://localhost:5001/api/tnea${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ raw: data, status: res.statusCode });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- Running Comprehensive Master Dataset & API Verification ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` (${detail})` : ''}`);
      failed++;
    }
  }

  // 1. Total college count
  const t1 = await get('/colleges?limit=100');
  assert(t1.success && t1.pagination?.total >= 50, 'Total college count is comprehensive', `Total: ${t1.pagination?.total}`);

  // 2. Chennai college count
  const t2 = await get('/colleges?district=Chennai&limit=100');
  assert(t2.success && t2.pagination?.total >= 8, 'Multiple authentic Chennai colleges returned', `Count: ${t2.pagination?.total}`);

  // 3. Coimbatore college count
  const t3 = await get('/colleges?district=Coimbatore&limit=100');
  assert(t3.success && t3.pagination?.total >= 8, 'Multiple authentic Coimbatore colleges returned', `Count: ${t3.pagination?.total}`);

  // 4. All Districts dynamic aggregation
  const t4 = await get('/districts');
  assert(t4.success && t4.data?.length >= 15, 'Dynamic district aggregation covers 15+ Tamil Nadu districts', `Districts: ${t4.data?.length}`);

  // 5. College name search (PSG)
  const t5 = await get('/colleges?search=PSG');
  const psgMatch = t5.data?.some((c) => c.name.includes('PSG') || c.shortName.includes('PSG'));
  assert(t5.success && psgMatch && t5.data.length >= 2, 'College name search matches PSG institutions', `Matches: ${t5.data?.length}`);

  // 6. College code search (0001)
  const t6 = await get('/colleges?search=0001');
  assert(t6.success && t6.data?.length === 1 && t6.data[0].code === '0001', 'College code search returns CEG Anna University', `Found: ${t6.data?.[0]?.shortName}`);

  // 7. Branch search
  const t7 = await get('/colleges?department=CS&limit=50');
  assert(t7.success && t7.pagination?.total >= 40, 'Department filter (CS) matches colleges offering CSE', `Total: ${t7.pagination?.total}`);

  // 8. District filter (Madurai)
  const t8 = await get('/colleges?district=Madurai');
  const maduraiOnly = t8.data?.every((c) => c.district.toLowerCase() === 'madurai');
  assert(t8.success && maduraiOnly && t8.data?.length >= 2, 'District filter strictly returns Madurai colleges', `Count: ${t8.data?.length}`);

  // 9. Pagination
  const t9Page1 = await get('/colleges?page=1&limit=10');
  const t9Page2 = await get('/colleges?page=2&limit=10');
  const uniqueColleges = t9Page1.data[0]?.code !== t9Page2.data[0]?.code;
  assert(t9Page1.success && t9Page2.success && uniqueColleges, 'Server-side pagination delivers non-overlapping pages', `Page 1: ${t9Page1.data?.[0]?.code}, Page 2: ${t9Page2.data?.[0]?.code}`);

  // 10. Year filter in Cutoffs
  const t10 = await get('/cutoffs?year=2024&round=Round+1&limit=25');
  const year2024Only = t10.data?.every((c) => c.academicYear === 2024);
  assert(t10.success && year2024Only && t10.pagination?.total > 100, 'Year filter returns authentic 2024 cutoff records', `Total: ${t10.pagination?.total}`);

  // 11. Cutoff filter (Min Cutoff = 185)
  const t11 = await get('/cutoffs?year=2025&round=Round+1&minCutoff=185&limit=50');
  const allAbove185 = t11.data?.length > 0 && t11.data.every((c) => c.ocCutoff >= 185);
  assert(t11.success && allAbove185, 'Cutoff filter strictly returns records with ocCutoff >= 185.00', `Count: ${t11.data?.length}`);

  // 12. Seat matrix reservation quotas
  const t12 = await get('/seats?collegeCode=0001&academicYear=2025&round=Round+1&quota=Government');
  const quotas = t12.data?.[0]?.categories?.map((c) => c.category);
  const hasAllQuotas = ['OC', 'BC', 'BCM', 'MBC/DNC', 'SC', 'SCA', 'ST'].every((q) => quotas?.includes(q));
  assert(t12.success && hasAllQuotas, 'Seat matrix provides all 7 reservation quotas (OC, BC, BCM, MBC/DNC, SC, SCA, ST)');

  // 13. Fee structures endpoint
  const t13 = await get('/fees?collegeCode=0001');
  assert(t13.success && t13.data?.length > 0 && t13.data[0].tuitionFee > 0, 'Official fee structure returned for institution', `Tuition: ₹${t13.data?.[0]?.tuitionFee}`);

  // 14. Data Sources Registry metadata
  const t14 = await get('/data-sources');
  assert(t14.success && t14.data?.sources?.length >= 5 && t14.data?.integrityStats?.totalColleges >= 50, 'Data Sources page metadata accurately reflects database scale', `Total: ${t14.data?.integrityStats?.totalColleges}`);

  console.log(`\n========================================`);
  console.log(`MASTER DATASET TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
