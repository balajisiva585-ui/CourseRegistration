require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Course = require("./models/Course");
const Registration = require("./models/Registration");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Not authorized" });
    next();
  };
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name, studentId: user.studentId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

app.get("/api/courses", auth, async (req, res) => {
  const { search = "", department = "", semester = "" } = req.query;
  const filter = {};
  if (search) filter.$or = [
    { courseCode: new RegExp(search, "i") },
    { courseName: new RegExp(search, "i") }
  ];
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);
  const courses = await Course.find(filter).sort({ courseCode: 1 });
  res.json(courses);
});

app.post("/api/courses", auth, role("admin"), async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, enrolled: 0 });
    res.status(201).json(course);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.put("/api/courses/:id", auth, role("admin"), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/api/courses/:id", auth, role("admin"), async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
});

function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function conflict(a, b) {
  return a.day === b.day &&
    timeToMin(a.startTime) < timeToMin(b.endTime) &&
    timeToMin(b.startTime) < timeToMin(a.endTime);
}

app.get("/api/registrations/my", auth, role("student"), async (req, res) => {
  const rows = await Registration.find({ student: req.user.id }).populate("course").sort({ createdAt: -1 });
  res.json(rows);
});

app.post("/api/registrations", auth, role("student"), async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = await Registration.findOne({ student: req.user.id, course: courseId, status: "Registered" });
    if (existing) return res.status(400).json({ message: "Course is already registered" });

    if (course.enrolled >= course.capacity) return res.status(400).json({ message: "Course is full" });

    const completed = (student.completedCourses || []).map(String);
    const missing = (course.prerequisites || []).filter(p => !completed.includes(String(p)));
    if (missing.length) return res.status(400).json({ message: "Prerequisite not completed" });

    const current = await Registration.find({ student: req.user.id, status: "Registered" }).populate("course");
    const currentCredits = current.reduce((s, r) => s + (r.course?.credits || 0), 0);
    if (currentCredits + course.credits > (student.creditLimit || 24)) {
      return res.status(400).json({ message: `Credit limit exceeded. Limit: ${student.creditLimit || 24}` });
    }

    if (current.some(r => conflict(r.course.schedule, course.schedule))) {
      return res.status(400).json({ message: "Schedule conflict detected" });
    }

    const registration = await Registration.create({ student: req.user.id, course: courseId, status: "Registered" });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
    res.status(201).json({ message: "Course registered successfully", registration });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/api/registrations/:id", auth, role("student"), async (req, res) => {
  const reg = await Registration.findOne({ _id: req.params.id, student: req.user.id, status: "Registered" });
  if (!reg) return res.status(404).json({ message: "Registration not found" });
  reg.status = "Dropped";
  await reg.save();
  await Course.findByIdAndUpdate(reg.course, { $inc: { enrolled: -1 } });
  res.json({ message: "Course dropped successfully" });
});

app.get("/api/admin/stats", auth, role("admin"), async (req, res) => {
  const [students, faculty, courses, registrations] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "faculty" }),
    Course.countDocuments(),
    Registration.countDocuments({ status: "Registered" })
  ]);
  res.json({ students, faculty, courses, registrations });
});

app.get("/api/admin/registrations", auth, role("admin"), async (req, res) => {
  const rows = await Registration.find().populate("student", "name email studentId").populate("course").sort({ createdAt: -1 });
  res.json(rows);
});

async function seed() {
  const count = await User.countDocuments();
  if (count) return;
  const hash = p => bcrypt.hashSync(p, 10);
  const student = await User.create({
    name: "Demo Student", email: "student@example.com", password: hash("Student@123"),
    role: "student", studentId: "STU001", department: "AI & Data Science",
    semester: 5, completedCourses: [], creditLimit: 24
  });
  await User.create({ name: "Demo Admin", email: "admin@example.com", password: hash("Admin@123"), role: "admin" });
  await User.create({ name: "Demo Faculty", email: "faculty@example.com", password: hash("Faculty@123"), role: "faculty" });

  await Course.insertMany([
    { courseCode: "CS501", courseName: "Machine Learning", description: "Introduction to machine learning concepts.", department: "AI & Data Science", faculty: "Dr. Arun", credits: 4, semester: 5, capacity: 60, enrolled: 0, prerequisites: [], schedule: { day: "Monday", startTime: "09:00", endTime: "10:00", room: "A101" } },
    { courseCode: "CS502", courseName: "Database Management", description: "Database design, SQL and transactions.", department: "AI & Data Science", faculty: "Dr. Priya", credits: 4, semester: 5, capacity: 60, enrolled: 0, prerequisites: [], schedule: { day: "Tuesday", startTime: "10:00", endTime: "11:00", room: "A102" } },
    { courseCode: "CS503", courseName: "Computer Networks", description: "Networking fundamentals and protocols.", department: "Computer Science", faculty: "Dr. Kumar", credits: 3, semester: 5, capacity: 50, enrolled: 0, prerequisites: [], schedule: { day: "Wednesday", startTime: "11:00", endTime: "12:00", room: "B201" } },
    { courseCode: "CS504", courseName: "Cloud Computing", description: "Cloud architecture and services.", department: "Information Technology", faculty: "Dr. Meena", credits: 3, semester: 5, capacity: 50, enrolled: 0, prerequisites: [], schedule: { day: "Thursday", startTime: "14:00", endTime: "15:00", room: "B202" } },
    { courseCode: "CS505", courseName: "Data Mining", description: "Data mining techniques and applications.", department: "AI & Data Science", faculty: "Dr. Ravi", credits: 4, semester: 5, capacity: 40, enrolled: 0, prerequisites: [], schedule: { day: "Friday", startTime: "09:00", endTime: "10:00", room: "C301" } }
  ]);
  console.log("Demo data created. Student:", student.email);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seed();
    app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
