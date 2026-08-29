import mongoose from 'mongoose';

const completedCourseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 3,
    },
    grade: {
      type: String,
      default: 'A',
    },
    semesterCompleted: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Please provide student ID'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    currentSemester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      default: 5,
    },
    batch: {
      type: String,
      default: '2022-2026',
    },
    totalDegreeCredits: {
      type: Number,
      default: 160,
    },
    completedCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedCourses: [completedCourseSchema],
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Graduated'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to calculate completedCredits from completedCourses if updated
studentSchema.pre('save', function (next) {
  if (this.isModified('completedCourses') && this.completedCourses.length > 0) {
    const sumCredits = this.completedCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0);
    this.completedCredits = sumCredits;
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
