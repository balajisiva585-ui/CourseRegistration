import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaCollege from '../models/TneaCollege.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import { OFFICIAL_GROUND_TRUTH } from '../data/official_ground_truth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runComprehensiveAudit() {
  console.log('========================================================================');
  console.log('🔬 TNEA MASTER PRODUCTION DATASET & VERIFICATION AUDIT');
  console.log('========================================================================\n');

  // Connect to database
  await connectDB();

  // 1. Colleges Audit
  const colleges = await TneaCollege.find({}).lean();
  const collegeCodes = new Set(colleges.map((c) => c.code));
  const districts = new Set(colleges.map((c) => c.district).filter(Boolean));

  console.log(`1. COLLEGES & DISTRICTS:`);
  console.log(`   - Total Verified Colleges in DB: ${colleges.length}`);
  console.log(`   - Total Unique Districts in DB: ${districts.size}`);
  console.log(`   - Districts: ${Array.from(districts).sort().join(', ')}`);

  // 2. Branches Audit
  const departments = await TneaDepartment.find({ isActive: true }).lean();
  const deptCodes = new Set(departments.map((d) => d.code));
  console.log(`\n2. BRANCHES / DEPARTMENTS:`);
  console.log(`   - Total Approved Branches in DB: ${departments.length}`);
  console.log(`   - Branch Codes: ${Array.from(deptCodes).sort().join(', ')}`);

  // 3. Cutoffs Audit
  const cutoffs = await TneaCutoff.find({}).lean();
  console.log(`\n3. CUTOFF RECORDS:`);
  console.log(`   - Total Cutoff Records in DB: ${cutoffs.length}`);

  let officialCutoffs = 0;
  let projectedCutoffs = 0;
  let unavailableCutoffs = 0;
  let syntheticCutoffs = 0;
  let invalidCollegeRefs = 0;
  let invalidDeptRefs = 0;

  const compositeKeyMap = new Map();
  let duplicateCompositeKeys = 0;

  for (const c of cutoffs) {
    // Check composite key uniqueness: year + round + collegeCode + departmentCode
    const compKey = `${c.academicYear}__${c.counsellingRound}__${c.collegeCode}__${c.departmentCode}`;
    if (compositeKeyMap.has(compKey)) {
      duplicateCompositeKeys++;
    } else {
      compositeKeyMap.set(compKey, true);
    }

    // Check college reference
    if (!collegeCodes.has(c.collegeCode)) {
      invalidCollegeRefs++;
    }

    // Check department reference
    if (!deptCodes.has(c.departmentCode)) {
      invalidDeptRefs++;
    }

    // Check classification
    if (c.ocCutoff === null) {
      unavailableCutoffs++;
    } else {
      if (c.dataStatus === 'OFFICIAL') officialCutoffs++;
      else if (c.dataStatus === 'PROJECTED') projectedCutoffs++;

      // Check if it exists in OFFICIAL_GROUND_TRUTH
      const colGt = OFFICIAL_GROUND_TRUTH[c.collegeCode];
      const branchGt = colGt?.branches?.[c.departmentCode];
      const cutoffGt = branchGt?.cutoffs?.[String(c.academicYear)];
      const roundGt = cutoffGt?.[c.round || `Round ${c.counsellingRound}`];
      
      if (c.academicYear <= 2025 && !roundGt && c.dataStatus === 'OFFICIAL') {
        syntheticCutoffs++;
      }
    }
  }

  console.log(`   - Official Historical Verified Cutoff Records: ${officialCutoffs}`);
  console.log(`   - Projected 2026 Model Records: ${projectedCutoffs}`);
  console.log(`   - Official Unavailable / Filled / Null Records: ${unavailableCutoffs}`);
  console.log(`   - Synthetic / Formula Cutoffs: ${syntheticCutoffs}`);
  console.log(`   - Duplicate Composite Keys: ${duplicateCompositeKeys}`);
  console.log(`   - Cutoffs with Invalid College References: ${invalidCollegeRefs}`);
  console.log(`   - Cutoffs with Invalid Branch References: ${invalidDeptRefs}`);

  // 4. Seat Matrix Audit
  const seats = await TneaSeatMatrix.find({}).lean();
  console.log(`\n4. SEAT MATRIX RECORDS:`);
  console.log(`   - Total Seat Matrix Records in DB: ${seats.length}`);

  console.log('\n========================================================================');
  console.log('🏁 AUDIT COMPLETED');
  console.log('========================================================================');

  return {
    totalColleges: colleges.length,
    totalDistricts: districts.size,
    totalBranches: departments.length,
    totalCutoffs: cutoffs.length,
    officialHistoricalCutoffs: officialCutoffs,
    projectedCutoffs,
    unavailableCutoffs,
    syntheticCutoffs,
    duplicateCompositeKeys,
    invalidCollegeRefs,
    invalidDeptRefs,
    totalSeats: seats.length,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runComprehensiveAudit().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
