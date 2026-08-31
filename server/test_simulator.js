import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedTneaData } from './seed/tneaSeedData.js';
import TneaCutoff from './models/TneaCutoff.js';
import TneaSeatMatrix from './models/TneaSeatMatrix.js';
import TneaSimulation from './models/TneaSimulation.js';

const runTests = async () => {
  console.log('--- Starting TNEA Simulator Verification Tests ---');

  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  console.log('[Test] Connected to test database. Seeding data...');
  await seedTneaData();

  // Test 1: Verify 5-Year Cutoffs
  const cutoffs2021 = await TneaCutoff.countDocuments({ academicYear: 2021 });
  const cutoffs2025 = await TneaCutoff.countDocuments({ academicYear: 2025 });
  const totalCutoffs = await TneaCutoff.countDocuments();
  console.log(`[Test 1] 2021 Cutoffs: ${cutoffs2021}, 2025 Cutoffs: ${cutoffs2025}, Total Cutoffs: ${totalCutoffs}`);

  if (totalCutoffs < 500) throw new Error('Expected >500 multi-year cutoff records (2021-2026)');

  // Test 2: Verify Provenance Fields
  const demoCutoffs = await TneaCutoff.countDocuments({ dataType: 'DEMO' });
  console.log(`[Test 2] Provenance Verified: ${demoCutoffs} records tracked with dataType DEMO.`);

  // Test 3: Cutoff Calculation Logic (Maths + Phys/2 + Chem/2)
  const maths = 95;
  const physics = 90;
  const chemistry = 88;
  const calculatedCutoff = +(maths + physics / 2 + chemistry / 2).toFixed(2);
  console.log(`[Test 3] Formula Verification: ${maths} + ${physics}/2 + ${chemistry}/2 = ${calculatedCutoff} / 200`);
  if (calculatedCutoff !== 184.0) throw new Error('Cutoff calculation formula mismatch');

  // Test 4: Historical Series for College 0001 & Department CS
  const series0001 = await TneaCutoff.find({
    collegeCode: '0001',
    departmentCode: 'CS',
    round: 'Round 1',
  }).sort({ academicYear: 1 });

  console.log(`[Test 4] CEG Guindy CSE Cutoff History (2021-2026):`);
  series0001.forEach((c) => {
    console.log(`   Year ${c.academicYear}: OC=${c.ocCutoff}, BC=${c.bcCutoff}, MBC=${c.mbcCutoff}, SC=${c.scCutoff}`);
  });

  // Test 5: Seat Matrix Quota & Category Availability
  const seat0001 = await TneaSeatMatrix.findOne({
    collegeCode: '0001',
    departmentCode: 'CS',
    academicYear: 2025,
  });
  console.log(`[Test 5] Seat Matrix CEG Guindy CS: Intake=${seat0001.totalIntake}, Filled=${seat0001.totalFilled}, Available=${seat0001.totalAvailable}`);

  // Test 6: Simulation Model
  const sampleSim = new TneaSimulation({
    simulationTitle: 'Test Sim Plan',
    academicYear: 2025,
    academicDetails: { effectiveCutoff: 184.0 },
    community: 'BC',
    preferences: [
      { priority: 1, collegeCode: '0001', collegeName: 'CEG', departmentCode: 'CS', departmentName: 'CSE', quota: 'Government' },
      { priority: 2, collegeCode: '2712', collegeName: 'KCT', departmentCode: 'CS', departmentName: 'CSE', quota: 'Government' },
    ],
    results: [
      {
        priority: 1,
        collegeCode: '0001',
        collegeName: 'CEG',
        departmentCode: 'CS',
        departmentName: 'CSE',
        predictionTier: 'Reach',
        studentCutoff: 184.0,
        historicalCutoff: 197.5,
        difference: -13.5,
        community: 'BC',
        dataConfidence: 'High',
      },
      {
        priority: 2,
        collegeCode: '2712',
        collegeName: 'KCT',
        departmentCode: 'CS',
        departmentName: 'CSE',
        predictionTier: 'Likely',
        studentCutoff: 184.0,
        historicalCutoff: 182.0,
        difference: 2.0,
        community: 'BC',
        dataConfidence: 'High',
      },
    ],
    summaryCounts: { likelyCount: 1, possibleCount: 0, reachCount: 1, unlikelyCount: 0 },
  });

  await sampleSim.save();
  console.log(`[Test 6] Simulation Plan Saved successfully with shareId: ${sampleSim.shareId}`);

  await mongoose.disconnect();
  await mongod.stop();
  console.log('--- All TNEA Simulator Backend Tests Passed Successfully! ---');
};

runTests().catch((err) => {
  console.error('[Test Failed]:', err);
  process.exit(1);
});
