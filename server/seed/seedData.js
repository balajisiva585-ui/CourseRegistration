import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import SemesterSetting from '../models/SemesterSetting.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { seedTneaData } from './tneaSeedData.js';

export const seedDatabase = async () => {
  try {
    console.log('--- Starting Database Seeding ---');

    // Clean existing records
    await User.deleteMany({});
    await Department.deleteMany({});
    await Faculty.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    await Registration.deleteMany({});
    await SemesterSetting.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});

    // 1. Create Departments
    const deptAIDS = await Department.create({
      departmentId: 'DEP-AIDS',
      name: 'AI & Data Science',
      code: 'AIDS',
      headOfDepartment: 'Dr. Alan Turing',
      description: 'Cutting-edge artificial intelligence, machine learning, and big data systems.',
    });

    const deptCS = await Department.create({
      departmentId: 'DEP-CS',
      name: 'Computer Science',
      code: 'CS',
      headOfDepartment: 'Dr. Grace Hopper',
      description: 'Foundations of computing, software engineering, and systems design.',
    });

    const deptIT = await Department.create({
      departmentId: 'DEP-IT',
      name: 'Information Technology',
      code: 'IT',
      headOfDepartment: 'Dr. Tim Berners-Lee',
      description: 'Network engineering, enterprise cloud solutions, and cyber defense.',
    });

    const deptECE = await Department.create({
      departmentId: 'DEP-ECE',
      name: 'Electronics & Communication',
      code: 'ECE',
      headOfDepartment: 'Dr. Claude Shannon',
      description: 'Signal processing, microelectronics, and embedded communication systems.',
    });

    // 2. Create Users & Faculty
    const adminPassword = 'Admin@123';
    const facultyPassword = 'Faculty@123';
    const studentPassword = 'Student@123';

    // Admin User
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance (Admin)',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    });

    // Faculty User 1
    const facultyUser1 = await User.create({
      name: 'Prof. Demo Faculty',
      email: 'faculty@example.com',
      password: facultyPassword,
      role: 'FACULTY',
    });

    const faculty1 = await Faculty.create({
      facultyId: 'FAC001',
      user: facultyUser1._id,
      name: 'Prof. Demo Faculty',
      email: 'faculty@example.com',
      phone: '+1 (555) 234-5678',
      department: deptAIDS._id,
      specialization: 'Deep Learning & Neural Networks',
      officeRoom: 'AI Center B-304',
    });

    facultyUser1.facultyProfile = faculty1._id;
    await facultyUser1.save();

    // Faculty User 2
    const facultyUser2 = await User.create({
      name: 'Dr. Robert Davis',
      email: 'faculty2@example.com',
      password: facultyPassword,
      role: 'FACULTY',
    });

    const faculty2 = await Faculty.create({
      facultyId: 'FAC002',
      user: facultyUser2._id,
      name: 'Dr. Robert Davis',
      email: 'faculty2@example.com',
      phone: '+1 (555) 345-6789',
      department: deptCS._id,
      specialization: 'Distributed Systems & Database Internals',
      officeRoom: 'Tech Block A-112',
    });

    facultyUser2.facultyProfile = faculty2._id;
    await facultyUser2.save();

    // Faculty User 3
    const facultyUser3 = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'faculty3@example.com',
      password: facultyPassword,
      role: 'FACULTY',
    });

    const faculty3 = await Faculty.create({
      facultyId: 'FAC003',
      user: facultyUser3._id,
      name: 'Dr. Sarah Jenkins',
      email: 'faculty3@example.com',
      phone: '+1 (555) 456-7890',
      department: deptIT._id,
      specialization: 'Cloud Security & DevSecOps',
      officeRoom: 'Cyber Wing C-102',
    });

    facultyUser3.facultyProfile = faculty3._id;
    await facultyUser3.save();

    // 3. Create Students
    // Student 1 (Main Demo Student)
    const studentUser1 = await User.create({
      name: 'Demo Student',
      email: 'student@example.com',
      password: studentPassword,
      role: 'STUDENT',
    });

    const student1CompletedCourses = [
      { courseCode: 'CS101', courseName: 'Programming Fundamentals', credits: 4, grade: 'A', semesterCompleted: 1 },
      { courseCode: 'CS102', courseName: 'Discrete Mathematics', credits: 4, grade: 'A-', semesterCompleted: 1 },
      { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', credits: 4, grade: 'A+', semesterCompleted: 2 },
      { courseCode: 'CS202', courseName: 'Computer Organization & Architecture', credits: 4, grade: 'B+', semesterCompleted: 2 },
      { courseCode: 'CS301', courseName: 'Object-Oriented Programming (Java/C++)', credits: 4, grade: 'A', semesterCompleted: 3 },
      { courseCode: 'CS302', courseName: 'Operating Systems', credits: 4, grade: 'A-', semesterCompleted: 3 },
      { courseCode: 'CS303', courseName: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', semesterCompleted: 3 },
      { courseCode: 'CS304', courseName: 'Theory of Computation', credits: 4, grade: 'B', semesterCompleted: 3 },
      { courseCode: 'MA201', courseName: 'Probability & Statistics for Computing', credits: 4, grade: 'A+', semesterCompleted: 4 },
      { courseCode: 'CS401', courseName: 'Software Engineering & Design Patterns', credits: 4, grade: 'A', semesterCompleted: 4 },
      { courseCode: 'CS402', courseName: 'Computer Networks', credits: 4, grade: 'A', semesterCompleted: 4 },
      { courseCode: 'CS403', courseName: 'Database Management Systems', credits: 4, grade: 'A+', semesterCompleted: 4 },
    ];

    const student1 = await Student.create({
      studentId: 'STU001',
      user: studentUser1._id,
      name: 'Demo Student',
      email: 'student@example.com',
      phone: '+1 (555) 987-6543',
      department: deptAIDS._id,
      currentSemester: 5,
      batch: '2022-2026',
      totalDegreeCredits: 160,
      completedCredits: 48,
      completedCourses: student1CompletedCourses,
      status: 'Active',
    });

    studentUser1.studentProfile = student1._id;
    await studentUser1.save();

    // Student 2
    const studentUser2 = await User.create({
      name: 'Elena Rostova',
      email: 'student2@example.com',
      password: studentPassword,
      role: 'STUDENT',
    });

    const student2 = await Student.create({
      studentId: 'STU002',
      user: studentUser2._id,
      name: 'Elena Rostova',
      email: 'student2@example.com',
      phone: '+1 (555) 876-5432',
      department: deptCS._id,
      currentSemester: 5,
      batch: '2022-2026',
      totalDegreeCredits: 160,
      completedCredits: 48,
      completedCourses: student1CompletedCourses,
      status: 'Active',
    });

    studentUser2.studentProfile = student2._id;
    await studentUser2.save();

    // 4. Create Courses
    const courseCS501 = await Course.create({
      courseCode: 'CS501',
      courseName: 'Machine Learning',
      description: 'Supervised and unsupervised learning, regression, classification, clustering, model evaluation, and foundational neural networks with practical Python toolkits.',
      department: deptAIDS._id,
      faculty: faculty1._id,
      facultyName: 'Prof. Demo Faculty',
      credits: 4,
      semester: 5,
      courseType: 'Core',
      capacity: 60,
      enrolledCount: 48,
      availableSeats: 12,
      prerequisiteCodes: ['CS201', 'MA201', 'CS403'],
      schedules: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:30' },
      ],
      room: 'Hall A-101',
      status: 'Active',
    });

    const courseCS502 = await Course.create({
      courseCode: 'CS502',
      courseName: 'Advanced Database Management',
      description: 'Transaction management, ACID properties, query optimization, indexing strategies, distributed databases, NoSQL stores, and database replication.',
      department: deptCS._id,
      faculty: faculty2._id,
      facultyName: 'Dr. Robert Davis',
      credits: 4,
      semester: 5,
      courseType: 'Core',
      capacity: 60,
      enrolledCount: 58,
      availableSeats: 2,
      prerequisiteCodes: ['CS403'],
      schedules: [
        { day: 'Monday', startTime: '11:00', endTime: '12:30' },
        { day: 'Wednesday', startTime: '11:00', endTime: '12:30' },
      ],
      room: 'Lab 3',
      status: 'Active',
    });

    const courseCS503 = await Course.create({
      courseCode: 'CS503',
      courseName: 'Cloud Computing Architecture',
      description: 'Cloud service models (IaaS, PaaS, SaaS), virtualization, container orchestration with Kubernetes, serverless paradigms, and distributed cloud storage.',
      department: deptIT._id,
      faculty: faculty3._id,
      facultyName: 'Dr. Sarah Jenkins',
      credits: 3,
      semester: 5,
      courseType: 'Elective',
      capacity: 50,
      enrolledCount: 25,
      availableSeats: 25,
      prerequisiteCodes: ['CS402'],
      schedules: [
        { day: 'Tuesday', startTime: '09:00', endTime: '10:30' },
        { day: 'Thursday', startTime: '09:00', endTime: '10:30' },
      ],
      room: 'Hall B-202',
      status: 'Active',
    });

    const courseCS504 = await Course.create({
      courseCode: 'CS504',
      courseName: 'Deep Learning & Computer Vision',
      description: 'Convolutional neural networks, recurrent architectures, transformers, GANs, transfer learning, and computer vision algorithms using PyTorch.',
      department: deptAIDS._id,
      faculty: faculty1._id,
      facultyName: 'Prof. Demo Faculty',
      credits: 4,
      semester: 5,
      courseType: 'Elective',
      capacity: 40,
      enrolledCount: 32,
      availableSeats: 8,
      prerequisiteCodes: ['CS501'], // Note: requires CS501
      schedules: [
        { day: 'Tuesday', startTime: '11:00', endTime: '12:30' },
        { day: 'Thursday', startTime: '11:00', endTime: '12:30' },
      ],
      room: 'AI Research Lab 1',
      status: 'Active',
    });

    const courseCS505 = await Course.create({
      courseCode: 'CS505',
      courseName: 'Data Mining & Business Analytics',
      description: 'Frequent itemset mining, association rule learning, anomaly detection, stream mining, and business intelligence dashboards.',
      department: deptAIDS._id,
      faculty: faculty1._id,
      facultyName: 'Prof. Demo Faculty',
      credits: 3,
      semester: 5,
      courseType: 'Elective',
      capacity: 45,
      enrolledCount: 45,
      availableSeats: 0,
      prerequisiteCodes: ['CS403', 'MA201'],
      schedules: [{ day: 'Friday', startTime: '09:00', endTime: '11:00' }],
      room: 'Hall C-104',
      status: 'Full',
    });

    const courseCS506 = await Course.create({
      courseCode: 'CS506',
      courseName: 'Quantum Computing Fundamentals',
      description: 'Qubits, quantum superposition, entanglement, quantum gates, Shor algorithm, Grover search, and IBM Qiskit programming.',
      department: deptCS._id,
      faculty: faculty2._id,
      facultyName: 'Dr. Robert Davis',
      credits: 4,
      semester: 6,
      courseType: 'Elective',
      capacity: 30,
      enrolledCount: 10,
      availableSeats: 20,
      prerequisiteCodes: ['ADV999'], // Missing prereq for testing
      schedules: [{ day: 'Monday', startTime: '09:00', endTime: '10:30' }], // Conflicting time slot with CS501
      room: 'Physics Hall 2',
      status: 'Active',
    });

    const courseCS507 = await Course.create({
      courseCode: 'CS507',
      courseName: 'Information & Cyber Security',
      description: 'Symmetric & asymmetric cryptography, PKI, firewall design, intrusion detection, penetration testing, and secure software development lifecycles.',
      department: deptIT._id,
      faculty: faculty3._id,
      facultyName: 'Dr. Sarah Jenkins',
      credits: 3,
      semester: 5,
      courseType: 'Core',
      capacity: 55,
      enrolledCount: 30,
      availableSeats: 25,
      prerequisiteCodes: ['CS402'],
      schedules: [
        { day: 'Wednesday', startTime: '14:00', endTime: '15:30' },
        { day: 'Friday', startTime: '14:00', endTime: '15:30' },
      ],
      room: 'Cyber Security Center',
      status: 'Active',
    });

    const courseCS508 = await Course.create({
      courseCode: 'CS508',
      courseName: 'AI in Healthcare & Biomedical Systems',
      description: 'Medical imaging analysis, clinical NLP for health records, predictive health modeling, genomic sequence analysis, and bioethics.',
      department: deptAIDS._id,
      faculty: faculty1._id,
      facultyName: 'Prof. Demo Faculty',
      credits: 3,
      semester: 5,
      courseType: 'Seminar',
      capacity: 35,
      enrolledCount: 15,
      availableSeats: 20,
      prerequisiteCodes: ['CS201'],
      schedules: [{ day: 'Thursday', startTime: '14:00', endTime: '16:00' }],
      room: 'Biotech Auditorium',
      status: 'Active',
    });

    const courseCS509 = await Course.create({
      courseCode: 'CS509',
      courseName: 'Distributed Systems & Microservices',
      description: 'Consensus protocols (Raft, Paxos), CAP theorem, RPC frameworks (gRPC), message queues (Kafka, RabbitMQ), and high-availability design.',
      department: deptCS._id,
      faculty: faculty2._id,
      facultyName: 'Dr. Robert Davis',
      credits: 4,
      semester: 5,
      courseType: 'Core',
      capacity: 50,
      enrolledCount: 22,
      availableSeats: 28,
      prerequisiteCodes: ['CS302', 'CS402'],
      schedules: [
        { day: 'Tuesday', startTime: '14:00', endTime: '15:30' },
        { day: 'Thursday', startTime: '14:00', endTime: '15:30' },
      ],
      room: 'Systems Lab 2',
      status: 'Active',
    });

    const courseCS510 = await Course.create({
      courseCode: 'CS510',
      courseName: 'Natural Language Processing',
      description: 'Tokenization, word embeddings, transformer architectures (BERT, GPT), named entity recognition, sentiment analysis, and conversational AI.',
      department: deptAIDS._id,
      faculty: faculty1._id,
      facultyName: 'Prof. Demo Faculty',
      credits: 4,
      semester: 6,
      courseType: 'Elective',
      capacity: 40,
      enrolledCount: 18,
      availableSeats: 22,
      prerequisiteCodes: ['CS201', 'MA201'],
      schedules: [{ day: 'Friday', startTime: '11:00', endTime: '13:00' }],
      room: 'AI Research Lab 2',
      status: 'Active',
    });

    // Update faculty assigned courses
    faculty1.assignedCourses = [courseCS501._id, courseCS504._id, courseCS505._id, courseCS508._id, courseCS510._id];
    await faculty1.save();

    faculty2.assignedCourses = [courseCS502._id, courseCS506._id, courseCS509._id];
    await faculty2.save();

    faculty3.assignedCourses = [courseCS503._id, courseCS507._id];
    await faculty3.save();

    // 5. Create Active Semester Setting
    await SemesterSetting.create({
      semesterName: 'Fall 2026 (Semester 5)',
      academicYear: '2025-2026',
      currentSemesterNumber: 5,
      maxCreditLimit: 24,
      minCreditLimit: 12,
      registrationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      registrationEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      isRegistrationOpen: true,
      allowDropPeriod: true,
    });

    // 6. Pre-seed Sample Registrations for Student 1
    // Let's register student 1 in CS501 (Machine Learning, 4cr) and CS502 (Advanced DBMS, 4cr)
    const reg1 = await Registration.create({
      registrationId: 'REG-2026-0001',
      student: student1._id,
      course: courseCS501._id,
      semester: 5,
      academicYear: '2025-2026',
      registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Registered',
    });

    const reg2 = await Registration.create({
      registrationId: 'REG-2026-0002',
      student: student1._id,
      course: courseCS502._id,
      semester: 5,
      academicYear: '2025-2026',
      registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'Registered',
    });

    // Sample dropped registration in history
    await Registration.create({
      registrationId: 'REG-2026-0003',
      student: student1._id,
      course: courseCS507._id,
      semester: 5,
      academicYear: '2025-2026',
      registrationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: 'Dropped',
      dropDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dropReason: 'Schedule adjustment for lab session preference',
    });

    // 7. Seed Notifications
    await Notification.create([
      {
        recipient: studentUser1._id,
        role: 'STUDENT',
        title: 'Fall 2026 Registration Open',
        message: 'The course registration portal for Fall 2026 is officially open. Max credit limit: 24 credits.',
        type: 'SYSTEM',
        isRead: true,
      },
      {
        recipient: studentUser1._id,
        role: 'STUDENT',
        title: 'Registration Confirmed: CS501',
        message: 'Successfully registered for CS501 Machine Learning (4 Credits). Room: Hall A-101.',
        type: 'REGISTRATION_SUCCESS',
        isRead: false,
      },
      {
        recipient: studentUser1._id,
        role: 'STUDENT',
        title: 'Registration Confirmed: CS502',
        message: 'Successfully registered for CS502 Advanced Database Management (4 Credits). Room: Lab 3.',
        type: 'REGISTRATION_SUCCESS',
        isRead: false,
      },
      {
        recipient: adminUser._id,
        role: 'ADMIN',
        title: 'Course Capacity Alert',
        message: 'CS505 Data Mining & Business Analytics has reached maximum capacity (45/45).',
        type: 'COURSE_FULL',
        isRead: false,
      },
    ]);

    // 8. Seed Audit Logs
    await AuditLog.create([
      {
        user: adminUser._id,
        userName: adminUser.name,
        userRole: 'ADMIN',
        action: 'SEMESTER_SETTINGS_UPDATED',
        module: 'SETTINGS',
        details: 'Configured Fall 2026 registration window and max 24 credit limit.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: studentUser1._id,
        userName: studentUser1.name,
        userRole: 'STUDENT',
        action: 'COURSE_REGISTERED',
        module: 'REGISTRATION',
        recordId: reg1._id.toString(),
        details: 'Registered for CS501 Machine Learning (4 Credits)',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: studentUser1._id,
        userName: studentUser1.name,
        userRole: 'STUDENT',
        action: 'COURSE_REGISTERED',
        module: 'REGISTRATION',
        recordId: reg2._id.toString(),
        details: 'Registered for CS502 Advanced Database Management (4 Credits)',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Seed Tamil Nadu Engineering Colleges Hub data
    await seedTneaData();

    console.log('--- Database Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
