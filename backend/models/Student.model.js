// models/student.model.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
  },
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  
  // Academic Information
  grade: {
    type: String,
    required: [true, "Grade is required"],
    enum: ["10th", "11th", "12th"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true,
  },
  enrollmentYear: {
    type: Number,
    required: [true, "Enrollment year is required"],
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: 0,
  },
  
  // Attendance Information
  attendanceStatus: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Present",
  },
  attendancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  
  // Parent/Guardian Information
  guardianName: {
    type: String,
    trim: true,
  },
  guardianPhone: {
    type: String,
    trim: true,
  },
  guardianEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  
  // Address Information
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  
  // Study Materials / Notes
  notes: {
    type: String,
    default: "",
  },
  
  // Status
  status: {
    type: String,
    enum: ["Active", "Inactive", "Graduated"],
    default: "Active",
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
studentSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// Create indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ grade: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model("Student", studentSchema);