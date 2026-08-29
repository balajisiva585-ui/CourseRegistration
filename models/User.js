const mongoose = require("mongoose");
module.exports = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "faculty"], default: "student" },
  studentId: String,
  department: String,
  semester: Number,
  completedCourses: [String],
  creditLimit: { type: Number, default: 24 }
}, { timestamps: true }));
