import mongoose from 'mongoose';

const tneaFeeSchema = new mongoose.Schema(
  {
    academicYear: {
      type: Number,
      required: true,
      default: 2025,
      index: true,
    },
    collegeCode: {
      type: String,
      required: true,
      index: true,
    },
    branchCode: {
      type: String,
      default: 'ALL',
      index: true,
    },
    tuitionFee: {
      type: Number,
      default: null,
    },
    developmentFee: {
      type: Number,
      default: null,
    },
    otherFee: {
      type: Number,
      default: null,
    },
    hostelFee: {
      type: Number,
      default: null,
    },
    totalFee: {
      type: Number,
      default: null,
    },
    sourceName: {
      type: String,
      default: 'Fee Fixation Committee / Institutional Mandatory Disclosure',
    },
    sourceUrl: {
      type: String,
      default: 'https://www.tneaonline.org',
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
  }
);

tneaFeeSchema.index({ collegeCode: 1, branchCode: 1, academicYear: 1 }, { unique: true });

const TneaFee = mongoose.model('TneaFee', tneaFeeSchema);
export default TneaFee;
