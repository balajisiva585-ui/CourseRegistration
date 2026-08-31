import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import TneaFee from '../models/TneaFee.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importFees() {
  console.log('Importing Fee Structure Records into database...');
  const feesPath = path.join(__dirname, '../data/fees/fees.json');
  if (!fs.existsSync(feesPath)) {
    console.log('fees.json not found, skipping fees import.');
    return { totalInserted: 0 };
  }

  const fees = JSON.parse(fs.readFileSync(feesPath, 'utf8'));
  await TneaFee.deleteMany({});

  if (fees.length > 0) {
    await TneaFee.insertMany(fees, { ordered: false });
  }

  console.log(`✓ Fee Structure Records Ingested: ${fees.length} records`);
  return { totalInserted: fees.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await importFees();
    process.exit(0);
  })();
}
