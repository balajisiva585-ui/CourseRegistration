import http from 'http';

function postRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

async function runCategoryRecommendationTests() {
  console.log('\n--- Running Category-Specific Recommendation & Prediction Verification ---\n');
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
    // 1. Validation 1: BC uses BC cutoffs
    const bcRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 185.00,
      community: 'BC',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    assert(bcRes.success === true, 'Validation 1: BC prediction request succeeds');
    const bcAll = [...(bcRes.results?.safe || []), ...(bcRes.results?.target || []), ...(bcRes.results?.reach || [])];
    assert(
      bcAll.length > 0 && bcAll.every((item) => item.selectedCategory === 'BC' && item.community === 'BC'),
      `Validation 1: All recommendations for BC strictly use BC community tag (Evaluated: ${bcAll.length})`
    );

    // 2. Validation 2: SC uses SC cutoffs
    const scRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 165.00,
      community: 'SC',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    const scAll = [...(scRes.results?.safe || []), ...(scRes.results?.target || []), ...(scRes.results?.reach || [])];
    assert(
      scAll.length > 0 && scAll.every((item) => item.selectedCategory === 'SC'),
      `Validation 2: SC strictly uses SC cutoffs (Evaluated: ${scAll.length})`
    );

    // 3. Validation 3: MBC/DNC uses MBC/DNC cutoffs
    const mbcRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 175.00,
      community: 'MBC/DNC',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    const mbcAll = [...(mbcRes.results?.safe || []), ...(mbcRes.results?.target || []), ...(mbcRes.results?.reach || [])];
    assert(
      mbcAll.length > 0 && mbcAll.every((item) => item.selectedCategory === 'MBC/DNC'),
      `Validation 3: MBC/DNC strictly uses MBC/DNC cutoffs (Evaluated: ${mbcAll.length})`
    );

    // 4. Validation 4: SCA uses SCA cutoffs
    const scaRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 155.00,
      community: 'SCA',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    const scaAll = [...(scaRes.results?.safe || []), ...(scaRes.results?.target || []), ...(scaRes.results?.reach || [])];
    assert(
      scaAll.length > 0 && scaAll.every((item) => item.selectedCategory === 'SCA'),
      `Validation 4: SCA strictly uses SCA cutoffs (Evaluated: ${scaAll.length})`
    );

    // 5. Validation 5: ST uses ST cutoffs
    const stRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 145.00,
      community: 'ST',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    const stAll = [...(stRes.results?.safe || []), ...(stRes.results?.target || []), ...(stRes.results?.reach || [])];
    assert(
      stAll.length > 0 && stAll.every((item) => item.selectedCategory === 'ST'),
      `Validation 5: ST strictly uses ST cutoffs (Evaluated: ${stAll.length})`
    );

    // 6. Validation 6: OC uses OC cutoffs
    const ocRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 195.00,
      community: 'OC',
      preferredDepartments: ['CS'],
      academicYear: 2025,
    });
    const ocAll = [...(ocRes.results?.safe || []), ...(ocRes.results?.target || []), ...(ocRes.results?.reach || [])];
    assert(
      ocAll.length > 0 && ocAll.every((item) => item.selectedCategory === 'OC'),
      `Validation 6: OC strictly uses OC cutoffs (Evaluated: ${ocAll.length})`
    );

    // 7. Validation 7: Different categories produce different recommendations for same cutoff score
    const testScore = 175.00;
    const ocFor175 = await postRequest('/api/tnea/cutoffs/predict', { cutoffMark: testScore, community: 'OC', preferredDepartments: ['CS'] });
    const scFor175 = await postRequest('/api/tnea/cutoffs/predict', { cutoffMark: testScore, community: 'SC', preferredDepartments: ['CS'] });
    const ocSafeCount = ocFor175.results?.safe?.length || 0;
    const scSafeCount = scFor175.results?.safe?.length || 0;
    assert(
      scSafeCount > ocSafeCount,
      `Validation 7: Same score (${testScore}) yields vastly different category chances (SC Safe: ${scSafeCount} vs OC Safe: ${ocSafeCount})`
    );

    // 8. Validation 8: Multi-round progression is considered (Best round indicates Round 1 / Round 2 / Round 3)
    const midScoreRes = await postRequest('/api/tnea/cutoffs/predict', {
      cutoffMark: 178.00,
      community: 'BC',
      preferredDepartments: ['CS'],
    });
    const hasRoundProgression = midScoreRes.data?.allRecommendations?.some((r) => r.bestCounsellingRound === 'Round 2' || r.bestCounsellingRound === 'Round 3');
    assert(
      hasRoundProgression,
      `Validation 8: Round progression correctly suggests Round 2/3 for borderline cutoffs`
    );

    // 9. Validation 9: Recommendation results contain expectedCutoffRange, bestCounsellingRound, and historicalCutoffTrend
    const firstRec = midScoreRes.data?.allRecommendations?.[0];
    assert(
      firstRec && firstRec.expectedCutoffRange?.display && firstRec.historicalCutoffTrend && firstRec.recommendationReason,
      `Validation 9: Enriched properties populated (Range: ${firstRec?.expectedCutoffRange?.display}, Trend: ${firstRec?.historicalCutoffTrend})`
    );

    // 10. Validation 10: Recommendations are sorted strictly SAFE -> TARGET -> REACH
    const allRecs = midScoreRes.data?.allRecommendations || [];
    let isSortedProperly = true;
    let seenTarget = false;
    let seenReach = false;
    for (const item of allRecs) {
      if (item.admissionChance === 'TARGET') seenTarget = true;
      if (item.admissionChance === 'REACH') seenReach = true;
      if (item.admissionChance === 'SAFE' && (seenTarget || seenReach)) isSortedProperly = false;
      if (item.admissionChance === 'TARGET' && seenReach) isSortedProperly = false;
    }
    assert(
      isSortedProperly,
      `Validation 10: Recommendation array strictly sorted SAFE (count: ${midScoreRes.summary?.safeCount}) -> TARGET (count: ${midScoreRes.summary?.targetCount}) -> REACH (count: ${midScoreRes.summary?.reachCount})`
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`CATEGORY RECOMMENDATION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runCategoryRecommendationTests();
