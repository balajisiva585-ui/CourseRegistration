import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

export function auditCutoffData(verbose = true) {
  const cutoffFiles = fs.readdirSync(path.join(DATA_DIR, 'cutoffs')).filter((f) => f.endsWith('.json'));

  const yearRoundStats = {};
  const seenLogicalKeys = new Set();
  let duplicateLogicalRecords = 0;
  let missingCollegeCodes = 0;
  let missingBranchCodes = 0;
  let invalidMarks = 0;
  let invalidRanks = 0;
  let unknownRounds = 0;
  let unknownCategories = 0;
  let recordsWithoutSource = 0;
  let totalRecords = 0;

  for (const file of cutoffFiles) {
    const cutoffs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'cutoffs', file), 'utf8'));
    totalRecords += cutoffs.length;

    for (const record of cutoffs) {
      const yr = record.academicYear;
      const rnd = record.counsellingRound || record.round;

      if (!yearRoundStats[yr]) {
        yearRoundStats[yr] = { 1: 0, 2: 0, 3: 0, other: 0 };
      }

      if (rnd === 1 || rnd === 'Round 1') yearRoundStats[yr][1]++;
      else if (rnd === 2 || rnd === 'Round 2') yearRoundStats[yr][2]++;
      else if (rnd === 3 || rnd === 'Round 3') yearRoundStats[yr][3]++;
      else {
        yearRoundStats[yr].other++;
        unknownRounds++;
      }

      // Check logical uniqueness
      const logicalKey = `${record.academicYear}-${record.counsellingRound}-${record.collegeCode}-${record.departmentCode || record.branchCode}`;
      if (seenLogicalKeys.has(logicalKey)) {
        duplicateLogicalRecords++;
      } else {
        seenLogicalKeys.add(logicalKey);
      }

      // Check college code
      if (!record.collegeCode || typeof record.collegeCode !== 'string' || record.collegeCode.trim() === '') {
        missingCollegeCodes++;
      }

      // Check branch code
      const branch = record.departmentCode || record.branchCode;
      if (!branch || typeof branch !== 'string' || branch.trim() === '') {
        missingBranchCodes++;
      }

      // Check marks
      const marks = [record.ocCutoff, record.bcCutoff, record.bcmCutoff, record.mbcCutoff, record.scCutoff, record.scaCutoff, record.stCutoff];
      for (const m of marks) {
        if (m !== null && m !== undefined) {
          if (typeof m !== 'number' || m < 0 || m > 200 || isNaN(m)) {
            invalidMarks++;
          }
        }
      }

      // Check ranks
      if (record.openingRank !== null && record.openingRank !== undefined && record.openingRank < 1) {
        invalidRanks++;
      }
      if (record.closingRank !== null && record.closingRank !== undefined && record.closingRank < 1) {
        invalidRanks++;
      }

      // Check source
      if (!record.sourceName && !record.source) {
        recordsWithoutSource++;
      }
    }
  }

  if (verbose) {
    console.log(`====================================`);
    console.log(`TNEA CUTOFF DATA AUDIT`);
    console.log(`====================================\n`);

    const sortedYears = Object.keys(yearRoundStats).sort((a, b) => Number(a) - Number(b));
    for (const y of sortedYears) {
      console.log(`${y}`);
      console.log(`Round 1: ${yearRoundStats[y][1]}`);
      console.log(`Round 2: ${yearRoundStats[y][2]}`);
      console.log(`Round 3: ${yearRoundStats[y][3]}\n`);
    }

    console.log(`Duplicate logical records: ${duplicateLogicalRecords}`);
    console.log(`Missing college codes: ${missingCollegeCodes}`);
    console.log(`Missing branch codes: ${missingBranchCodes}`);
    console.log(`Invalid marks: ${invalidMarks}`);
    console.log(`Invalid ranks: ${invalidRanks}`);
    console.log(`Unknown rounds: ${unknownRounds}`);
    console.log(`Unknown categories: ${unknownCategories}`);
    console.log(`Records without source: ${recordsWithoutSource}`);
    console.log(`\n====================================`);
  }

  const isHealthy =
    duplicateLogicalRecords === 0 &&
    missingCollegeCodes === 0 &&
    missingBranchCodes === 0 &&
    invalidMarks === 0 &&
    invalidRanks === 0 &&
    unknownRounds === 0 &&
    recordsWithoutSource === 0;

  return {
    isHealthy,
    totalRecords,
    yearRoundStats,
    duplicateLogicalRecords,
    missingCollegeCodes,
    missingBranchCodes,
    invalidMarks,
    invalidRanks,
    unknownRounds,
    recordsWithoutSource,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = auditCutoffData(true);
  process.exit(result.isHealthy ? 0 : 1);
}
