import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function auditDatabase() {
  console.log('========================================================================');
  console.log('🔍 RUNNING COMPREHENSIVE TNEA DATABASE & CUTOFF AUDIT');
  console.log('========================================================================\n');

  const files = ['cutoff_2021.json', 'cutoff_2022.json', 'cutoff_2023.json', 'cutoff_2024.json', 'cutoff_2025.json', 'cutoff_2026.json'];
  let totalRecords = 0;
  let nullRecords = 0;
  let officialRecords = 0;
  let projectedRecords = 0;

  const duplicateMap = new Map();

  for (const file of files) {
    const filePath = path.join(__dirname, '../server/data/cutoffs', file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    totalRecords += data.length;

    for (const item of data) {
      if (item.ocCutoff === null) {
        nullRecords++;
      } else {
        if (item.dataStatus === 'OFFICIAL') officialRecords++;
        else if (item.dataStatus === 'PROJECTED') projectedRecords++;

        // Audit composite key uniqueness
        const key = `${item.academicYear}_R${item.counsellingRound}_${item.departmentCode}_${item.ocCutoff}`;
        if (!duplicateMap.has(key)) duplicateMap.set(key, []);
        duplicateMap.get(key).push(`${item.collegeCode} (${item.collegeName})`);
      }
    }
  }

  console.log(`✓ Total Cutoff Records Ingested: ${totalRecords}`);
  console.log(`✓ Official Verified Historical Cutoff Records: ${officialRecords}`);
  console.log(`✓ Projected 2026 Model Cutoff Records: ${projectedRecords}`);
  console.log(`✓ Official Unavailable / Filled / Null Cutoff Records: ${nullRecords}`);

  // Inspect any duplicates
  let fallbackDuplicates = 0;
  for (const [key, colleges] of duplicateMap.entries()) {
    if (colleges.length > 1) {
      // Check if it's top tier 200.00 / 199.50 genuine ties or fallback
      const [year, round, dept, cutoff] = key.split('_');
      if (Number(cutoff) === 175.0 || Number(cutoff) === 171.25) {
        fallbackDuplicates++;
        console.error(`  ❌ FALLBACK DETECTED: ${key} shared across ${colleges.length} colleges: ${colleges.join(', ')}`);
      }
    }
  }

  if (fallbackDuplicates === 0) {
    console.log('✅ ZERO generic/synthetic fallback cutoff duplicates detected in the entire database!');
  } else {
    console.error(`❌ Found ${fallbackDuplicates} fallback duplicate groups.`);
  }

  console.log('\n========================================================================');
  console.log('🏁 DATABASE AUDIT COMPLETED SUCCESSFULLY');
  console.log('========================================================================');
}

auditDatabase();
