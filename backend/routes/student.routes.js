// routes/student.routes.js
const express = require("express");
const controller = require("../controllers/student.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics route (must come before /:id to avoid conflicts)
router.get("/stats/overview", controller.getStats);

// Bulk operations
router.post("/bulk-delete", controller.bulkDelete);

// CRUD routes
router.get("/", controller.getAllStudents);
router.get("/:id", controller.getStudentById);
router.post("/", controller.createStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

module.exports = router;