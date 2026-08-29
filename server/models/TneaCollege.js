import mongoose from 'mongoose';

const accreditationSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      enum: ['NAAC', 'NBA', 'NIRF', 'AICTE', 'UGC', 'QS', 'Other'],
    },
    grade: {
      type: String,
      default: 'Accredited',
    },
    rank: {
      type: Number,
      default: null,
    },
    year: {
      type: Number,
      default: 2024,
    },
    validityYear: {
      type: Number,
      default: 2028,
    },
    source: {
      type: String,
      default: 'Official Accreditation Body Portal',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const collegeDepartmentSchema = new mongoose.Schema(
  {
    departmentCode: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      default: 'B.E.',
      enum: ['B.E.', 'B.Tech.', 'B.Arch.'],
    },
    durationYears: {
      type: Number,
      default: 4,
    },
    intake: {
      type: Number,
      default: 60,
    },
    currentIntake: {
      type: Number,
      default: 60,
    },
    hodName: {
      type: String,
      default: 'Information Not Available',
    },
    accreditationStatus: {
      type: String,
      default: 'AICTE Approved',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const tneaCollegeSchema = new mongoose.Schema(
  {
    // Primary Official Identification
    code: {
      type: String,
      required: [true, 'Official TNEA 4-digit code is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      index: true,
    },
    shortName: {
      type: String,
      trim: true,
      index: true,
    },
    collegeType: {
      type: String,
      enum: [
        'Government',
        'Government Aided',
        'University Department',
        'University Constituent College',
        'Autonomous',
        'Self Financing',
        'Private',
        'Deemed University',
        'Other',
      ],
      default: 'Self Financing',
      index: true,
    },
    establishedYear: {
      type: Number,
      default: 2000,
    },

    // Affiliation Information
    affiliation: {
      affiliatingUniversity: {
        type: String,
        default: 'Anna University, Chennai',
      },
      affiliationStatus: {
        type: String,
        default: 'Permanent Affiliation',
      },
      affiliationYear: {
        type: Number,
        default: 2002,
      },
      isPermanent: {
        type: Boolean,
        default: true,
      },
      details: {
        type: String,
        default: 'Affiliated to Anna University, approved by AICTE, New Delhi.',
      },
    },

    // Autonomous Status
    isAutonomous: {
      type: Boolean,
      default: false,
      index: true,
    },
    autonomousSince: {
      type: Number,
      default: null,
    },
    autonomousSource: {
      type: String,
      default: 'UGC Autonomous Conferment Order',
    },

    // Location & Coordinates
    district: {
      type: String,
      required: [true, 'District is required'],
      index: true,
    },
    city: {
      type: String,
      default: '',
      index: true,
    },
    taluk: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    pinCode: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },

    // Contact Information
    contact: {
      website: { type: String, default: '' },
      email: { type: String, default: '' },
      admissionEmail: { type: String, default: '' },
      phone: { type: String, default: '' },
      admissionPhone: { type: String, default: '' },
      principalPhone: { type: String, default: '' },
      fax: { type: String, default: '' },
    },

    // Institutional Narrative
    descriptions: {
      about: { type: String, default: '' },
      history: { type: String, default: '' },
      vision: { type: String, default: '' },
      mission: { type: String, default: '' },
      academicOverview: { type: String, default: '' },
      campusOverview: { type: String, default: '' },
    },
    highlights: [{ type: String }],
    logo: { type: String, default: '' },
    bannerImage: { type: String, default: '' },

    // Accreditations (NAAC, NBA, NIRF, AICTE, UGC)
    accreditations: [accreditationSchema],
    accreditation: {
      naacGrade: { type: String, default: 'NA' },
      nbaAccredited: { type: Boolean, default: false },
      nirfRank: { type: Number, default: null },
    },

    // Approved Departments / Courses
    departments: [collegeDepartmentSchema],

    // Admission & Eligibility Info
    admissionInfo: {
      tneaQuotaPercent: { type: Number, default: 65 },
      mgmtQuotaPercent: { type: Number, default: 35 },
      eligibility: { type: String, default: 'Pass in 10+2 with Physics, Chemistry, and Mathematics (PCM).' },
      generalInfo: { type: String, default: 'Admissions are conducted through TNEA Single Window Centralized Counselling.' },
      applicationProcess: { type: String, default: 'Register online at www.tneaonline.org for government quota counseling.' },
      requiredDocuments: [{ type: String }],
      contactHelpdesk: { type: String, default: '' },
    },

    // Placements
    placements: {
      placementPercentage: { type: Number, default: 85 },
      placedStudentsCount: { type: Number, default: 0 },
      highestPackageLPA: { type: Number, default: 0 },
      averagePackageLPA: { type: Number, default: 0 },
      medianPackageLPA: { type: Number, default: 0 },
      lowestPackageLPA: { type: Number, default: 0 },
      topRecruiters: [{ type: String }],
      year: { type: Number, default: 2024 },
      reportUrl: { type: String, default: '' },
      placementCellInfo: { type: String, default: 'Dedicated training and placement division with corporate tie-ups.' },
      source: { type: String, default: 'Institutional NIRF / AICTE Mandatory Disclosure' },
    },

    // Campus Facilities & Infrastructure
    facilities: {
      hostel: {
        available: { type: Boolean, default: true },
        boysHostel: { type: Boolean, default: true },
        girlsHostel: { type: Boolean, default: true },
        capacity: { type: Number, default: 1200 },
        details: { type: String, default: 'Residential hostels with modern amenities and hygienic dining.' },
      },
      library: {
        available: { type: Boolean, default: true },
        booksCount: { type: Number, default: 50000 },
        digitalAccess: { type: Boolean, default: true },
      },
      laboratories: {
        available: { type: Boolean, default: true },
        details: { type: String, default: 'High performance computing labs, domain-specific engineering workshops.' },
      },
      computerLabs: {
        available: { type: Boolean, default: true },
        systemsCount: { type: Number, default: 800 },
      },
      transport: {
        available: { type: Boolean, default: true },
        busRoutes: { type: Number, default: 25 },
        areasCovered: [{ type: String }],
      },
      sports: {
        available: { type: Boolean, default: true },
        facilities: [{ type: String }],
      },
      gym: {
        available: { type: Boolean, default: true },
      },
      auditorium: {
        available: { type: Boolean, default: true },
        capacity: { type: Number, default: 1500 },
      },
      canteen: {
        available: { type: Boolean, default: true },
      },
      medicalCentre: {
        available: { type: Boolean, default: true },
      },
      bankAtm: {
        available: { type: Boolean, default: true },
      },
      stationery: {
        available: { type: Boolean, default: true },
      },
      innovationCentre: {
        available: { type: Boolean, default: true },
      },
      researchCentre: {
        available: { type: Boolean, default: true },
      },
      incubationCentre: {
        available: { type: Boolean, default: true },
      },
      placementCell: {
        available: { type: Boolean, default: true },
      },
      security24x7: {
        available: { type: Boolean, default: true },
      },
      wifi: {
        available: { type: Boolean, default: true },
        speedMbps: { type: Number, default: 200 },
      },
    },

    // Student Campus Life
    campusLife: {
      clubs: [{ type: String }],
      technicalClubs: [{ type: String }],
      culturalClubs: [{ type: String }],
      sports: [{ type: String }],
      nss: { type: Boolean, default: true },
      ncc: { type: Boolean, default: false },
      hackathons: [{ type: String }],
      events: [{ type: String }],
    },

    // Research & Innovation
    research: {
      researchCentres: [{ type: String }],
      researchAreas: [{ type: String }],
      fundedProjectsCount: { type: Number, default: 0 },
      patentsCount: { type: Number, default: 0 },
      publicationsCount: { type: Number, default: 0 },
      incubationCentre: { type: String, default: '' },
    },

    // Future-Ready Fees Structure (Marked Coming Soon in UI)
    fees: {
      isComingSoon: { type: Boolean, default: true },
      tuitionFeePerYear: { type: Number, default: 55000 },
      hostelFeePerYear: { type: Number, default: 65000 },
      transportFeePerYear: { type: Number, default: 25000 },
      examinationFeePerYear: { type: Number, default: 5000 },
      govtQuotaEstimatedFee: { type: Number, default: 55000 },
      mgmtQuotaEstimatedFee: { type: Number, default: 135000 },
    },

    // Data Provenance & Verification
    educationBranch: {
      type: String,
      default: 'Engineering',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['OFFICIAL', 'COLLEGE_OFFICIAL', 'IMPORTED', 'DEMO', 'UNVERIFIED'],
      default: 'OFFICIAL',
      index: true,
    },
    dataCompleteness: {
      type: Number,
      default: 85,
    },
    source: {
      type: String,
      default: 'Directorate of Technical Education (DOTE) / TNEA Official Info Booklet',
    },
    sourceUrl: {
      type: String,
      default: 'https://www.tneaonline.org',
    },
    lastVerified: {
      type: Date,
      default: Date.now,
    },
    demoData: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Search text index on name, code, district, city, shortName
tneaCollegeSchema.index({ name: 'text', code: 'text', district: 'text', city: 'text', shortName: 'text' });
tneaCollegeSchema.index({ district: 1, collegeType: 1 });
tneaCollegeSchema.index({ dataCompleteness: -1 });

const TneaCollege = mongoose.model('TneaCollege', tneaCollegeSchema);
export default TneaCollege;
