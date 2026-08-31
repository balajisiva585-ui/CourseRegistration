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

async function runTests() {
  console.log('\n--- Running 12 Test Cases for Rounds, Cutoffs & Data Integrity ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: 2025 + Round 1
    const res1 = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&limit=50');
    assert(res1.success && res1.data.length > 0, `TEST 1: 2025 + Round 1 returns records (Count: ${res1.data?.length})`);
    const allR1 = res1.data.every((r) => r.academicYear === 2025 && (r.counsellingRound === 1 || r.round === 'Round 1'));
    assert(allR1, 'TEST 1: All records strictly belong to 2025 Round 1');

    // TEST 2: 2025 + Round 2
    const res2 = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+2&limit=50');
    assert(res2.success && res2.data.length > 0, `TEST 2: 2025 + Round 2 returns records (Count: ${res2.data?.length})`);
    const allR2 = res2.data.every((r) => r.academicYear === 2025 && (r.counsellingRound === 2 || r.round === 'Round 2'));
    assert(allR2, 'TEST 2: All records strictly belong to 2025 Round 2');

    // TEST 3: 2025 + Round 3
    const res3 = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+3&limit=50');
    assert(res3.success && res3.data.length > 0, `TEST 3: 2025 + Round 3 returns records (Count: ${res3.data?.length})`);
    const allR3 = res3.data.every((r) => r.academicYear === 2025 && (r.counsellingRound === 3 || r.round === 'Round 3'));
    assert(allR3, 'TEST 3: All records strictly belong to 2025 Round 3');

    // TEST 4: 2024 + Round 1
    const res4 = await makeRequest('/api/tnea/cutoffs?year=2024&round=Round+1&limit=50');
    assert(res4.success && res4.data.length > 0, `TEST 4: 2024 + Round 1 returns records (Count: ${res4.data?.length})`);
    const all2024R1 = res4.data.every((r) => r.academicYear === 2024 && (r.counsellingRound === 1 || r.round === 'Round 1'));
    assert(all2024R1, 'TEST 4: All records strictly belong to 2024 Round 1');

    // TEST 5: 2024 + Round 2
    const res5 = await makeRequest('/api/tnea/cutoffs?year=2024&round=Round+2&limit=50');
    assert(res5.success && res5.data.length > 0, `TEST 5: 2024 + Round 2 returns records (Count: ${res5.data?.length})`);
    const all2024R2 = res5.data.every((r) => r.academicYear === 2024 && (r.counsellingRound === 2 || r.round === 'Round 2'));
    assert(all2024R2, 'TEST 5: All records strictly belong to 2024 Round 2');

    // TEST 6: 2024 + Round 3
    const res6 = await makeRequest('/api/tnea/cutoffs?year=2024&round=Round+3&limit=50');
    assert(res6.success && res6.data.length > 0, `TEST 6: 2024 + Round 3 returns records (Count: ${res6.data?.length})`);
    const all2024R3 = res6.data.every((r) => r.academicYear === 2024 && (r.counsellingRound === 3 || r.round === 'Round 3'));
    assert(all2024R3, 'TEST 6: All records strictly belong to 2024 Round 3');

    // TEST 7: Round change must change API results on participating colleges and show authentic non-allotment for filled colleges
    const r1Kongu = (await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&collegeCode=2711&departmentCode=CS')).data[0];
    const r2Kongu = (await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+2&collegeCode=2711&departmentCode=CS')).data[0];
    const r1Ceg = (await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&collegeCode=0001&departmentCode=CS')).data[0];
    const r2Ceg = (await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+2&collegeCode=0001&departmentCode=CS')).data[0];

    assert(
      r1Kongu && r2Kongu && r1Kongu.bcCutoff !== r2Kongu.bcCutoff && r1Ceg && r2Ceg && r2Ceg.ocCutoff === null,
      `TEST 7: Round change updates cutoffs for multi-round colleges (Kongu BC R1: ${r1Kongu?.bcCutoff}, R2: ${r2Kongu?.bcCutoff}) and preserves official null for R1-filled colleges (CEG R2: ${r2Ceg?.ocCutoff})`
    );

    // TEST 8: Year change must change API results
    const y2024 = (await makeRequest('/api/tnea/cutoffs?year=2024&round=Round+1&collegeCode=2711&departmentCode=CS')).data[0];
    const y2025 = (await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&collegeCode=2711&departmentCode=CS')).data[0];
    assert(
      y2024 && y2025 && y2024.ocCutoff !== y2025.ocCutoff,
      `TEST 8: Year change changes cutoff marks (Kongu CS 2024: ${y2024?.ocCutoff}, 2025: ${y2025?.ocCutoff})`
    );

    // TEST 9: Community change must change cutoff field and minCutoff filtering
    const bcFilter = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&community=BC&minCutoff=185');
    const allBcAbove185 = bcFilter.data.every((r) => r.bcCutoff >= 185);
    assert(allBcAbove185 && bcFilter.data.length > 0, `TEST 9: Community BC with minCutoff 185 correctly filters on bcCutoff (Count: ${bcFilter.data.length})`);

    // TEST 10: College + branch combination must return the exact unique record
    const exactQuery = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&collegeCode=2006&departmentCode=CS');
    assert(
      exactQuery.data.length === 1 && exactQuery.data[0].collegeCode === '2006' && exactQuery.data[0].departmentCode === 'CS',
      `TEST 10: College 2006 (PSG Tech) + CS in 2025 R1 returns exactly 1 unique record (OC: ${exactQuery.data[0]?.ocCutoff})`
    );

    // TEST 11: No duplicate college/branch/year/round records
    const all2025R1 = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&limit=500');
    const keys = new Set();
    let dupCount = 0;
    for (const r of all2025R1.data) {
      const k = `${r.academicYear}-${r.counsellingRound}-${r.collegeCode}-${r.departmentCode}`;
      if (keys.has(k)) dupCount++;
      else keys.add(k);
    }
    assert(dupCount === 0, `TEST 11: Zero duplicate records in 2025 Round 1 (Checked ${all2025R1.data.length} records)`);

    // TEST 12: Missing or invalid filter yields clean 0 count without fake fabrication
    const emptyQuery = await makeRequest('/api/tnea/cutoffs?year=2025&round=Round+1&collegeCode=9999');
    assert(emptyQuery.data.length === 0 && emptyQuery.pagination.total === 0, 'TEST 12: Non-existent college code returns 0 records cleanly without fabricating data');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`ROUND & CUTOFF TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
