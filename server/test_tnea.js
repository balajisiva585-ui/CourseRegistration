import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import TneaCollege from './models/TneaCollege.js';
import TneaDepartment from './models/TneaDepartment.js';
import TneaCutoff from './models/TneaCutoff.js';
import TneaSeatMatrix from './models/TneaSeatMatrix.js';
import TneaApplication from './models/TneaApplication.js';

const testBackend = async () => {
  try {
    console.log('Testing TNEA Backend...');
    await connectDB();

    const collegeCount = await TneaCollege.countDocuments();
    const deptCount = await TneaDepartment.countDocuments();
    const cutoffCount = await TneaCutoff.countDocuments();
    const seatCount = await TneaSeatMatrix.countDocuments();
    const appCount = await TneaApplication.countDocuments();

    console.log(`[Test Result] Colleges: ${collegeCount}`);
    console.log(`[Test Result] Departments: ${deptCount}`);
    console.log(`[Test Result] Cutoffs: ${cutoffCount}`);
    console.log(`[Test Result] Seat Matrices: ${seatCount}`);
    console.log(`[Test Result] Applications: ${appCount}`);

    if (collegeCount > 0 && cutoffCount > 0 && seatCount > 0) {
      console.log('✅ ALL TNEA BACKEND DATA SEEDED & READY SUCCESSFULLY!');
    } else {
      console.error('❌ SEED DATA COUNT IS ZERO!');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
};

testBackend();
