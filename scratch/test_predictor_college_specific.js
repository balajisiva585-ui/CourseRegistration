import http from 'http';

const BASE_URL = 'http://localhost:5001/api/tnea';

function makePostRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(payload);
    const url = new URL(`${BASE_URL}${path}`);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataStr),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function runTests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING COLLEGE-SPECIFIC PREDICTOR & ISOLATION REGRESSION TESTS');
  console.log('========================================================================\n');

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
    // -------------------------------------------------------------------------
    // TEST 1: College-Specific Cutoffs for AD + ST in 2025 (Cutoff = 190)
    // -------------------------------------------------------------------------
    const predRes = await makePostRequest('/cutoffs/predict', {
      cutoffMark: 190,
      community: 'ST',
      preferredDepartments: ['AD'],
      academicYear: 2025,
    });

    assert(predRes.success, 'TEST 1: /cutoffs/predict API returns success = true');
    assert(predRes.results?.goodChance?.length > 0, 'TEST 1: Predictor returns colleges for AD + ST');

    const allRecs = [
      ...(predRes.results?.goodChance || []),
      ...(predRes.results?.moderateChance || []),
      ...(predRes.results?.lowChance || []),
    ];

    const targetColleges = ['0001', '0004', '1304', '1315', '2006', '2711'];
    const matched = allRecs.filter((r) => targetColleges.includes(r.collegeCode));

    assert(matched.length >= 4, `TEST 1: Matched target colleges present (Found ${matched.length} of ${targetColleges.length})`);

    // Check that distinct colleges have DIFFERENT cutoff values (NOT all 158.00)
    const cutoffs = matched.map((r) => r.historicalCutoff);
    const uniqueCutoffs = new Set(cutoffs);
    assert(
      uniqueCutoffs.size > 1,
      `TEST 1: Historical cutoffs across target colleges are DIFFERENT and college-specific (Found unique values: ${[...uniqueCutoffs].join(', ')})`
    );

    // Verify none of them has a fabricated global 158.00 for all colleges
    const allAre158 = cutoffs.every((c) => c === 158.0);
    assert(!allAre158, 'TEST 1: Cutoffs are NOT all identical 158.00 fallback values');

    // Check ranges are also distinct
    const ranges = matched.map((r) => r.expectedCutoffRange?.display);
    const uniqueRanges = new Set(ranges);
    assert(uniqueRanges.size > 1, `TEST 1: Expected ranges are college-specific (Ranges: ${[...uniqueRanges].join(' | ')})`);

    // -------------------------------------------------------------------------
    // TEST 2: Community Category Isolation (ST vs BC)
    // -------------------------------------------------------------------------
    const bcRes = await makePostRequest('/cutoffs/predict', {
      cutoffMark: 190,
      community: 'BC',
      preferredDepartments: ['AD'],
      academicYear: 2025,
    });

    const stKongu = allRecs.find((r) => r.collegeCode === '2711');
    const allBcRecs = [
      ...(bcRes.results?.goodChance || []),
      ...(bcRes.results?.moderateChance || []),
      ...(bcRes.results?.lowChance || []),
    ];
    const bcKongu = allBcRecs.find((r) => r.collegeCode === '2711');

    assert(stKongu && bcKongu, 'TEST 2: Both ST and BC predictions return Kongu records');
    assert(
      stKongu && bcKongu && stKongu.historicalCutoff !== bcKongu.historicalCutoff,
      `TEST 2: Category Isolation verified (Kongu AD ST: ${stKongu?.historicalCutoff} vs BC: ${bcKongu?.historicalCutoff})`
    );

    // -------------------------------------------------------------------------
    // TEST 3: Branch Code Isolation (AD vs CS)
    // -------------------------------------------------------------------------
    const csRes = await makePostRequest('/cutoffs/predict', {
      cutoffMark: 190,
      community: 'ST',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });

    const allCsRecs = [
      ...(csRes.results?.goodChance || []),
      ...(csRes.results?.moderateChance || []),
      ...(csRes.results?.lowChance || []),
    ];

    const allDeptsAreAD = allRecs.every((r) => r.departmentCode === 'AD');
    assert(allDeptsAreAD, 'TEST 3: AD prediction request strictly returns ONLY AD department records');

    const allDeptsAreCS = allCsRecs.every((r) => r.departmentCode === 'CS');
    assert(allDeptsAreCS, 'TEST 3: CS prediction request strictly returns ONLY CS department records');

    // -------------------------------------------------------------------------
    // TEST 4: Prediction Tiering (Safe vs Target vs Reach based on College Cutoff)
    // -------------------------------------------------------------------------
    const midScoreRes = await makePostRequest('/cutoffs/predict', {
      cutoffMark: 182.0,
      community: 'ST',
      preferredDepartments: ['AD'],
      academicYear: 2025,
    });

    const midRecs = [
      ...(midScoreRes.results?.goodChance || []),
      ...(midScoreRes.results?.moderateChance || []),
      ...(midScoreRes.results?.lowChance || []),
    ];

    const cegRec = midRecs.find((r) => r.collegeCode === '0001');
    const easwariRec = midRecs.find((r) => r.collegeCode === '1304');

    assert(
      cegRec && easwariRec && (cegRec.admissionChance !== easwariRec.admissionChance || cegRec.difference !== easwariRec.difference),
      `TEST 4: Realistic Tiering: CEG (Diff: ${cegRec?.difference}, Tier: ${cegRec?.admissionChance}) vs Easwari (Diff: ${easwariRec?.difference}, Tier: ${easwariRec?.admissionChance})`
    );

  } catch (err) {
    console.error('Test error:', err);
    failed++;
  }

  console.log(`\n========================================================================`);
  console.log(`PREDICTOR TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
