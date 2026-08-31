import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

export function validateDataset(verbose = true) {
  const errors = [];
  const warnings = [];

  // 1. Read Branches
  const branchesPath = path.join(DATA_DIR, 'branches/branches.json');
  if (!fs.existsSync(branchesPath)) {
    errors.push('branches.json is missing');
    return { status: 'FAIL', errors };
  }
  const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));
  const validBranchCodes = new Set(branches.map((b) => b.code));

  // 2. Read Colleges
  const collegesPath = path.join(DATA_DIR, 'colleges/colleges.json');
  if (!fs.existsSync(collegesPath)) {
    errors.push('colleges.json is missing');
    return { status: 'FAIL', errors };
  }
  const colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));

  const seenCollegeCodes = new Set();
  const seenCollegeNames = new Set();
  let duplicateCollegesCount = 0;
  let invalidCodesCount = 0;

  for (const c of colleges) {
    const code = c.code || c.collegeCode;
    const name = c.name || c.collegeName;

    if (!code || typeof code !== 'string' || code.trim() === '') {
      errors.push(`College missing official code: ${JSON.stringify(c)}`);
      invalidCodesCount++;
    } else if (seenCollegeCodes.has(code)) {
      errors.push(`Duplicate college code detected: ${code}`);
      duplicateCollegesCount++;
    } else {
      seenCollegeCodes.add(code);
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push(`College missing name for code ${code}`);
    } else if (seenCollegeNames.has(name)) {
      errors.push(`Duplicate college name detected: ${name} (${code})`);
    } else {
      seenCollegeNames.add(name);
    }

    if (!c.district || typeof c.district !== 'string' || c.district.trim() === '') {
      errors.push(`College ${code} is missing district.`);
    }

    if (c.departments && Array.isArray(c.departments)) {
      for (const d of c.departments) {
        if (!validBranchCodes.has(d.departmentCode)) {
          errors.push(`College ${code} has unrecognized branch code: ${d.departmentCode}`);
        }
      }
    }

    if (c.sourceUrl && !c.sourceUrl.startsWith('http')) {
      errors.push(`College ${code} has invalid source URL: ${c.sourceUrl}`);
    }
  }

  // 3. Read & Validate Cutoffs
  const cutoffFiles = fs.readdirSync(path.join(DATA_DIR, 'cutoffs')).filter((f) => f.endsWith('.json'));
  let totalCutoffRecords = 0;
  let invalidCutoffsCount = 0;
  let duplicateCutoffsCount = 0;
  const seenCutoffKeys = new Set();

  for (const file of cutoffFiles) {
    const filePath = path.join(DATA_DIR, 'cutoffs', file);
    const cutoffs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    totalCutoffRecords += cutoffs.length;

    for (const record of cutoffs) {
      const { academicYear, round, collegeCode, departmentCode, ocCutoff, bcCutoff, bcmCutoff, mbcCutoff, scCutoff, scaCutoff, stCutoff, sourceUrl } = record;

      if (!academicYear || academicYear < 2000 || academicYear > 2030) {
        errors.push(`Invalid academic year: ${academicYear} in ${file}`);
      }

      if (!seenCollegeCodes.has(collegeCode)) {
        errors.push(`Cutoff record references unknown collegeCode: ${collegeCode}`);
      }

      if (!validBranchCodes.has(departmentCode)) {
        errors.push(`Cutoff record references unknown branchCode: ${departmentCode}`);
      }

      const key = `${academicYear}-${round}-${collegeCode}-${departmentCode}`;
      if (seenCutoffKeys.has(key)) {
        errors.push(`Duplicate cutoff record for ${key}`);
        duplicateCutoffsCount++;
      } else {
        seenCutoffKeys.add(key);
      }

      const categories = [
        { name: 'ocCutoff', val: ocCutoff },
        { name: 'bcCutoff', val: bcCutoff },
        { name: 'bcmCutoff', val: bcmCutoff },
        { name: 'mbcCutoff', val: mbcCutoff },
        { name: 'scCutoff', val: scCutoff },
        { name: 'scaCutoff', val: scaCutoff },
        { name: 'stCutoff', val: stCutoff },
      ];

      for (const cat of categories) {
        if (cat.val !== null && cat.val !== undefined) {
          if (typeof cat.val !== 'number' || cat.val < 0 || cat.val > 200 || isNaN(cat.val)) {
            errors.push(`Invalid cutoff mark ${cat.val} for ${cat.name} on ${key}`);
            invalidCutoffsCount++;
          }
        }
      }

      if (sourceUrl && !sourceUrl.startsWith('http')) {
        errors.push(`Cutoff ${key} has invalid source URL: ${sourceUrl}`);
      }
    }
  }

  // 4. Read & Validate Seats
  const seatFiles = fs.readdirSync(path.join(DATA_DIR, 'seats')).filter((f) => f.endsWith('.json'));
  let totalSeatRecords = 0;
  let invalidSeatsCount = 0;
  const validCategories = new Set(['OC', 'BC', 'BCM', 'MBC/DNC', 'SC', 'SCA', 'ST', 'Management', 'NRI', 'Sports', 'Special', 'Other']);

  for (const file of seatFiles) {
    const filePath = path.join(DATA_DIR, 'seats', file);
    const seats = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    totalSeatRecords += seats.length;

    for (const s of seats) {
      if (!seenCollegeCodes.has(s.collegeCode)) {
        errors.push(`Seat record references unknown collegeCode: ${s.collegeCode}`);
      }
      if (s.totalIntake < 0 || s.totalFilled < 0 || s.totalAvailable < 0) {
        errors.push(`Negative seat count in college ${s.collegeCode} dept ${s.departmentCode}`);
        invalidSeatsCount++;
      }
      if (s.categories && Array.isArray(s.categories)) {
        for (const cat of s.categories) {
          if (!validCategories.has(cat.category)) {
            errors.push(`Invalid reservation category: ${cat.category} in college ${s.collegeCode}`);
          }
          if (cat.totalSeats < 0 || cat.filledSeats < 0 || cat.availableSeats < 0) {
            errors.push(`Negative category seat count in college ${s.collegeCode} category ${cat.category}`);
            invalidSeatsCount++;
          }
        }
      }
    }
  }

  // 5. Read & Validate Fees
  const feesPath = path.join(DATA_DIR, 'fees/fees.json');
  let totalFeeRecords = 0;
  if (fs.existsSync(feesPath)) {
    const fees = JSON.parse(fs.readFileSync(feesPath, 'utf8'));
    totalFeeRecords = fees.length;
    for (const f of fees) {
      if (!seenCollegeCodes.has(f.collegeCode)) {
        errors.push(`Fee record references unknown collegeCode: ${f.collegeCode}`);
      }
      if (f.tuitionFee !== null && f.tuitionFee < 0) {
        errors.push(`Negative tuition fee for college ${f.collegeCode}`);
      }
    }
  }

  const passed = errors.length === 0;

  if (verbose) {
    console.log(`\n========================================`);
    console.log(`Dataset Validation`);
    console.log(`========================================`);
    console.log(`Colleges: ${colleges.length}`);
    console.log(`Branches: ${branches.length}`);
    console.log(`Cutoff Records: ${totalCutoffRecords}`);
    console.log(`Seat Records: ${totalSeatRecords}`);
    console.log(`Fee Records: ${totalFeeRecords}`);
    console.log(``);
    console.log(`Duplicate Colleges: ${duplicateCollegesCount}`);
    console.log(`Invalid Codes: ${invalidCodesCount}`);
    console.log(`Invalid Cutoffs: ${invalidCutoffsCount}`);
    console.log(`Duplicate Cutoff Records: ${duplicateCutoffsCount}`);
    console.log(``);
    if (!passed) {
      console.log(`Found ${errors.length} validation errors:`);
      errors.slice(0, 10).forEach((err) => console.log(`  - ❌ ${err}`));
      if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more.`);
    }
    console.log(`STATUS: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`========================================\n`);
  }

  return {
    status: passed ? 'PASS' : 'FAIL',
    collegesCount: colleges.length,
    branchesCount: branches.length,
    cutoffRecordsCount: totalCutoffRecords,
    seatRecordsCount: totalSeatRecords,
    feeRecordsCount: totalFeeRecords,
    errors,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateDataset(true);
  process.exit(result.status === 'PASS' ? 0 : 1);
}
