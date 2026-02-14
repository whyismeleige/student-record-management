require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
let db_connection = null;

async function connect_database() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");
    db_connection = client.db(process.env.DB_NAME);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

connect_database();

function get_db() {
  if (!db_connection) {
    throw new Error("Database not connected");
  }
  return db_connection;
}

// Auth middleware
function auth_middleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ==================== AUTH ROUTES ====================

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const db = get_db();
    const existing_user = await db.collection("users").findOne({ email: email });

    if (existing_user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const new_user = {
      name: name,
      email: email,
      password: hashed_password,
      role: role || "faculty",
      createdAt: new Date()
    };

    const result = await db.collection("users").insertOne(new_user);

    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: result.insertedId,
        name: new_user.name,
        email: new_user.email,
        role: new_user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const db = get_db();
    const user = await db.collection("users").findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const password_match = await bcrypt.compare(password, user.password);

    if (!password_match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get Profile
app.get("/api/auth/profile", auth_middleware, async (req, res) => {
  try {
    const user_id = req.user_id;
    const db = get_db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile fetched",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Logout
app.post("/api/auth/logout", auth_middleware, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ==================== STUDENT ROUTES ====================

// Get all students
app.get("/api/students", auth_middleware, async (req, res) => {
  try {
    const { grade, department, status, search, sortBy, order, page, limit } = req.query;

    const db = get_db();
    
    let filter = {};

    if (grade) {
      filter.grade = grade;
    }
    
    if (department) {
      filter.department = department;
    }
    
    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } }
      ];
    }

    const sort_field = sortBy || "createdAt";
    const sort_order = order === "asc" ? 1 : -1;
    let sort_options = {};
    sort_options[sort_field] = sort_order;

    const page_num = parseInt(page) || 1;
    const limit_num = parseInt(limit) || 50;
    const skip = (page_num - 1) * limit_num;

    const students = await db.collection("students")
      .find(filter)
      .sort(sort_options)
      .skip(skip)
      .limit(limit_num)
      .toArray();

    const total = await db.collection("students").countDocuments(filter);

    res.json({
      message: "Students fetched",
      students: students,
      total: total,
      page: page_num,
      pages: Math.ceil(total / limit_num)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get student by ID
app.get("/api/students/:id", auth_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = get_db();
    const student = await db.collection("students").findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Student found",
      student: student
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Create student
app.post("/api/students", auth_middleware, async (req, res) => {
  try {
    const {
      name, studentId, email, phone, dateOfBirth, gender,
      grade, department, enrollmentYear, gpa,
      attendanceStatus, attendancePercentage,
      guardianName, guardianPhone, guardianEmail,
      address, notes, status
    } = req.body;

    if (!name || !studentId || !email || !grade || !department || !enrollmentYear) {
      return res.status(400).json({ error: "Please provide required fields" });
    }

    const db = get_db();

    const existing_student = await db.collection("students").findOne({ studentId: studentId });

    if (existing_student) {
      return res.status(400).json({ error: "Student ID already exists" });
    }

    const new_student = {
      name: name,
      studentId: studentId,
      email: email,
      phone: phone || "",
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || "Male",
      grade: grade,
      department: department,
      enrollmentYear: parseInt(enrollmentYear),
      gpa: parseFloat(gpa) || 0,
      attendanceStatus: attendanceStatus || "Present",
      attendancePercentage: parseFloat(attendancePercentage) || 100,
      guardianName: guardianName || "",
      guardianPhone: guardianPhone || "",
      guardianEmail: guardianEmail || "",
      address: address || {},
      notes: notes || "",
      status: status || "Active",
      createdBy: new ObjectId(req.user_id),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("students").insertOne(new_student);

    res.json({
      message: "Student created successfully",
      student: {
        ...new_student,
        _id: result.insertedId
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Update student
app.put("/api/students/:id", auth_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const update_data = req.body;

    const db = get_db();

    const existing_student = await db.collection("students").findOne({ _id: new ObjectId(id) });

    if (!existing_student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (update_data.studentId && update_data.studentId !== existing_student.studentId) {
      const duplicate = await db.collection("students").findOne({ studentId: update_data.studentId });
      
      if (duplicate) {
        return res.status(400).json({ error: "Student ID already exists" });
      }
    }

    if (update_data.dateOfBirth) {
      update_data.dateOfBirth = new Date(update_data.dateOfBirth);
    }

    if (update_data.enrollmentYear) {
      update_data.enrollmentYear = parseInt(update_data.enrollmentYear);
    }

    if (update_data.gpa) {
      update_data.gpa = parseFloat(update_data.gpa);
    }

    if (update_data.attendancePercentage) {
      update_data.attendancePercentage = parseFloat(update_data.attendancePercentage);
    }

    update_data.updatedAt = new Date();

    await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: update_data }
    );

    const updated_student = await db.collection("students").findOne({ _id: new ObjectId(id) });

    res.json({
      message: "Student updated successfully",
      student: updated_student
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete student
app.delete("/api/students/:id", auth_middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = get_db();

    const student = await db.collection("students").findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await db.collection("students").deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Student deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get statistics
app.get("/api/students/stats/overview", auth_middleware, async (req, res) => {
  try {
    const db = get_db();

    const total_students = await db.collection("students").countDocuments();
    const active_students = await db.collection("students").countDocuments({ status: "Active" });
    const grade_10_count = await db.collection("students").countDocuments({ grade: "10th" });
    const grade_11_count = await db.collection("students").countDocuments({ grade: "11th" });
    const grade_12_count = await db.collection("students").countDocuments({ grade: "12th" });
    const present_count = await db.collection("students").countDocuments({ attendanceStatus: "Present" });
    const absent_count = await db.collection("students").countDocuments({ attendanceStatus: "Absent" });

    res.json({
      message: "Stats fetched",
      total: total_students,
      active: active_students,
      grade_10: grade_10_count,
      grade_11: grade_11_count,
      grade_12: grade_12_count,
      present: present_count,
      absent: absent_count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Bulk delete
app.post("/api/students/bulk-delete", auth_middleware, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide student IDs to delete" });
    }

    const db = get_db();
    const object_ids = ids.map(id => new ObjectId(id));

    const result = await db.collection("students").deleteMany({ _id: { $in: object_ids } });

    res.json({
      message: "Students deleted successfully",
      deleted_count: result.deletedCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ==================== HEALTH CHECK ====================

app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

module.exports = app;