# Smart Course Registration System

## Stack
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- HTML/CSS/JavaScript frontend
- JWT + bcrypt authentication

## Setup

1. Install Node.js.
2. Open this folder in VS Code.
3. Run:
   npm install
4. Copy `.env.example` to `.env`.
5. Put your MongoDB Atlas connection string in `MONGO_URI`.
6. Run:
   npm start
7. Open:
   http://localhost:5000

## Demo accounts

Student:
student@example.com
Student@123

Admin:
admin@example.com
Admin@123

Faculty:
faculty@example.com
Faculty@123

## Main features
- Role-based login
- Course browsing/search
- Prerequisite checking
- Seat availability
- Timetable conflict detection
- Credit limit validation
- Course registration
- Course dropping
- Student timetable
- Admin statistics
- Registration monitoring
- MongoDB persistence

This is a college-project starter implementation. Before production deployment, add stronger validation, rate limiting, secure cookie/token strategy, audit logging, registration-period controls and transactional seat allocation.
