import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaCollege from '../models/TneaCollege.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importSeats() {
  console.log('Importing Seat Matrix Records into database...');
  const seatsDir = path.join(__dirname, '../data/seats');
  const files = fs.readdirSync(seatsDir).filter((f) => f.endsWith('.json'));

  const colleges = await TneaCollege.find({}, '_id code');
  const collegeMap = new Map();
  colleges.forEach((c) => collegeMap.set(c.code, c._id));

  await TneaSeatMatrix.deleteMany({});
  let totalInserted = 0;

  for (const file of files) {
    const seats = JSON.parse(fs.readFileSync(path.join(seatsDir, file), 'utf8'));
    const enriched = seats.map((item) => ({
      ...item,
      college: collegeMap.get(item.collegeCode) || null,
      district: item.district || '',
    }));

    if (enriched.length > 0) {
      await TneaSeatMatrix.insertMany(enriched, { ordered: false });
      totalInserted += enriched.length;
    }
  }

  console.log(`✓ Seat Matrix Records Successfully Ingested: ${totalInserted} records across ${files.length} files`);
  return { totalInserted, filesCount: files.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await importSeats();
    process.exit(0);
  })();
}
