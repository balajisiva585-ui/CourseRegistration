import mongoose from 'mongoose';

const tneaReportSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TneaCollege',
      required: false,
    },
    collegeCode: {
      type: String,
      required: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      enum: [
        'Incorrect Phone Number',
        'Incorrect Email / Website',
        'Incorrect Address / Location',
        'Incorrect Department / Branch',
        'Incorrect Cutoff Marks',
        'Incorrect Seat Information',
        'Incorrect Placement Information',
        'Incorrect Autonomous / Affiliation Status',
        'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    suggestedCorrection: {
      type: String,
      default: '',
      trim: true,
    },
    sourceProofUrl: {
      type: String,
      default: '',
    },
    reporterName: {
      type: String,
      default: 'Anonymous Student',
    },
    reporterEmail: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Verified & Applied', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const TneaReport = mongoose.model('TneaReport', tneaReportSchema);
export default TneaReport;
