import mongoose from 'mongoose';

const tneaSearchAnalyticsSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      trim: true,
    },
    searchType: {
      type: String,
      enum: ['COLLEGE', 'DEPARTMENT', 'DISTRICT', 'CODE', 'PREDICTOR', 'COMPARE'],
      default: 'COLLEGE',
    },
    district: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    collegeCode: {
      type: String,
      default: '',
    },
    userRole: {
      type: String,
      default: 'GUEST',
    },
  },
  {
    timestamps: true,
  }
);

const TneaSearchAnalytics = mongoose.model('TneaSearchAnalytics', tneaSearchAnalyticsSchema);
export default TneaSearchAnalytics;
