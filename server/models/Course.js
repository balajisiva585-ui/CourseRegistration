import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    startTime: {
      type: String,
      required: true,
      // Format: "HH:MM" e.g., "09:00"
    },
    endTime: {
      type: String,
      required: true,
      // Format: "HH:MM" e.g., "10:30"
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Please provide a course code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: [true, 'Please provide a course name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    facultyName: {
      type: String,
      default: 'To be assigned',
    },
    credits: {
      type: Number,
      required: [true, 'Please specify credit hours'],
      min: 1,
      max: 8,
      default: 3,
    },
    semester: {
      type: Number,
      required: [true, 'Please specify target semester'],
      min: 1,
      max: 8,
      default: 1,
    },
    courseType: {
      type: String,
      enum: ['Core', 'Elective', 'Lab', 'Seminar'],
      default: 'Core',
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 60,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableSeats: {
      type: Number,
      default: 60,
      min: 0,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    prerequisiteCodes: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
    schedules: [scheduleSchema],
    room: {
      type: String,
      default: 'Lecture Hall 101',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Full', 'Archived'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to keep availableSeats synchronized
courseSchema.pre('save', function (next) {
  if (this.isModified('capacity') || this.isModified('enrolledCount')) {
    this.availableSeats = Math.max(0, this.capacity - (this.enrolledCount || 0));
    if (this.availableSeats === 0) {
      this.status = 'Full';
    } else if (this.status === 'Full' && this.availableSeats > 0) {
      this.status = 'Active';
    }
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
