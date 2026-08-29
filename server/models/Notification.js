import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'ADMIN', 'FACULTY', 'ALL'],
      default: 'STUDENT',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'REGISTRATION_SUCCESS',
        'COURSE_DROPPED',
        'COURSE_FULL',
        'SCHEDULE_CONFLICT',
        'PREREQ_WARNING',
        'CREDIT_LIMIT',
        'SYSTEM',
        'DEADLINE',
      ],
      default: 'SYSTEM',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
