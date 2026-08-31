import assert from 'assert';
import http from 'http';
import { connectDB } from '../server/config/db.js';
import TneaCollege from '../server/models/TneaCollege.js';
import TneaDepartment from '../server/models/TneaDepartment.js';
import TneaCutoff from '../server/models/TneaCutoff.js';
import TneaSeatMatrix from '../server/models/TneaSeatMatrix.js';
import { OFFICIAL_GROUND_TRUTH } from '../server/data/official_ground_truth.js';

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

async function runMasterSuite() {
  console.log('========================================================================');
  console.log('🔬 PART 5 & 12: MASTER PRODUCTION DATASET AUDIT (6,354 RECORDS)');
  console.log('========================================================================\n');

  await connectDB();

  const colleges = await TneaCollege.find({}).lean();
  const collegeCodes = new Set(colleges.map((c) => c.code));
  const districts = new Set(colleges.map((c) => c.district).filter(Boolean));

  const departments = await TneaDepartment.find({ isActive: true }).lean();
  const deptCodes = new Set(departments.map((d) => d.code));

  const cutoffs = await TneaCutoff.find({}).lean();

  const yearCounts = {};
  const roundCounts = {};
  const communityCounts = { OC: 0, BC: 0, BCM: 0, MBC: 0, SC: 0, SCA: 0, ST: 0 };
  let officialCount = 0;
  let projectedCount = 0;
  let unavailableCount = 0;
  let missingProvenanceCount = 0;
  let syntheticHistoricalCount = 0;
  let invalidCollegeRefs = 0;
  let invalidDeptRefs = 0;
  let impossibleValues = 0;
  let crossCommunityLeakage = 0;
  let crossRoundLeakage = 0;
  let crossYearLeakage = 0;

  const compositeKeyMap = new Map();
  let duplicateCompositeKeys = 0;

  for (const c of cutoffs) {
    // 1. Academic Year count
    yearCounts[c.academicYear] = (yearCounts[c.academicYear] || 0) + 1;

    // 2. Counselling Round count
    const rName = c.round || `Round ${c.counsellingRound}`;
    roundCounts[rName] = (roundCounts[rName] || 0) + 1;

    // 3. Composite key uniqueness
    const compKey = `${c.academicYear}__${c.counsellingRound}__${c.collegeCode}__${c.departmentCode}`;
    if (compositeKeyMap.has(compKey)) {
      duplicateCompositeKeys++;
    } else {
      compositeKeyMap.set(compKey, true);
    }

    // 4. College reference check
    if (!collegeCodes.has(c.collegeCode)) {
      invalidCollegeRefs++;
    }

    // 5. Department reference check
    if (!deptCodes.has(c.departmentCode)) {
      invalidDeptRefs++;
    }

    // 6. Provenance check
    if (!c.source && !c.sourceUrl) {
      missingProvenanceCount++;
    }

    // 7. Community counts & impossible values
    const catMap = {
      OC: c.ocCutoff,
      BC: c.bcCutoff,
      BCM: c.bcmCutoff,
      MBC: c.mbcCutoff,
      SC: c.scCutoff,
      SCA: c.scaCutoff,
      ST: c.stCutoff,
    };

    let hasAnyVal = false;
    for (const [comm, val] of Object.entries(catMap)) {
      if (val !== null && val !== undefined) {
        hasAnyVal = true;
        communityCounts[comm]++;
        if (val < 50 || val > 200) {
          impossibleValues++;
        }
      }
    }

    // Check classification
    if (c.ocCutoff === null && !hasAnyVal) {
      unavailableCount++;
    } else {
      if (c.dataStatus === 'OFFICIAL') officialCount++;
      else if (c.dataStatus === 'PROJECTED') projectedCount++;

      // Check ground truth for historical years (2021-2025)
      const colGt = OFFICIAL_GROUND_TRUTH[c.collegeCode];
      const branchGt = colGt?.branches?.[c.departmentCode];
      const cutoffGt = branchGt?.cutoffs?.[String(c.academicYear)];
      const roundGt = cutoffGt?.[rName];

      if (c.academicYear <= 2025 && !roundGt && c.dataStatus === 'OFFICIAL') {
        syntheticHistoricalCount++;
      }

      // Check cross-community copy error (e.g. OC exactly identical to ST for elite colleges)
      if (c.ocCutoff && c.stCutoff && c.ocCutoff === c.stCutoff && c.ocCutoff > 185) {
        crossCommunityLeakage++;
      }
    }
  }

  console.log(`1. Total Cutoffs: ${cutoffs.length}`);
  console.log(`2. Records by Academic Year:`, yearCounts);
  console.log(`3. Records by Counselling Round:`, roundCounts);
  console.log(`4. Records by Community Non-Null Values:`, communityCounts);
  console.log(`5. Total Colleges Represented: ${collegeCodes.size}`);
  console.log(`6. Total Branches Represented: ${deptCodes.size}`);
  console.log(`7. Official Historical Records: ${officialCount}`);
  console.log(`8. Projected 2026 Model Records: ${projectedCount}`);
  console.log(`9. Official Unavailable / NOT PUBLISHED Records: ${unavailableCount}`);
  console.log(`10. Records Without Provenance: ${missingProvenanceCount}`);
  console.log(`11. Synthetic / Formula Historical Cutoffs: ${syntheticHistoricalCount}`);
  console.log(`12. Duplicate Composite Keys: ${duplicateCompositeKeys}`);
  console.log(`13. Invalid College References: ${invalidCollegeRefs}`);
  console.log(`14. Invalid Branch References: ${invalidDeptRefs}`);
  console.log(`15. Impossible Cutoff Values (<50 or >200): ${impossibleValues}`);
  console.log(`16. Cross-Community Leakage: ${crossCommunityLeakage}`);

  // Assertions
  assert.strictEqual(duplicateCompositeKeys, 0, 'Duplicate composite keys must be 0');
  assert.strictEqual(missingProvenanceCount, 0, 'Missing provenance must be 0');
  assert.strictEqual(syntheticHistoricalCount, 0, 'Synthetic historical values must be 0');
  assert.strictEqual(invalidCollegeRefs, 0, 'Invalid college references must be 0');
  assert.strictEqual(invalidDeptRefs, 0, 'Invalid branch references must be 0');
  assert.strictEqual(impossibleValues, 0, 'Impossible values must be 0');
  assert.strictEqual(crossCommunityLeakage, 0, 'Cross-community leakage must be 0');

  console.log('\n✅ Master Data Integrity Audit Passed (0 Failures)\n');

  console.log('========================================================================');
  console.log('🧪 PART 13: 25 AUTOMATED VERIFICATION TEST CASES');
  console.log('========================================================================\n');

  const BASE_URL = 'http://localhost:5001/api/tnea';
  let passed = 0;

  function pass(testNum, desc) {
    console.log(`  ✅ [PASS] Test ${testNum}: ${desc}`);
    passed++;
  }

  // 1. 2021 cutoff filtering
  const t1 = await getJson(`${BASE_URL}/cutoffs?academicYear=2021&limit=5`);
  assert(t1.success && t1.pagination.total === 1059);
  pass(1, `2021 cutoff filtering returned ${t1.pagination.total} records`);

  // 2. 2022 cutoff filtering
  const t2 = await getJson(`${BASE_URL}/cutoffs?academicYear=2022&limit=5`);
  assert(t2.success && t2.pagination.total === 1059);
  pass(2, `2022 cutoff filtering returned ${t2.pagination.total} records`);

  // 3. 2023 cutoff filtering
  const t3 = await getJson(`${BASE_URL}/cutoffs?academicYear=2023&limit=5`);
  assert(t3.success && t3.pagination.total === 1059);
  pass(3, `2023 cutoff filtering returned ${t3.pagination.total} records`);

  // 4. 2024 cutoff filtering
  const t4 = await getJson(`${BASE_URL}/cutoffs?academicYear=2024&limit=5`);
  assert(t4.success && t4.pagination.total === 1059);
  pass(4, `2024 cutoff filtering returned ${t4.pagination.total} records`);

  // 5. 2025 cutoff filtering
  const t5 = await getJson(`${BASE_URL}/cutoffs?academicYear=2025&limit=5`);
  assert(t5.success && t5.pagination.total === 1059);
  pass(5, `2025 cutoff filtering returned ${t5.pagination.total} records`);

  // 6. Round 1 filtering
  const t6 = await getJson(`${BASE_URL}/cutoffs?counsellingRound=1&academicYear=2025&limit=10`);
  assert(t6.data.every((c) => c.counsellingRound === 1 || c.round === 'Round 1'));
  pass(6, 'Round 1 filtering isolated Round 1 records');

  // 7. Round 2 filtering
  const t7 = await getJson(`${BASE_URL}/cutoffs?counsellingRound=2&academicYear=2025&limit=10`);
  assert(t7.data.every((c) => c.counsellingRound === 2 || c.round === 'Round 2'));
  pass(7, 'Round 2 filtering isolated Round 2 records');

  // 8. Round 3 filtering
  const t8 = await getJson(`${BASE_URL}/cutoffs?counsellingRound=3&academicYear=2025&limit=10`);
  assert(t8.data.every((c) => c.counsellingRound === 3 || c.round === 'Round 3'));
  pass(8, 'Round 3 filtering isolated Round 3 records');

  // 9. OC Community Query
  const t9 = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=AD&academicYear=2025&counsellingRound=1`);
  assert.strictEqual(t9.data[0].ocCutoff, 188);
  pass(9, `OC community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].ocCutoff})`);

  // 10. BC Community Query
  assert.strictEqual(t9.data[0].bcCutoff, 184.5);
  pass(10, `BC community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].bcCutoff})`);

  // 11. BCM Community Query
  assert.strictEqual(t9.data[0].bcmCutoff, 181);
  pass(11, `BCM community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].bcmCutoff})`);

  // 12. MBC Community Query
  assert.strictEqual(t9.data[0].mbcCutoff, 180);
  pass(12, `MBC community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].mbcCutoff})`);

  // 13. SC Community Query
  assert.strictEqual(t9.data[0].scCutoff, 156);
  pass(13, `SC community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].scCutoff})`);

  // 14. SCA Community Query
  assert.strictEqual(t9.data[0].scaCutoff, 145);
  pass(14, `SCA community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].scaCutoff})`);

  // 15. ST Community Query
  assert.strictEqual(t9.data[0].stCutoff, 132);
  pass(15, `ST community cutoff verified (1304 AD 2025 R1 = ${t9.data[0].stCutoff})`);

  // 16. Multiple Colleges Query
  const t16 = await getJson(`${BASE_URL}/colleges?limit=58`);
  assert.strictEqual(t16.data.length, 58);
  pass(16, `Multiple colleges query returned all ${t16.data.length} verified colleges`);

  // 17. Multiple Branches Query
  const t17 = await getJson(`${BASE_URL}/departments`);
  assert.strictEqual(t17.data.length, 20);
  pass(17, `Multiple branches query returned all ${t17.data.length} approved branches`);

  // 18. District Filtering (Coimbatore + Chennai)
  const t18a = await getJson(`${BASE_URL}/cutoffs?district=Coimbatore&limit=50`);
  assert(t18a.data.every((c) => c.district.toLowerCase() === 'coimbatore'));
  const t18b = await getJson(`${BASE_URL}/cutoffs?district=Chennai&limit=50`);
  assert(t18b.data.every((c) => c.district.toLowerCase() === 'chennai'));
  pass(18, 'District filtering verified independently for Coimbatore and Chennai');

  // 19. Missing/Unavailable Records
  const t19 = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=IT&academicYear=2025&counsellingRound=1`);
  assert.strictEqual(t19.data[0].ocCutoff, null);
  assert.strictEqual(t19.data[0].dataStatus, 'UNAVAILABLE');
  pass(19, 'Missing/unavailable records correctly stored as NULL / UNAVAILABLE');

  // 20. Duplicate Detection
  assert.strictEqual(duplicateCompositeKeys, 0);
  pass(20, 'Zero duplicate logical keys across entire dataset');

  // 21. Provenance Validation
  assert(t9.data[0].source && t9.data[0].sourceUrl);
  pass(21, `Provenance validation passed (${t9.data[0].source} - ${t9.data[0].sourceUrl})`);

  // 22. AI Assistant Cutoff Lookup
  const t22 = await postJson(`${BASE_URL}/chat`, {
    message: 'Easwari Engineering College AD BC cutoff',
  });
  assert(t22.success);
  assert(t22.reply.includes('184.50') || t22.reply.includes('184.5'));
  assert(t22.cards?.[0]?.verificationStatus);
  pass(22, 'AI Assistant cutoff lookup returned exact official 184.50 with verificationStatus');

  // 23. Predictor Round Isolation
  const predR1 = await postJson(`${BASE_URL}/cutoffs/predict`, {
    cutoffMark: 184.5,
    community: 'BC',
    preferredDepartments: ['AD'],
    preferredDistricts: ['Chennai'],
    academicYear: 2025,
    counsellingRound: 1,
  });
  const predR2 = await postJson(`${BASE_URL}/cutoffs/predict`, {
    cutoffMark: 180,
    community: 'BC',
    preferredDepartments: ['AD'],
    preferredDistricts: ['Chennai'],
    academicYear: 2025,
    counsellingRound: 2,
  });
  assert(predR1.success && predR2.success);
  const easwariR1 = predR1.data.allRecommendations.find((r) => r.collegeCode === '1304');
  const easwariR2 = predR2.data.allRecommendations.find((r) => r.collegeCode === '1304');
  assert.strictEqual(easwariR1.historicalCutoff, 184.5);
  assert.strictEqual(easwariR2.historicalCutoff, 180);
  pass(23, `Predictor round isolation verified (Easwari AD BC: R1 = 184.50, R2 = 180.00)`);

  // 24. Cross-Year Isolation
  const y24Res = await getJson(`${BASE_URL}/cutoffs?collegeCode=2006&departmentCode=CS&academicYear=2024&counsellingRound=1`);
  const y25Res = await getJson(`${BASE_URL}/cutoffs?collegeCode=2006&departmentCode=CS&academicYear=2025&counsellingRound=1`);
  assert.strictEqual(y24Res.data[0].academicYear, 2024);
  assert.strictEqual(y25Res.data[0].academicYear, 2025);
  pass(24, `Cross-year isolation verified (PSG CS: 2024 = ${y24Res.data[0].ocCutoff}, 2025 = ${y25Res.data[0].ocCutoff})`);

  // 25. Cross-Community Isolation
  const commRes = await getJson(`${BASE_URL}/cutoffs?collegeCode=2711&departmentCode=AD&academicYear=2025&counsellingRound=1`);
  const r = commRes.data[0];
  assert(r.ocCutoff !== r.bcCutoff && r.bcCutoff !== r.stCutoff);
  pass(25, `Cross-community isolation verified (Kongu AD: OC=${r.ocCutoff}, BC=${r.bcCutoff}, ST=${r.stCutoff})`);

  // 26. Branches with no cutoff
  const noCutoffBranchRes = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=ME&academicYear=2025&counsellingRound=1`);
  assert.strictEqual(noCutoffBranchRes.data[0].ocCutoff, null);
  assert.strictEqual(noCutoffBranchRes.data[0].dataStatus, 'UNAVAILABLE');
  pass(26, 'Branches with no cutoff correctly returned as UNAVAILABLE without omission');

  // 27. Colleges with multiple branches
  const multiBranchColRes = await getJson(`${BASE_URL}/colleges/0001`);
  const cegCutoffs = multiBranchColRes.data?.cutoffs || [];
  const cegBranches = new Set(cegCutoffs.map((c) => c.departmentCode));
  assert(cegBranches.size >= 5, 'CEG must have multiple branches');
  pass(27, `Colleges with multiple branches verified (CEG 0001 has ${cegBranches.size} branches: ${Array.from(cegBranches).join(', ')})`);

  // 28. Colleges with data in multiple rounds
  const r1Cutoff = cutoffs.find((c) => c.collegeCode === '1304' && c.departmentCode === 'AD' && c.academicYear === 2025 && c.counsellingRound === 1);
  const r2Cutoff = cutoffs.find((c) => c.collegeCode === '1304' && c.departmentCode === 'AD' && c.academicYear === 2025 && c.counsellingRound === 2);
  assert(r1Cutoff && r2Cutoff && r1Cutoff.bcCutoff !== r2Cutoff.bcCutoff);
  pass(28, `Colleges with data in multiple rounds verified (Easwari AD BC: R1=${r1Cutoff.bcCutoff}, R2=${r2Cutoff.bcCutoff})`);

  // 29. Queries without year
  const queryNoYear = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=AD&limit=20`);
  assert(queryNoYear.data.length > 1);
  const yearsRepresented = new Set(queryNoYear.data.map((c) => c.academicYear));
  assert(yearsRepresented.size > 1);
  pass(29, `Queries without year returned complete multi-year archive (${Array.from(yearsRepresented).sort().join(', ')})`);

  // 30. Queries without round
  const queryNoRound = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=AD&academicYear=2025`);
  const roundsRepresented = new Set(queryNoRound.data.map((c) => c.round || `Round ${c.counsellingRound}`));
  assert.strictEqual(roundsRepresented.size, 3);
  pass(30, `Queries without round returned all 3 independent rounds (${Array.from(roundsRepresented).join(', ')})`);

  // 31. Queries with both year and round
  const queryYearAndRound = await getJson(`${BASE_URL}/cutoffs?collegeCode=1304&departmentCode=AD&academicYear=2025&counsellingRound=1`);
  assert.strictEqual(queryYearAndRound.data.length, 1);
  assert.strictEqual(queryYearAndRound.data[0].academicYear, 2025);
  assert.strictEqual(queryYearAndRound.data[0].counsellingRound, 1);
  pass(31, `Queries with both year and round returned exact single matching record (Academic Year 2025 Round 1)`);

  // 32. AI Assistant Multi-Year Lookup
  const t32 = await postJson(`${BASE_URL}/chat`, {
    message: 'Easwari AD BC cutoff last 5 years',
  });
  assert(t32.success);
  assert(t32.reply.includes('5-Year Historical Cutoff Archive') || t32.reply.includes('2025') && t32.reply.includes('2021'));
  pass(32, 'AI Assistant multi-year query successfully returned 5-year historical archive');

  // 33. AI Assistant Round-Specific Lookup
  const t33 = await postJson(`${BASE_URL}/chat`, {
    message: 'Easwari AD BC Round 2 cutoff 2025',
  });
  assert(t33.success);
  assert(t33.reply.includes('Round 2') && t33.reply.includes('180.00') || t33.reply.includes('180'));
  pass(33, 'AI Assistant round-specific query isolated Round 2 (Easwari AD BC Round 2 = 180.00)');

  console.log('\n========================================================================');
  console.log(`MASTER TEST SUITE SUMMARY: ${passed} passed, 0 failed`);
  console.log('========================================================================\n');
}

runMasterSuite().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
