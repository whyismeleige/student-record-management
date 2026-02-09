// controllers/student.controller.js
const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const {
  ValidationError,
  NotFoundError,
} = require("../utils/error.utils");

const Student = db.student;

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getAllStudents = asyncHandler(async (req, res) => {
  const {
    grade,
    department,
    status,
    search,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 50,
  } = req.query;

  // Build filter object
  const filter = {};

  if (grade) filter.grade = grade;
  if (department) filter.department = department;
  if (status) filter.status = status;

  // Search by name, email, or student ID
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Sort
  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  // Execute query
  const students = await Student.find(filter)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip)
    .populate("createdBy", "name email");

  // Get total count for pagination
  const total = await Student.countDocuments(filter);

  res.status(200).send({
    message: "Students retrieved successfully",
    type: "success",
    data: {
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    },
  });
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id).populate("createdBy", "name email");

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  res.status(200).send({
    message: "Student retrieved successfully",
    type: "success",
    data: { student },
  });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    studentId,
    email,
    phone,
    dateOfBirth,
    gender,
    grade,
    department,
    enrollmentYear,
    gpa,
    attendanceStatus,
    attendancePercentage,
    guardianName,
    guardianPhone,
    guardianEmail,
    address,
    notes,
    status,
  } = req.body;

  // Validation
  if (!name || !studentId || !email || !grade || !department || !enrollmentYear) {
    throw new ValidationError(
      "Please provide name, studentId, email, grade, department, and enrollmentYear"
    );
  }

  // Check if student ID already exists
  const existingStudent = await Student.findOne({ studentId });
  if (existingStudent) {
    throw new ValidationError("Student ID already exists");
  }

  // Check if email already exists
  const existingEmail = await Student.findOne({ email });
  if (existingEmail) {
    throw new ValidationError("Email already exists");
  }

  // Create student
  const student = await Student.create({
    name,
    studentId,
    email,
    phone,
    dateOfBirth,
    gender,
    grade,
    department,
    enrollmentYear,
    gpa: gpa || 0,
    attendanceStatus: attendanceStatus || "Present",
    attendancePercentage: attendancePercentage || 100,
    guardianName,
    guardianPhone,
    guardianEmail,
    address,
    notes,
    status: status || "Active",
    createdBy: req.user._id, // From auth middleware
  });

  res.status(201).send({
    message: "Student created successfully",
    type: "success",
    data: { student },
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Check if studentId is being changed and if it already exists
  if (req.body.studentId && req.body.studentId !== student.studentId) {
    const existingStudent = await Student.findOne({
      studentId: req.body.studentId,
    });
    if (existingStudent) {
      throw new ValidationError("Student ID already exists");
    }
  }

  // Check if email is being changed and if it already exists
  if (req.body.email && req.body.email !== student.email) {
    const existingEmail = await Student.findOne({ email: req.body.email });
    if (existingEmail) {
      throw new ValidationError("Email already exists");
    }
  }

  // Update student
  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).populate("createdBy", "name email");

  res.status(200).send({
    message: "Student updated successfully",
    type: "success",
    data: { student: updatedStudent },
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  await Student.findByIdAndDelete(id);

  res.status(200).send({
    message: "Student deleted successfully",
    type: "success",
    data: null,
  });
});

// @desc    Get statistics
// @route   GET /api/students/stats/overview
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments({ status: "Active" });

  // Grade distribution
  const gradeDistribution = await Student.aggregate([
    { $match: { status: "Active" } },
    { $group: { _id: "$grade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Department distribution
  const departmentDistribution = await Student.aggregate([
    { $match: { status: "Active" } },
    { $group: { _id: "$department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Average GPA
  const gpaStats = await Student.aggregate([
    { $match: { status: "Active" } },
    {
      $group: {
        _id: null,
        avgGPA: { $avg: "$gpa" },
        maxGPA: { $max: "$gpa" },
        minGPA: { $min: "$gpa" },
      },
    },
  ]);

  // Average Attendance
  const attendanceStats = await Student.aggregate([
    { $match: { status: "Active" } },
    {
      $group: {
        _id: null,
        avgAttendance: { $avg: "$attendancePercentage" },
      },
    },
  ]);

  // Attendance status distribution
  const attendanceStatusDistribution = await Student.aggregate([
    { $match: { status: "Active" } },
    { $group: { _id: "$attendanceStatus", count: { $sum: 1 } } },
  ]);

  res.status(200).send({
    message: "Statistics retrieved successfully",
    type: "success",
    data: {
      totalStudents,
      gradeDistribution,
      departmentDistribution,
      gpaStats: gpaStats[0] || { avgGPA: 0, maxGPA: 0, minGPA: 0 },
      attendanceStats: attendanceStats[0] || { avgAttendance: 0 },
      attendanceStatusDistribution,
    },
  });
});

// @desc    Bulk delete students
// @route   POST /api/students/bulk-delete
// @access  Private
exports.bulkDelete = asyncHandler(async (req, res) => {
  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ValidationError("Please provide an array of student IDs");
  }

  const result = await Student.deleteMany({ _id: { $in: studentIds } });

  res.status(200).send({
    message: `${result.deletedCount} students deleted successfully`,
    type: "success",
    data: { deletedCount: result.deletedCount },
  });
});