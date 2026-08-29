import mongoose from 'mongoose';

const tneaCutoffSchema = new mongoose.Schema(
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
      enum: ['Government', 'Management', 'Other'],
      default: 'Government',
    },
    // Category Cutoffs (out of 200)
    ocCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    bcCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    bcmCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    mbcCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    scCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    scaCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    stCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    openingRank: {
      type: Number,
      default: 1,
    },
    closingRank: {
      type: Number,
      default: 10000,
    },
    // Data Provenance & Provenance Tracking
    source: {
      type: String,
      default: 'TNEA Official DOTE Counselling Archive',
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

// Compound index for fast queries
tneaCutoffSchema.index({ collegeCode: 1, departmentCode: 1, academicYear: 1, round: 1 }, { unique: false });
tneaCutoffSchema.index({ academicYear: 1, dataType: 1 });

const TneaCutoff = mongoose.model('TneaCutoff', tneaCutoffSchema);
export default TneaCutoff;
