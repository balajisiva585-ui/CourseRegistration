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
    counsellingRound: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1,
      index: true,
    },
    round: {
      type: String,
      enum: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'General', 'Final', '1', '2', '3'],
      default: 'Round 1',
      index: true,
    },
    quota: {
      type: String,
      enum: ['Government', 'Management', 'Other'],
      default: 'Government',
    },
    // Category Cutoffs (out of 200, nullable if unavailable)
    ocCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    bcCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    bcmCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    mbcCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    scCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    scaCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    stCutoff: {
      type: Number,
      default: null,
      min: 0,
      max: 200,
    },
    openingRank: {
      type: Number,
      default: null,
    },
    closingRank: {
      type: Number,
      default: null,
    },
    // Nested Category-wise Cutoff and Rank breakdown
    cutoff: {
      OC: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      BC: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      BCM: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      MBC_DNC: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      SC: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      SCA: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
      ST: { mark: { type: Number, default: null }, rank: { type: Number, default: null }, status: { type: String, default: 'VERIFIED' } },
    },
    // Data Provenance & Provenance Tracking
    sourceName: {
      type: String,
      default: 'TNEA Directorate of Technical Education (DOTE)',
    },
    sourceDocument: {
      type: String,
      default: 'TNEA Official Cutoff Archive',
    },
    sourceYear: {
      type: Number,
      default: 2025,
    },
    dataStatus: {
      type: String,
      enum: ['OFFICIAL', 'SOURCE-BACKED', 'PROJECTED', 'ESTIMATED', 'UNAVAILABLE', 'VERIFIED', 'PARTIAL', 'DEMO'],
      default: 'OFFICIAL',
      index: true,
    },
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
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases
tneaCutoffSchema.virtual('branchCode').get(function () {
  return this.departmentCode;
});
tneaCutoffSchema.virtual('mbcDncCutoff').get(function () {
  return this.mbcCutoff;
});

// Compound indexes for fast multi-dimensional queries
tneaCutoffSchema.index({ academicYear: 1, counsellingRound: 1, collegeCode: 1, departmentCode: 1 }, { unique: true });
tneaCutoffSchema.index({ academicYear: 1, counsellingRound: 1, district: 1, ocCutoff: -1 });
tneaCutoffSchema.index({ academicYear: 1, counsellingRound: 1, ocCutoff: 1 });
tneaCutoffSchema.index({ academicYear: 1, dataStatus: 1 });

const TneaCutoff = mongoose.model('TneaCutoff', tneaCutoffSchema);
export default TneaCutoff;
