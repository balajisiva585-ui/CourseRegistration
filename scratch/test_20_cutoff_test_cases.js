import assert from 'assert';
import http from 'http';

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        });
      })
      .on('error', reject);
  });
}

async function run20TestCases() {
  console.log('========================================================================');
  console.log('🧪 VERIFYING 20 REQUIRED TNEA CUTOFF & PROVENANCE TEST CASES');
  console.log('========================================================================\n');

  const BASE_URL = 'http://localhost:5001/api/tnea';
  let passed = 0;

  function pass(desc) {
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  }

  function fail(desc, err) {
    console.error(`  ❌ [FAIL] ${desc}:`, err.message || err);
    process.exit(1);
  }

  try {
    // 1. Easwari Engineering College (1304) + AD + OC
    const easwariRes = await getJson(`${BASE_URL}/colleges/1304`);
    const cutoffs1304 = easwariRes.data?.cutoffs || [];
    const easwari_AD_OC_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'AD'
    );
    assert(easwari_AD_OC_2025_R1, 'Missing Easwari AD Round 1 record');
    assert.strictEqual(easwari_AD_OC_2025_R1.ocCutoff, 188, 'Easwari AD OC 2025 R1 cutoff mismatch');
    pass(`Test 1: Easwari (1304) + AD + OC = ${easwari_AD_OC_2025_R1.ocCutoff} (Round 1 2025)`);

    // 2. Easwari Engineering College (1304) + AD + BC
    const easwari_AD_BC_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'AD'
    );
    assert.strictEqual(easwari_AD_BC_2025_R1.bcCutoff, 184.5, 'Easwari AD BC 2025 R1 cutoff mismatch');
    pass(`Test 2: Easwari (1304) + AD + BC = ${easwari_AD_BC_2025_R1.bcCutoff} (Round 1 2025)`);

    // 3. Easwari Engineering College (1304) + CS + BC
    const easwari_CS_BC_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'CS'
    );
    assert(easwari_CS_BC_2025_R1, 'Missing Easwari CS Round 1 record');
    assert.strictEqual(easwari_CS_BC_2025_R1.bcCutoff, 185.25, 'Easwari CS BC 2025 R1 cutoff mismatch');
    pass(`Test 3: Easwari (1304) + CS + BC = ${easwari_CS_BC_2025_R1.bcCutoff} (Round 1 2025)`);

    // 4. Easwari Engineering College (1304) + EC + MBC
    const easwari_EC_MBC_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'EC'
    );
    assert(easwari_EC_MBC_2025_R1, 'Missing Easwari EC Round 1 record');
    assert.strictEqual(easwari_EC_MBC_2025_R1.mbcCutoff, 177, 'Easwari EC MBC 2025 R1 cutoff mismatch');
    pass(`Test 4: Easwari (1304) + EC + MBC = ${easwari_EC_MBC_2025_R1.mbcCutoff} (Round 1 2025)`);

    // 5. Easwari Engineering College (1304) + IT (Round 1 unavailable in 2025)
    const easwari_IT_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'IT'
    );
    assert(easwari_IT_2025_R1, 'Missing Easwari IT record');
    assert.strictEqual(easwari_IT_2025_R1.ocCutoff, null, 'Easwari IT OC must be null (Unavailable)');
    assert.strictEqual(easwari_IT_2025_R1.dataStatus, 'UNAVAILABLE', 'Easwari IT must be UNAVAILABLE');
    pass('Test 5: Easwari (1304) + IT 2025 R1 correctly stored as NULL / UNAVAILABLE');

    // 6. Easwari Engineering College (1304) + ME (Round 1 unavailable in 2025)
    const easwari_ME_2025_R1 = cutoffs1304.find(
      (c) => c.academicYear === 2025 && c.counsellingRound === 1 && c.departmentCode === 'ME'
    );
    assert(easwari_ME_2025_R1, 'Missing Easwari ME record');
    assert.strictEqual(easwari_ME_2025_R1.ocCutoff, null, 'Easwari ME OC must be null (Unavailable)');
    pass('Test 6: Easwari (1304) + ME 2025 R1 correctly stored as NULL / UNAVAILABLE');

    // 7. Coimbatore district filtering
    const cbeRes = await getJson(`${BASE_URL}/cutoffs?district=Coimbatore&academicYear=2025&limit=100`);
    assert(cbeRes.success, 'Coimbatore cutoffs query failed');
    assert(cbeRes.data.length > 0, 'No Coimbatore cutoffs returned');
    assert(cbeRes.data.every((c) => c.district.toLowerCase() === 'coimbatore'), 'Non-Coimbatore record returned');
    pass(`Test 7: Coimbatore district filtering verified (${cbeRes.data.length} records returned, 100% Coimbatore)`);

    // 8. Chennai district filtering
    const chnRes = await getJson(`${BASE_URL}/cutoffs?district=Chennai&academicYear=2025&limit=100`);
    assert(chnRes.success, 'Chennai cutoffs query failed');
    assert(chnRes.data.length > 0, 'No Chennai cutoffs returned');
    assert(chnRes.data.every((c) => c.district.toLowerCase() === 'chennai'), 'Non-Chennai record returned');
    pass(`Test 8: Chennai district filtering verified (${chnRes.data.length} records returned, 100% Chennai)`);

    // 9. Round 1
    const r1Res = await getJson(`${BASE_URL}/cutoffs?counsellingRound=1&academicYear=2025&limit=10`);
    assert(r1Res.data.every((c) => c.counsellingRound === 1 || c.round === 'Round 1'), 'Non-Round 1 record found');
    pass('Test 9: Counselling Round 1 filtering verified');

    // 10. Round 2
    const r2Res = await getJson(`${BASE_URL}/cutoffs?counsellingRound=2&academicYear=2025&limit=10`);
    assert(r2Res.data.every((c) => c.counsellingRound === 2 || c.round === 'Round 2'), 'Non-Round 2 record found');
    pass('Test 10: Counselling Round 2 filtering verified');

    // 11. Round 3
    const r3Res = await getJson(`${BASE_URL}/cutoffs?counsellingRound=3&academicYear=2025&limit=10`);
    assert(r3Res.data.every((c) => c.counsellingRound === 3 || c.round === 'Round 3'), 'Non-Round 3 record found');
    pass('Test 11: Counselling Round 3 filtering verified');

    // 12. 2021
    const y2021 = await getJson(`${BASE_URL}/cutoffs?academicYear=2021&limit=5`);
    assert(y2021.pagination.total > 0, 'No 2021 records');
    pass(`Test 12: Academic Year 2021 verified (${y2021.pagination.total} records)`);

    // 13. 2022
    const y2022 = await getJson(`${BASE_URL}/cutoffs?academicYear=2022&limit=5`);
    assert(y2022.pagination.total > 0, 'No 2022 records');
    pass(`Test 13: Academic Year 2022 verified (${y2022.pagination.total} records)`);

    // 14. 2023
    const y2023 = await getJson(`${BASE_URL}/cutoffs?academicYear=2023&limit=5`);
    assert(y2023.pagination.total > 0, 'No 2023 records');
    pass(`Test 14: Academic Year 2023 verified (${y2023.pagination.total} records)`);

    // 15. 2024
    const y2024 = await getJson(`${BASE_URL}/cutoffs?academicYear=2024&limit=5`);
    assert(y2024.pagination.total > 0, 'No 2024 records');
    pass(`Test 15: Academic Year 2024 verified (${y2024.pagination.total} records)`);

    // 16. 2025
    const y2025 = await getJson(`${BASE_URL}/cutoffs?academicYear=2025&limit=5`);
    assert(y2025.pagination.total > 0, 'No 2025 records');
    pass(`Test 16: Academic Year 2025 verified (${y2025.pagination.total} records)`);

    // 17. All seven communities
    const testRecord = easwari_AD_OC_2025_R1;
    const communities = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
    for (const comm of communities) {
      let val = null;
      if (comm === 'OC') val = testRecord.ocCutoff;
      if (comm === 'BC') val = testRecord.bcCutoff;
      if (comm === 'BCM') val = testRecord.bcmCutoff;
      if (comm === 'MBC') val = testRecord.mbcCutoff;
      if (comm === 'SC') val = testRecord.scCutoff;
      if (comm === 'SCA') val = testRecord.scaCutoff;
      if (comm === 'ST') val = testRecord.stCutoff;
      assert(val !== null && !isNaN(val), `Missing value for category ${comm}`);
    }
    pass('Test 17: All 7 communities (OC, BC, BCM, MBC, SC, SCA, ST) isolated and verified on 1304 AD');

    // 18. Missing official records
    const missingSample = cutoffs1304.find((c) => c.academicYear === 2025 && c.departmentCode === 'IT');
    assert.strictEqual(missingSample.ocCutoff, null);
    assert.strictEqual(missingSample.dataStatus, 'UNAVAILABLE');
    pass('Test 18: Missing official records stored strictly as NULL with UNAVAILABLE status');

    // 19. Duplicate logical keys
    const allCutoffsRes = await getJson(`${BASE_URL}/cutoffs?limit=7000`);
    const keyMap = new Map();
    let dups = 0;
    for (const c of allCutoffsRes.data || []) {
      const k = `${c.academicYear}__${c.counsellingRound}__${c.collegeCode}__${c.departmentCode}`;
      if (keyMap.has(k)) dups++;
      else keyMap.set(k, true);
    }
    assert.strictEqual(dups, 0, `Found ${dups} duplicate logical keys in database`);
    pass('Test 19: Logical key uniqueness verified (0 duplicate keys)');

    // 20. AI Assistant cutoff lookup
    const chatRes = await postJson(`${BASE_URL}/chat`, {
      message: 'Easwari Engineering College AD BC cutoff',
    });
    assert(chatRes.success, 'AI Chat failed');
    assert(chatRes.reply.includes('184.50') || chatRes.reply.includes('184.5'), 'AI Chat did not return 184.50 for Easwari AD BC');
    assert(chatRes.cards?.[0]?.verificationStatus, 'AI Chat card missing verificationStatus');
    pass(`Test 20: AI Assistant cutoff lookup verified (Returned 184.50 for Easwari AD BC with verificationStatus)`);

    console.log('\n========================================================================');
    console.log(`20 TEST CASES SUMMARY: ${passed} passed, 0 failed`);
    console.log('========================================================================\n');
  } catch (err) {
    fail('Test suite execution failed', err);
  }
}

run20TestCases();
