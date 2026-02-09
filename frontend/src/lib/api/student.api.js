// lib/api/student.api.js
import { apiClient } from "./api-client";

export const studentApi = {
  // Get all students with filters and pagination
  getAll: (params) => apiClient.get("/students", { params }),

  // Get single student by ID
  getById: (id) => apiClient.get(`/students/${id}`),

  // Create new student
  create: (data) => apiClient.post("/students", data),

  // Update student
  update: (id, data) => apiClient.put(`/students/${id}`, data),

  // Delete student
  delete: (id) => apiClient.delete(`/students/${id}`),

  // Get statistics
  getStats: () => apiClient.get("/students/stats/overview"),

  // Bulk delete
  bulkDelete: (studentIds) =>
    apiClient.post("/students/bulk-delete", { studentIds }),
};