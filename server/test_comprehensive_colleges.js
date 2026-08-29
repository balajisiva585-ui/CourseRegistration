import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import TneaCollege from './models/TneaCollege.js';
import TneaDepartment from './models/TneaDepartment.js';
import TneaCutoff from './models/TneaCutoff.js';
import TneaSeatMatrix from './models/TneaSeatMatrix.js';
import TneaReport from './models/TneaReport.js';
import { seedTneaData } from './seed/tneaSeedData.js';

const runComprehensiveVerification = async () => {
  console.log('--- Starting Comprehensive College Database Test ---');
  let mongoServer;

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('[Test DB] In-memory MongoDB connected successfully.');

    // Seed database
    await seedTneaData();

    // 1. Verify Colleges Count and Authenticity
    const colleges = await TneaCollege.find().sort({ code: 1 });
    console.log(`[Test 1] Total colleges in database: ${colleges.length}`);
    if (colleges.length < 5) throw new Error('Expected at least 5 top institutions.');

    colleges.forEach((col) => {
      console.log(` - [${col.code}] ${col.name} (${col.district}) | Type: ${col.collegeType} | Completeness: ${col.dataCompleteness}% | Provenance: ${col.verificationStatus}`);
      if (!col.code || col.code.length !== 4) throw new Error(`Invalid TNEA code on ${col.name}`);
      if (!col.dataCompleteness || col.dataCompleteness < 80) throw new Error(`Low completeness score on ${col.name}`);
    });

    // 2. Verify Standard Departments Master
    const departments = await TneaDepartment.find();
    console.log(`[Test 2] Total engineering disciplines catalogued: ${departments.length}`);
    if (departments.length < 10) throw new Error('Expected 10+ standard disciplines.');

    // 3. Verify Multi-Year Cutoff Provenance
    const cutoffCount = await TneaCutoff.countDocuments();
    const officialCutoffs = await TneaCutoff.countDocuments({ dataType: 'OFFICIAL' });
    console.log(`[Test 3] Total Cutoffs: ${cutoffCount} | Official Gazette Cutoffs: ${officialCutoffs}`);
    if (cutoffCount === 0 || officialCutoffs === 0) throw new Error('Missing official cutoffs.');

    // 4. Verify Seat Matrix Intake
    const seatCount = await TneaSeatMatrix.countDocuments();
    console.log(`[Test 4] Total Seat Matrices: ${seatCount}`);
    if (seatCount === 0) throw new Error('Missing seat matrices.');

    // 5. Test Student Error Report Submission
    const sampleCollege = colleges[0];
    const testReport = await TneaReport.create({
      college: sampleCollege._id,
      collegeCode: sampleCollege.code,
      collegeName: sampleCollege.name,
      issueType: 'Incorrect Phone Number',
      description: 'Principal phone updated in recent circular.',
      suggestedCorrection: '044-22358491',
      reporterName: 'Alumni Researcher',
      reporterEmail: 'alumni@ceg.annauniv.edu',
      status: 'Pending',
    });
    console.log(`[Test 5] Student Report Created: [${testReport.issueType}] for ${testReport.collegeName} (Status: ${testReport.status})`);

    console.log('--- ALL COMPREHENSIVE COLLEGE TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
};

runComprehensiveVerification();
