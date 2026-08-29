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
  },
  {
    timestamps: true,
  }
);

const TneaDepartment = mongoose.model('TneaDepartment', tneaDepartmentSchema);
export default TneaDepartment;
