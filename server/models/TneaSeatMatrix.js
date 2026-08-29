import mongoose from 'mongoose';

const categorySeatSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['OC', 'BC', 'BCM', 'MBC/DNC', 'SC', 'SCA', 'ST', 'Management', 'NRI', 'Sports', 'Special', 'Other'],
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 0,
    },
    filledSeats: {
      type: Number,
      required: true,
      default: 0,
    },
    availableSeats: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const tneaSeatMatrixSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TneaCollege',
    },
    collegeCode: {
      type: String,
      required: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
      index: true,
    },
    district: {
      type: String,
      default: '',
      index: true,
    },
    departmentCode: {
      type: String,
      required: true,
      index: true,
    },
    departmentName: {
      type: String,
      required: true,
    },
    academicYear: {
      type: Number,
      required: true,
      default: 2025,
      index: true,
    },
    round: {
      type: String,
      enum: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'General', 'Final'],
      default: 'Round 1',
      index: true,
    },
    quota: {
      type: String,
      enum: ['Government', 'Management', 'Overall', 'NRI', 'Sports', 'Special', 'Other'],
      default: 'Government',
      index: true,
    },
    categories: [categorySeatSchema],
    totalIntake: {
      type: Number,
      required: true,
      default: 60,
    },
    totalFilled: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAvailable: {
      type: Number,
      required: true,
      default: 60,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // Data Provenance & Source Metadata
    source: {
      type: String,
      default: 'TNEA Directorate of Technical Education (DOTE)',
    },
    sourceUrl: {
      type: String,
      default: 'https://www.tneaonline.org',
    },
    dataType: {
      type: String,
      enum: ['OFFICIAL', 'COLLEGE_OFFICIAL', 'DEMO', 'IMPORTED', 'UNVERIFIED'],
      default: 'OFFICIAL',
      index: true,
    },
    demoData: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
tneaSeatMatrixSchema.index({ collegeCode: 1, departmentCode: 1, academicYear: 1, round: 1, quota: 1 });
tneaSeatMatrixSchema.index({ academicYear: 1, dataType: 1 });

const TneaSeatMatrix = mongoose.model('TneaSeatMatrix', tneaSeatMatrixSchema);
export default TneaSeatMatrix;
