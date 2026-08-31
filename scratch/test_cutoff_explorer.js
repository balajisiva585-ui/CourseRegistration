import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedTneaData } from '../server/seed/tneaSeedData.js';
import TneaCollege from '../server/models/TneaCollege.js';
import TneaCutoff from '../server/models/TneaCutoff.js';
import TneaSeatMatrix from '../server/models/TneaSeatMatrix.js';
import TneaDepartment from '../server/models/TneaDepartment.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDB } from '../server/config/db.js';

async function runTests() {
  console.log('Connecting to database via connectDB...');
  await connectDB();
  console.log('Connected successfully.');

  console.log('\n--- 1. Executing Full Master Dataset Seed ---');
  await seedTneaData();

  const collegeCount = await TneaCollege.countDocuments();
  const cutoffCount = await TneaCutoff.countDocuments();
  const seatCount = await TneaSeatMatrix.countDocuments();
  const deptCount = await TneaDepartment.countDocuments();

  console.log(`\nSeed Stats:`);
  console.log(`- Colleges: ${collegeCount}`);
  console.log(`- Cutoffs: ${cutoffCount}`);
  console.log(`- Seat Matrices: ${seatCount}`);
  console.log(`- Departments: ${deptCount}`);

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

  console.log('\n--- 2. Testing Cutoff Query Logic & Filters ---');

  // Test 1: Empty filters (Year 2025, Round 1) -> Multiple colleges returned, not 1
  const test1Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1' }).limit(50);
  const distinctCollegesT1 = new Set(test1Records.map(r => r.collegeCode));
  assert(distinctCollegesT1.size > 5, 'Empty filter returns multiple colleges across TN', `Got ${distinctCollegesT1.size} colleges in 50 records`);
  assert(test1Records.length > 20, 'Returns substantial cutoff dataset for 2025 Round 1', `Got ${test1Records.length} records`);

  // Test 2: Min Cutoff = 180 on OC
  const test2Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', ocCutoff: { $gte: 180 } });
  const allGte180 = test2Records.every(r => r.ocCutoff >= 180);
  const distinctCollegesT2 = new Set(test2Records.map(r => r.collegeCode));
  assert(allGte180 && test2Records.length > 0, 'Min Cutoff 180: All returned records have ocCutoff >= 180', `Count: ${test2Records.length}, all >= 180: ${allGte180}`);
  assert(distinctCollegesT2.size > 3, 'Min Cutoff 180: Returns multiple matching colleges across TN', `Got ${distinctCollegesT2.size} colleges`);

  // Test 3: Min Cutoff = 150 on OC (Superset of 180)
  const test3Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', ocCutoff: { $gte: 150 } });
  const allGte150 = test3Records.every(r => r.ocCutoff >= 150);
  assert(test3Records.length >= test2Records.length && allGte150, 'Min Cutoff 150: Returns superset of Min Cutoff 180', `150 count: ${test3Records.length}, 180 count: ${test2Records.length}`);

  // Test 4: District = Coimbatore
  const test4Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', district: /^Coimbatore$/i });
  const allCbe = test4Records.every(r => r.district.toLowerCase() === 'coimbatore');
  const distinctCbe = new Set(test4Records.map(r => r.collegeCode));
  assert(allCbe && test4Records.length > 0, 'District = Coimbatore: All records strictly in Coimbatore', `Count: ${test4Records.length}`);
  assert(distinctCbe.size >= 4, 'District = Coimbatore: Multiple distinct Coimbatore colleges returned', `Got ${distinctCbe.size} colleges (${[...distinctCbe].join(', ')})`);

  // Test 5: District = Chennai
  const test5Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', district: /^Chennai$/i });
  const allChn = test5Records.every(r => r.district.toLowerCase() === 'chennai');
  assert(allChn && test5Records.length > 0, 'District = Chennai: All records strictly in Chennai', `Count: ${test5Records.length}`);

  // Test 6: Search = 'PSG'
  const psgRegex = /psg/i;
  const test6Records = await TneaCutoff.find({
    academicYear: 2025,
    round: 'Round 1',
    $or: [{ collegeName: psgRegex }, { collegeCode: psgRegex }, { district: psgRegex }]
  });
  const psgCodes = new Set(test6Records.map(r => r.collegeCode));
  assert(psgCodes.has('2006') || psgCodes.has('2025'), "Search 'PSG' matches PSG Tech (2006) / PSG iTech (2025)", `Matched codes: ${[...psgCodes].join(', ')}`);

  // Test 7: Search by code '0001'
  const code1Regex = /0001/i;
  const test7Records = await TneaCutoff.find({
    academicYear: 2025,
    round: 'Round 1',
    $or: [{ collegeName: code1Regex }, { collegeCode: code1Regex }, { district: code1Regex }]
  });
  assert(test7Records.length > 0 && test7Records[0].collegeCode === '0001', "Search by 4-digit code '0001' matches CEG Anna University", `Found ${test7Records.length} records`);

  // Test 8: Search by code '2711' (Kongu)
  const code2711Regex = /2711/i;
  const test8Records = await TneaCutoff.find({
    academicYear: 2025,
    round: 'Round 1',
    $or: [{ collegeName: code2711Regex }, { collegeCode: code2711Regex }, { district: code2711Regex }]
  });
  assert(test8Records.length > 0 && test8Records[0].collegeCode === '2711', "Search by code '2711' matches Kongu Engineering College", `Found ${test8Records.length} records`);

  // Test 9: Department = 'CS'
  const test9Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', departmentCode: 'CS' });
  const allCS = test9Records.every(r => r.departmentCode === 'CS');
  const distinctCsColleges = new Set(test9Records.map(r => r.collegeCode));
  assert(allCS && distinctCsColleges.size > 10, 'Department = CS returns CS records across 10+ colleges', `Count: ${test9Records.length}, colleges: ${distinctCsColleges.size}`);

  // Test 10: Multi-Round Support (Round 1, Round 2, Round 3)
  const r1Count = await TneaCutoff.countDocuments({ academicYear: 2025, round: 'Round 1' });
  const r2Count = await TneaCutoff.countDocuments({ academicYear: 2025, round: 'Round 2' });
  const r3Count = await TneaCutoff.countDocuments({ academicYear: 2025, round: 'Round 3' });
  assert(r1Count > 50 && r2Count > 50 && r3Count > 50, 'Multi-Round Support: Round 1, Round 2, Round 3 all populated', `R1: ${r1Count}, R2: ${r2Count}, R3: ${r3Count}`);

  // Test 11: Multi-Year Support (2021 to 2026)
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  let allYearsPopulated = true;
  for (const y of years) {
    const count = await TneaCutoff.countDocuments({ academicYear: y });
    if (count === 0) allYearsPopulated = false;
  }
  assert(allYearsPopulated, 'Multi-Year Support: 2021 to 2026 all populated', `Years 2021-2026 verified`);

  // Test 12: Community-specific Cutoff Filter (BC Cutoff >= 180)
  const test12Records = await TneaCutoff.find({ academicYear: 2025, round: 'Round 1', bcCutoff: { $gte: 180 } });
  const allBcGte180 = test12Records.every(r => r.bcCutoff >= 180);
  assert(allBcGte180 && test12Records.length > 0, 'Community Filter: BC Cutoff >= 180 filtered accurately', `Count: ${test12Records.length}`);

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test Execution Failed:', err);
  process.exit(1);
});
