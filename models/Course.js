const mongoose = require("mongoose");
module.exports = mongoose.model("Course", new mongoose.Schema({
  courseCode: { type: String, unique: true, required: true },
  courseName: { type: String, required: true },
  description: String,
  department: String,
  faculty: String,
  credits: { type: Number, required: true },
  semester: Number,
  capacity: { type: Number, required: true },
  enrolled: { type: Number, default: 0 },
  prerequisites: [String],
  schedule: {
    day: String,
    startTime: String,
    endTime: String,
    room: String
  }
}, { timestamps: true }));
