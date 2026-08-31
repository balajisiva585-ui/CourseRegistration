import assert from 'node:assert';
import { getCutoffValue } from '../client/src/services/tneaService.js';

async function runRegressionTests() {
  console.log('========================================================================');
  console.log('🔬 RUNNING CUTOFF EXPLORER REGRESSION TESTS');
  console.log('========================================================================\n');

  // Test 1: getCutoffValue helper unit tests
  console.log('--- 1. Testing getCutoffValue Helper Logic ---');

  // Direct fields
  const directRecord = {
    ocCutoff: 200,
    bcCutoff: 199,
    bcmCutoff: 198.5,
    mbcCutoff: 198,
    mbcDncCutoff: 198,
    scCutoff: 192.5,
    scaCutoff: 189,
    stCutoff: 184.5,
  };

  assert.strictEqual(getCutoffValue(directRecord, 'OC'), 200, 'OC direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'BC'), 199, 'BC direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'BCM'), 198.5, 'BCM direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'MBC'), 198, 'MBC direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'MBC/DNC'), 198, 'MBC/DNC direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'SC'), 192.5, 'SC direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'SCA'), 189, 'SCA direct field failed');
  assert.strictEqual(getCutoffValue(directRecord, 'ST'), 184.5, 'ST direct field failed');
  console.log('  ✅ [PASS] Direct fields extraction verified (OC, BC, BCM, MBC, SC, SCA, ST)');

  // Nested cutoff object
  const nestedRecord = {
    cutoff: {
      OC: { mark: 199.5 },
      BC: { mark: 198.5 },
      BCM: { mark: 197.5 },
      MBC_DNC: { mark: 196.5 },
      SC: { mark: 189.5 },
      SCA: { mark: 185 },
      ST: { mark: 180.5 },
    },
  };

  assert.strictEqual(getCutoffValue(nestedRecord, 'OC'), 199.5, 'OC nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'BC'), 198.5, 'BC nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'BCM'), 197.5, 'BCM nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'MBC'), 196.5, 'MBC nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'MBC/DNC'), 196.5, 'MBC/DNC nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'SC'), 189.5, 'SC nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'SCA'), 185, 'SCA nested failed');
  assert.strictEqual(getCutoffValue(nestedRecord, 'ST'), 180.5, 'ST nested failed');
  console.log('  ✅ [PASS] Nested cutoff object extraction verified (cutoff.<COMMUNITY>.mark)');

  // Round 2 record where OC is null but BC/MBC/SC are valid
  const round2Record = {
    academicYear: 2024,
    round: 'Round 2',
    collegeCode: '1304',
    departmentCode: 'AD',
    ocCutoff: null,
    bcCutoff: 180.0,
    mbcCutoff: 175.5,
    scCutoff: 150.0,
    cutoff: {
      OC: { mark: null },
      BC: { mark: 180.0 },
      MBC_DNC: { mark: 175.5 },
      SC: { mark: 150.0 },
    },
  };

  assert.strictEqual(getCutoffValue(round2Record, 'OC'), null, 'OC should be null');
  assert.strictEqual(getCutoffValue(round2Record, 'BC'), 180.0, 'BC should be 180.0');
  assert.strictEqual(getCutoffValue(round2Record, 'MBC'), 175.5, 'MBC should be 175.5');
  assert.strictEqual(getCutoffValue(round2Record, 'SC'), 150.0, 'SC should be 150.0');
  console.log('  ✅ [PASS] Round 2 record with OC=null and BC=180.0 correctly isolates individual communities');

  // Test 2: Live API Query Verification
  console.log('\n--- 2. Testing Live API Responses & Frontend Mappings ---');

  const BASE_URL = 'http://localhost:5001/api/tnea';

  // 1. 2024 Round 1 CEG AD
  const cegRes = await fetch(`${BASE_URL}/cutoffs?academicYear=2024&counsellingRound=1&collegeCode=0001&departmentCode=AD`);
  const cegJson = await cegRes.json();
  assert.ok(cegJson.success, 'CEG 2024 AD query should succeed');
  assert.ok(cegJson.data.length > 0, 'CEG 2024 AD record should exist');
  const cegRecord = cegJson.data[0];
  const cegOC = getCutoffValue(cegRecord, 'OC');
  const cegBC = getCutoffValue(cegRecord, 'BC');
  assert.strictEqual(cegOC, 200, '2024 Round 1 CEG AD OC cutoff must be 200');
  assert.strictEqual(cegBC, 199, '2024 Round 1 CEG AD BC cutoff must be 199');
  console.log(`  ✅ [PASS] 2024 Round 1 CEG AD: OC=${cegOC}, BC=${cegBC}`);

  // 2. 2024 Round 1 PSG CS
  const psgRes = await fetch(`${BASE_URL}/cutoffs?academicYear=2024&counsellingRound=1&collegeCode=2006&departmentCode=CS`);
  const psgJson = await psgRes.json();
  assert.ok(psgJson.success, 'PSG 2024 CS query should succeed');
  assert.ok(psgJson.data.length > 0, 'PSG 2024 CS record should exist');
  const psgRecord = psgJson.data[0];
  const psgOC = getCutoffValue(psgRecord, 'OC');
  const psgBC = getCutoffValue(psgRecord, 'BC');
  assert.strictEqual(psgOC, 199.5, '2024 Round 1 PSG CS OC cutoff must be 199.5');
  assert.strictEqual(psgBC, 198.5, '2024 Round 1 PSG CS BC cutoff must be 198.5');
  console.log(`  ✅ [PASS] 2024 Round 1 PSG CS: OC=${psgOC}, BC=${psgBC}`);

  // 3. Changing year from 2024 to 2023 changes the displayed records
  const res2024 = await fetch(`${BASE_URL}/cutoffs?academicYear=2024&counsellingRound=1&limit=5`);
  const json2024 = await res2024.json();
  const res2023 = await fetch(`${BASE_URL}/cutoffs?academicYear=2023&counsellingRound=1&limit=5`);
  const json2023 = await res2023.json();

  assert.ok(json2024.data.length > 0, '2024 cutoffs returned');
  assert.ok(json2023.data.length > 0, '2023 cutoffs returned');
  assert.strictEqual(json2024.data[0].academicYear, 2024, 'First record of 2024 query must have academicYear=2024');
  assert.strictEqual(json2023.data[0].academicYear, 2023, 'First record of 2023 query must have academicYear=2023');
  assert.notStrictEqual(json2024.data[0]._id, json2023.data[0]._id, 'Year 2024 and 2023 must return distinct records');
  console.log(`  ✅ [PASS] Year filter isolation verified: 2024 (${json2024.data.length} items) != 2023 (${json2023.data.length} items)`);

  // 4. Changing Round 1 to Round 2 changes the displayed records
  const resR1 = await fetch(`${BASE_URL}/cutoffs?academicYear=2024&counsellingRound=1&limit=5`);
  const jsonR1 = await resR1.json();
  const resR2 = await fetch(`${BASE_URL}/cutoffs?academicYear=2024&counsellingRound=2&limit=5`);
  const jsonR2 = await resR2.json();

  assert.ok(jsonR1.data.length > 0, 'Round 1 cutoffs returned');
  assert.ok(jsonR2.data.length > 0, 'Round 2 cutoffs returned');
  assert.strictEqual(jsonR1.data[0].counsellingRound, 1, 'Round 1 record counsellingRound must be 1');
  assert.strictEqual(jsonR2.data[0].counsellingRound, 2, 'Round 2 record counsellingRound must be 2');
  assert.notStrictEqual(jsonR1.data[0]._id, jsonR2.data[0]._id, 'Round 1 and Round 2 must return distinct records');
  console.log(`  ✅ [PASS] Round filter isolation verified: Round 1 (${jsonR1.data.length} items) != Round 2 (${jsonR2.data.length} items)`);

  // 5. Round 2 Easwari AD BC cutoff check
  const easwariR2Res = await fetch(`${BASE_URL}/cutoffs?academicYear=2025&counsellingRound=2&collegeCode=1304&departmentCode=AD`);
  const easwariR2Json = await easwariR2Res.json();
  assert.ok(easwariR2Json.data.length > 0, 'Easwari AD Round 2 record found');
  const easwariR2Rec = easwariR2Json.data[0];
  const easwariR2BC = getCutoffValue(easwariR2Rec, 'BC');
  assert.strictEqual(easwariR2BC, 180, 'Easwari AD Round 2 BC cutoff must be 180');
  console.log(`  ✅ [PASS] Round 2 Easwari AD BC cutoff verified = ${easwariR2BC}`);

  console.log('\n========================================================================');
  console.log('✅ ALL CUTOFF EXPLORER REGRESSION TESTS PASSED (0 FAILURES)');
  console.log('========================================================================\n');
}

runRegressionTests().catch((err) => {
  console.error('❌ REGRESSION TEST FAILED:', err);
  process.exit(1);
});
