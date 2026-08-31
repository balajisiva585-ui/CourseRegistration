import mongoose from 'mongoose';

const tneaDepartmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      index: true,
    },
    degree: {
      type: String,
      enum: ['B.E.', 'B.Tech.', 'M.E.', 'M.Tech.', 'Other'],
      default: 'B.E.',
    },
    category: {
      type: String,
      default: 'Engineering',
      index: true,
    },
    shortName: {
      type: String,
      default: '',
    },
    approvedIntake: {
      type: Number,
      default: 60,
    },
    duration: {
      type: Number,
      default: 4,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    iconName: {
      type: String,
      default: 'Cpu',
    },
    sourceName: {
      type: String,
      default: 'AICTE / Directorate of Technical Education (DOTE)',
    },
    sourceUrl: {
      type: String,
      default: 'https://www.aicte-india.org',
    },
    sourceYear: {
      type: Number,
      default: 2025,
    },
    dataStatus: {
      type: String,
      enum: ['VERIFIED', 'PARTIAL', 'UNAVAILABLE'],
      default: 'VERIFIED',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases
tneaDepartmentSchema.virtual('branchCode').get(function () {
  return this.code;
});
tneaDepartmentSchema.virtual('branchName').get(function () {
  return this.name;
});

const TneaDepartment = mongoose.model('TneaDepartment', tneaDepartmentSchema);
export default TneaDepartment;
