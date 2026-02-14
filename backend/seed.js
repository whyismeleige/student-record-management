// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../models"); // Ensure this exports { User: ..., Student: ... }

// Config
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const SEED_PASSWORD = "password123";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

// --- Data Constants ---

const FACULTY_NAMES = [
  "Prof. Charles Xavier",
  "Minerva McGonagall",
  "Walter White",
  "Albus Dumbledore",
  "Ross Geller",
  "Edna Krabappel",
];

const STUDENT_DATA = [
  { name: "Harry Potter", id: "STU001", dept: "Science" },
  { name: "Hermione Granger", id: "STU002", dept: "Science" },
  { name: "Ron Weasley", id: "STU003", dept: "Arts" },
  { name: "Arya Stark", id: "STU004", dept: "Social Studies" },
  { name: "Jon Snow", id: "STU005", dept: "History" },
  { name: "Eleven Hopper", id: "STU006", dept: "Psychology" },
  { name: "Peter Parker", id: "STU007", dept: "Physics" },
  { name: "Miles Morales", id: "STU008", dept: "Arts" },
  { name: "Katniss Everdeen", id: "STU009", dept: "Physical Education" },
  { name: "Buffy Summers", id: "STU010", dept: "History" },
];

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
];

const GRADES = ["10th", "11th", "12th"];
const STATUSES = ["Active", "Inactive", "Graduated"];
const ATTENDANCE = ["Present", "Absent", "Late"];

// --- Helpers ---

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomGPA() {
  return parseFloat((Math.random() * (4.0 - 2.0) + 2.0).toFixed(2));
}

// --- Main Seed Function ---

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME || undefined });
    console.log("Connected to MongoDB");

    const User = db.user; // Matches your model export
    const Student = db.student;

    // 1. Clear Database
    await Student.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing users and students");

    // 2. Prepare Faculty/Admins
    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
    const userDocs = [];

    FACULTY_NAMES.forEach((name, index) => {
      userDocs.push({
        name,
        email: `faculty${index + 1}@university.edu`,
        password: hashedPassword,
        role: index === 0 ? "admin" : "faculty", // First user is Admin
        avatar: pick(AVATARS),
      });
    });

    const createdUsers = await User.insertMany(userDocs);
    console.log(`Created ${createdUsers.length} staff members`);

    const faculty = createdUsers.filter((u) => u.role === "faculty");

    // 3. Create Students
    const studentDocs = STUDENT_DATA.map((s) => {
      return {
        name: s.name,
        studentId: s.id,
        email: `${s.name.toLowerCase().replace(" ", ".")}@student.edu`,
        phone: `555-01${Math.floor(10 + Math.random() * 90)}`,
        gender: pick(["Male", "Female", "Other"]),
        grade: pick(GRADES),
        department: s.dept,
        enrollmentYear: 2024,
        gpa: randomGPA(),
        attendanceStatus: pick(ATTENDANCE),
        attendancePercentage: Math.floor(Math.random() * (100 - 75 + 1)) + 75,
        status: pick(STATUSES),
        createdBy: pick(faculty)._id, // Link to a random faculty member
        address: {
          street: "123 Academic Way",
          city: "Scholar City",
          state: "CA",
          zipCode: "90210",
        },
        notes: "Excellent performance in midterms.",
      };
    });

    await Student.insertMany(studentDocs);
    console.log(`Created ${studentDocs.length} students`);

    console.log("\n--- Seed Summary ---");
    console.log(`Admin Login: ${createdUsers[0].email} / ${SEED_PASSWORD}`);
    console.log(`Faculty Login: ${faculty[0].email} / ${SEED_PASSWORD}`);
    console.log("--------------------");

  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();