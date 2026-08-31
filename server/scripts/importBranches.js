import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaDepartment from '../models/TneaDepartment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importBranches() {
  console.log('Importing Branches into database...');
  const branchesPath = path.join(__dirname, '../data/branches/branches.json');
  const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));

  let importedCount = 0;
  let updatedCount = 0;

  for (const b of branches) {
    const existing = await TneaDepartment.findOne({ code: b.code });
    if (existing) {
      await TneaDepartment.updateOne({ code: b.code }, { $set: b });
      updatedCount++;
    } else {
      await TneaDepartment.create(b);
      importedCount++;
    }
  }

  console.log(`✓ Branches Imported: ${importedCount}, Updated: ${updatedCount}, Total: ${branches.length}`);
  return { importedCount, updatedCount, total: branches.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await importBranches();
    process.exit(0);
  })();
}
