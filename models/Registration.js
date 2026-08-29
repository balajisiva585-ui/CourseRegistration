const mongoose = require("mongoose");
module.exports = mongoose.model("Registration", new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  status: { type: String, enum: ["Registered", "Dropped", "Completed"], default: "Registered" }
}, { timestamps: true }));
