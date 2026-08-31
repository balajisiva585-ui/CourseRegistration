import TneaCollege from '../models/TneaCollege.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaApplication from '../models/TneaApplication.js';
import TneaFee from '../models/TneaFee.js';
import { validateDataset } from '../scripts/validateDataset.js';
import { importBranches } from '../scripts/importBranches.js';
import { importColleges } from '../scripts/importColleges.js';
import { importCutoffs } from '../scripts/importCutoffs.js';
import { importSeats } from '../scripts/importSeats.js';
import { importFees } from '../scripts/importFees.js';
import { comprehensiveColleges } from './tneaComprehensiveColleges.js';

export const standardDepartments = [
  { code: 'CS', name: 'Computer Science and Engineering', degree: 'B.E.', category: 'Computing & IT', isActive: true },
  { code: 'AD', name: 'Artificial Intelligence and Data Science', degree: 'B.Tech.', category: 'Artificial Intelligence', isActive: true },
  { code: 'IT', name: 'Information Technology', degree: 'B.Tech.', category: 'Computing & IT', isActive: true },
  { code: 'CB', name: 'Computer Science and Business Systems', degree: 'B.Tech.', category: 'Computing & IT', isActive: true },
  { code: 'AM', name: 'Artificial Intelligence and Machine Learning', degree: 'B.E.', category: 'Artificial Intelligence', isActive: true },
  { code: 'EC', name: 'Electronics and Communication Engineering', degree: 'B.E.', category: 'Circuit & Communications', isActive: true },
  { code: 'EE', name: 'Electrical and Electronics Engineering', degree: 'B.E.', category: 'Circuit & Communications', isActive: true },
  { code: 'EI', name: 'Electronics and Instrumentation Engineering', degree: 'B.E.', category: 'Circuit & Communications', isActive: true },
  { code: 'ME', name: 'Mechanical Engineering', degree: 'B.E.', category: 'Mechanical & Design', isActive: true },
  { code: 'CE', name: 'Civil Engineering', degree: 'B.E.', category: 'Infrastructure & Earth', isActive: true },
  { code: 'BT', name: 'Biotechnology', degree: 'B.Tech.', category: 'Bio & Medical', isActive: true },
  { code: 'BM', name: 'Biomedical Engineering', degree: 'B.E.', category: 'Bio & Medical', isActive: true },
  { code: 'CH', name: 'Chemical Engineering', degree: 'B.Tech.', category: 'Chemical & Material', isActive: true },
  { code: 'AE', name: 'Aeronautical Engineering', degree: 'B.E.', category: 'Aerospace & Flight', isActive: true },
  { code: 'AU', name: 'Automobile Engineering', degree: 'B.E.', category: 'Mechanical & Design', isActive: true },
  { code: 'MT', name: 'Mechatronics Engineering', degree: 'B.E.', category: 'Mechanical & Automation', isActive: true },
  { code: 'RO', name: 'Robotics and Automation', degree: 'B.E.', category: 'Mechanical & Automation', isActive: true },
  { code: 'FT', name: 'Food Technology', degree: 'B.Tech.', category: 'Bio & Medical', isActive: true },
  { code: 'PT', name: 'Petrochemical Technology', degree: 'B.Tech.', category: 'Chemical & Material', isActive: true },
  { code: 'TT', name: 'Textile Technology', degree: 'B.Tech.', category: 'Chemical & Material', isActive: true },
];

export const calculateCompleteness = (col) => {
  const checkFields = [
    col.name,
    col.code,
    col.district,
    col.collegeType,
    col.establishedYear,
    col.affiliation?.affiliatingUniversity,
    col.contact?.website,
    col.contact?.email,
    col.contact?.phone,
    col.descriptions?.about,
    col.descriptions?.vision,
    col.descriptions?.mission,
    col.highlights?.length > 0,
    col.departments?.length > 0,
    col.accreditations?.length > 0,
    col.placements?.placementPercentage > 0,
    col.facilities?.hostel?.available !== undefined,
    col.facilities?.library?.available !== undefined,
    col.facilities?.transport?.available !== undefined,
    col.admissionInfo?.eligibility,
  ];

  const filled = checkFields.filter(Boolean).length;
  return Math.round((filled / checkFields.length) * 100);
};

export const seedTneaData = async () => {
  try {
    console.log('--- Initializing Comprehensive Source-Backed TNEA Dataset Pipeline ---');

    // 1. Validate Dataset Integrity First
    const validation = validateDataset(false);
    if (validation.status !== 'PASS') {
      console.warn(`[TNEA Pipeline Warning] Dataset validation found ${validation.errors?.length} issues.`);
    } else {
      console.log(`[TNEA Pipeline] Dataset validation PASSED (${validation.collegesCount} colleges, ${validation.cutoffRecordsCount} cutoffs, ${validation.seatRecordsCount} seat records).`);
    }

    // 2. Clear old TNEA collections
    await Promise.all([
      TneaCollege.deleteMany({}),
      TneaDepartment.deleteMany({}),
      TneaCutoff.deleteMany({}),
      TneaSeatMatrix.deleteMany({}),
      TneaApplication.deleteMany({}),
      TneaFee.deleteMany({}),
    ]);

    // 3. Import Standard Branches
    await importBranches();

    // 4. Import Master Colleges
    await importColleges();

    // 5. Import Multi-Year Cutoff Archives
    await importCutoffs();

    // 6. Import Multi-Year Seat Matrix Records
    await importSeats();

    // 7. Import Official Fee Structures
    await importFees();

    // 8. Application Notices
    const firstCol = await TneaCollege.findOne({ code: '0001' });
    const ssnCol = await TneaCollege.findOne({ code: '1315' });

    const applicationsToInsert = [
      {
        college: firstCol?._id || null,
        collegeCode: '0001',
        collegeName: 'College of Engineering, Guindy (CEG), Anna University',
        title: 'TNEA General Single Window Centralized Counselling 2025',
        academicYear: 2025,
        status: 'Open',
        startDate: new Date('2025-05-05'),
        closingDate: new Date('2025-06-06'),
        applicationLink: 'https://www.tneaonline.org',
        applicationType: 'TNEA Counselling',
        eligibility: 'Pass in Higher Secondary (+2) with Mathematics, Physics & Chemistry. Minimum 45% aggregate (40% for reserved communities).',
        requiredDocuments: [
          '10th & 12th Mark Sheets',
          'Community Certificate (Permanent card/electronic form)',
          'Transfer Certificate (TC)',
          'Special Reservation Certificate (7.5% Govt school, Sports, Ex-Servicemen, PwD) if applicable',
          'Nativity Certificate (if applicable)',
        ],
        applicationFee: 500,
        contactHelpdesk: '044-22351014 / care@tneaonline.org',
        demoData: false,
      },
      {
        college: ssnCol?._id || null,
        collegeCode: '1315',
        collegeName: 'Sri Sivasubramaniya Nadar (SSN) College of Engineering',
        title: 'SSN B.E./B.Tech. Management Quota & Shiv Nadar Foundation Scholarship 2025',
        academicYear: 2025,
        status: 'Open',
        startDate: new Date('2025-04-15'),
        closingDate: new Date('2025-05-30'),
        applicationLink: 'https://www.ssn.edu.in/admissions',
        applicationType: 'Management Quota Direct',
        eligibility: 'High cut-off marks in +2 PCM. Top performers eligible for Full Merit Scholarship.',
        requiredDocuments: [
          '10th & 12th Standard Marksheets',
          'ID Proof (Aadhaar/Passport)',
          'Community Certificate',
          'Special Achievement certificates (National Olympiads/Sports)',
        ],
        applicationFee: 1200,
        contactHelpdesk: '044-27469700 / admissions@ssn.edu.in',
        demoData: false,
      },
    ];

    await TneaApplication.insertMany(applicationsToInsert);

    console.log('--- Tamil Nadu Engineering Colleges Comprehensive Source-Backed Dataset Ready! ---');
  } catch (error) {
    console.error('[TNEA Seed] Error seeding TNEA data:', error);
    throw error;
  }
};
