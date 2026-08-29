import mongoose from 'mongoose';

const tneaApplicationSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    academicYear: {
      type: Number,
      default: 2025,
    },
    status: {
      type: String,
      enum: ['Open', 'Closing Soon', 'Closed', 'Upcoming'],
      default: 'Open',
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    closingDate: {
      type: Date,
    },
    applicationLink: {
      type: String,
      required: true,
    },
    applicationType: {
      type: String,
      enum: ['TNEA Counselling', 'Management Quota Direct', 'Lateral Entry', 'NRI Quota', 'Sports Quota'],
      default: 'TNEA Counselling',
    },
    eligibility: {
      type: String,
      default: 'Passed +2 Board exams with Physics, Chemistry & Maths.',
    },
    requiredDocuments: [
      {
        type: String,
      },
    ],
    applicationFee: {
      type: Number,
      default: 500,
    },
    contactHelpdesk: {
      type: String,
      default: '',
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

const TneaApplication = mongoose.model('TneaApplication', tneaApplicationSchema);
export default TneaApplication;
