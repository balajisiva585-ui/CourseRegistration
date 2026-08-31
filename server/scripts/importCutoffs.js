import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaCollege from '../models/TneaCollege.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importCutoffs() {
  console.log('Importing Multi-Year Cutoff Records into database...');
  const cutoffsDir = path.join(__dirname, '../data/cutoffs');
  const files = fs.readdirSync(cutoffsDir).filter((f) => f.endsWith('.json'));

  const colleges = await TneaCollege.find({}, '_id code');
  const collegeMap = new Map();
  colleges.forEach((c) => collegeMap.set(c.code, c._id));

  await TneaCutoff.deleteMany({});
  let totalInserted = 0;

  for (const file of files) {
    const cutoffs = JSON.parse(fs.readFileSync(path.join(cutoffsDir, file), 'utf8'));
    const enriched = cutoffs.map((item) => ({
      ...item,
      college: collegeMap.get(item.collegeCode) || null,
      district: item.district || '',
    }));

    if (enriched.length > 0) {
      await TneaCutoff.insertMany(enriched, { ordered: false });
      totalInserted += enriched.length;
    }
  }

  console.log(`✓ Cutoff Records Successfully Ingested: ${totalInserted} records across ${files.length} files`);
  return { totalInserted, filesCount: files.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await importCutoffs();
    process.exit(0);
  })();
}
