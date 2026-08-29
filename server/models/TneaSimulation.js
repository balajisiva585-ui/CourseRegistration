import mongoose from 'mongoose';
import crypto from 'crypto';

const preferenceChoiceSchema = new mongoose.Schema(
  {
    priority: {
      type: Number,
      required: true,
    },
    collegeCode: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: '',
    },
    collegeType: {
      type: String,
      default: 'Autonomous',
    },
    departmentCode: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
    },
    quota: {
      type: String,
      default: 'Government',
    },
  },
  { _id: false }
);

const simulationResultItemSchema = new mongoose.Schema(
  {
    priority: {
      type: Number,
      required: true,
    },
    collegeCode: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: '',
    },
    collegeType: {
      type: String,
      default: 'Autonomous',
    },
    departmentCode: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
    },
    quota: {
      type: String,
      default: 'Government',
    },
    predictionTier: {
      type: String,
      enum: ['Likely', 'Possible', 'Reach', 'Unlikely'],
      required: true,
    },
    studentCutoff: {
      type: Number,
      required: true,
    },
    historicalCutoff: {
      type: Number,
      required: true,
    },
    difference: {
      type: Number,
      required: true,
    },
    community: {
      type: String,
      required: true,
    },
    availableSeats: {
      type: Number,
      default: 0,
    },
    totalSeats: {
      type: Number,
      default: 0,
    },
    seatStatus: {
      type: String,
      default: 'Available',
    },
    dataConfidence: {
      type: String,
      enum: ['High', 'Medium', 'Limited'],
      default: 'Medium',
    },
    fiveYearHistory: [
      {
        year: Number,
        cutoff: Number,
      },
    ],
    fiveYearAverage: {
      type: Number,
      default: 0,
    },
    trend: {
      type: String,
      enum: ['Increasing', 'Decreasing', 'Stable', 'Insufficient Data'],
      default: 'Stable',
    },
    highestCutoff: Number,
    lowestCutoff: Number,
    reasons: [String],
  },
  { _id: false }
);

const tneaSimulationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    shareId: {
      type: String,
      default: () => crypto.randomBytes(6).toString('hex'),
      unique: true,
      index: true,
    },
    simulationTitle: {
      type: String,
      default: 'My TNEA Plan',
    },
    academicYear: {
      type: Number,
      default: 2025,
    },
    counsellingRound: {
      type: String,
      default: 'Round 1',
    },
    academicDetails: {
      mathsMarks: { type: Number, default: 0 },
      physicsMarks: { type: Number, default: 0 },
      chemistryMarks: { type: Number, default: 0 },
      calculatedCutoff: { type: Number, default: 0 },
      manualCutoff: { type: Number, default: 0 },
      effectiveCutoff: { type: Number, required: true },
    },
    community: {
      type: String,
      enum: ['OC', 'BC', 'BCM', 'MBC/DNC', 'SC', 'SCA', 'ST'],
      required: true,
      default: 'BC',
    },
    specialReservation: {
      type: String,
      default: 'None',
    },
    ranks: {
      overallRank: { type: Number, default: null },
      communityRank: { type: Number, default: null },
      specialRank: { type: Number, default: null },
    },
    preferences: [preferenceChoiceSchema],
    results: [simulationResultItemSchema],
    highestRecommendedChoice: {
      type: Object,
      default: null,
    },
    summaryCounts: {
      likelyCount: { type: Number, default: 0 },
      possibleCount: { type: Number, default: 0 },
      reachCount: { type: Number, default: 0 },
      unlikelyCount: { type: Number, default: 0 },
    },
    dataVersion: {
      type: String,
      default: 'v2.0-tnea-2025',
    },
  },
  {
    timestamps: true,
  }
);

const TneaSimulation = mongoose.model('TneaSimulation', tneaSimulationSchema);
export default TneaSimulation;
