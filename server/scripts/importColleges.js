import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaCollege from '../models/TneaCollege.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importColleges() {
  console.log('Importing Colleges into database...');
  const collegesPath = path.join(__dirname, '../data/colleges/colleges.json');
  const colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));

  let importedCount = 0;
  let updatedCount = 0;

  for (const c of colleges) {
    const code = c.code || c.collegeCode;
    const existing = await TneaCollege.findOne({ code });

    if (existing) {
      await TneaCollege.updateOne({ code }, { $set: c });
      updatedCount++;
    } else {
      await TneaCollege.create(c);
      importedCount++;
    }
  }

  console.log(`✓ Colleges Imported: ${importedCount}, Updated: ${updatedCount}, Total: ${colleges.length}`);
  return { importedCount, updatedCount, total: colleges.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await importColleges();
    process.exit(0);
  })();
}
