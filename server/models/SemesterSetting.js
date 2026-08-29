import mongoose from 'mongoose';

const semesterSettingSchema = new mongoose.Schema(
  {
    semesterName: {
      type: String,
      required: true,
      default: 'Fall 2026 (Semester 5)',
    },
    academicYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
    currentSemesterNumber: {
      type: Number,
      default: 5,
    },
    maxCreditLimit: {
      type: Number,
      required: true,
      default: 24,
    },
    minCreditLimit: {
      type: Number,
      default: 12,
    },
    registrationStartDate: {
      type: Date,
      default: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    registrationEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    allowDropPeriod: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SemesterSetting = mongoose.model('SemesterSetting', semesterSettingSchema);
export default SemesterSetting;
