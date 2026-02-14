import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "./styles.css";

const API_URL = "http://localhost:8080/api";

// ==================== AUTH HOOK ====================
function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        alert(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      alert("Something went wrong");
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        alert(data.error || "Registration failed");
        return false;
      }
    } catch (error) {
      alert("Something went wrong");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      setUser(null);
      setIsAuthenticated(false);
      alert("Logged out successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return { user, isAuthenticated, loading, login, register, logout };
}

// ==================== NAVBAR COMPONENT ====================
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar_container">
        <Link to="/dashboard" className="logo">Scholar Sync</Link>
        <div className="nav_items">
          <Link to="/dashboard" className="nav_link">Dashboard</Link>
          <span>{user?.name}</span>
          <button onClick={() => { onLogout(); navigate("/login"); }} className="btn btn_primary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// ==================== HOME PAGE ====================
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "400px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#78350f" }}>Scholar Sync</h1>
        <p style={{ marginBottom: "2rem", color: "#57534e" }}>Student Record Management System</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => navigate("/login")} className="btn btn_primary" style={{ flex: 1 }}>
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn btn_secondary" style={{ flex: 1 }}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== AUTH PAGE ====================
function AuthPage({ onLogin, onRegister }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let success = false;
    if (isLogin) {
      success = await onLogin(formData.email, formData.password);
    } else {
      success = await onRegister(formData.name, formData.email, formData.password, formData.role);
    }

    setLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2rem", color: "#78350f" }}>
          {isLogin ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form_group">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form_group">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form_group">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <div className="form_group">
              <label className="label">Role</label>
              <select
                className="select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn_primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#57534e" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => navigate(isLogin ? "/register" : "/login")}
            style={{ color: "#78350f", fontWeight: "500", cursor: "pointer" }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [filterGrade]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/students?`;
      if (filterGrade) url += `grade=${filterGrade}&`;
      if (searchQuery) url += `search=${searchQuery}&`;

      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students || []);
      } else {
        alert(data.error || "Failed to fetch students");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/students/stats/overview`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        alert("Student deleted");
        fetchStudents();
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const getGradeClass = (grade) => {
    if (grade === "10th") return "grade_10";
    if (grade === "11th") return "grade_11";
    if (grade === "12th") return "grade_12";
    return "";
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#78350f" }}>Student Dashboard</h1>
            <button onClick={() => navigate("/students/new")} className="btn btn_primary">
              + Add Student
            </button>
          </div>

          {stats && (
            <div className="grid grid_3" style={{ marginBottom: "2rem" }}>
              <div className="card">
                <div style={{ fontSize: "0.875rem", color: "#78350f", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Total Students
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>{stats.total}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: "0.875rem", color: "#78350f", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Active
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>{stats.active}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: "0.875rem", color: "#78350f", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Grade 10
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>{stats.grade_10}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: "0.875rem", color: "#78350f", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Grade 11
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>{stats.grade_11}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: "0.875rem", color: "#78350f", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Grade 12
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>{stats.grade_12}</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Search..."
                className="input"
                style={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={fetchStudents} className="btn btn_primary">Search</button>
            </div>
            <select className="select" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
              <option value="">All Grades</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : students.length === 0 ? (
            <div className="card">
              <p style={{ textAlign: "center" }}>No students found</p>
            </div>
          ) : (
            <div className="grid grid_4">
              {students.map((student) => (
                <div key={student._id} className="student_card">
                  <div className="student_card_header">
                    <span className={`grade_badge ${getGradeClass(student.grade)}`}>{student.grade}</span>
                  </div>
                  <div className="student_card_body">
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#78350f" }}>
                      {student.name}
                    </h3>
                    <p style={{ color: "#57534e", fontSize: "0.875rem", marginBottom: "1rem" }}>
                      ID: {student.studentId}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ fontSize: "0.875rem", color: "#57534e" }}>📧 {student.email}</div>
                      <div style={{ fontSize: "0.875rem", color: "#57534e" }}>🏫 {student.department}</div>
                      <div style={{ fontSize: "0.875rem", color: "#57534e" }}>📊 GPA: {student.gpa || "N/A"}</div>
                    </div>
                  </div>
                  <div className="student_card_actions">
                    <button onClick={() => navigate(`/students/${student._id}`)} className="btn btn_secondary" style={{ flex: 1, padding: "0.5rem" }}>
                      View
                    </button>
                    <button onClick={() => navigate(`/students/${student._id}/edit`)} className="btn btn_secondary" style={{ flex: 1, padding: "0.5rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(student._id, student.name)} className="btn btn_secondary" style={{ flex: 1, padding: "0.5rem" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== STUDENT FORM PAGE ====================
function StudentFormPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    name: "", studentId: "", email: "", phone: "", dateOfBirth: "", gender: "Male",
    grade: "10th", department: "Science", enrollmentYear: new Date().getFullYear(),
    gpa: "", attendanceStatus: "Present", attendancePercentage: "100",
    guardianName: "", guardianPhone: "", guardianEmail: "",
    address: { street: "", city: "", state: "", zipCode: "" },
    notes: "", status: "Active"
  });

  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_URL}/students/${id}`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        const student = data.student;
        const formattedDate = student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "";
        setFormData({
          name: student.name || "", studentId: student.studentId || "",
          email: student.email || "", phone: student.phone || "",
          dateOfBirth: formattedDate, gender: student.gender || "Male",
          grade: student.grade || "10th", department: student.department || "Science",
          enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
          gpa: student.gpa || "", attendanceStatus: student.attendanceStatus || "Present",
          attendancePercentage: student.attendancePercentage || "100",
          guardianName: student.guardianName || "", guardianPhone: student.guardianPhone || "",
          guardianEmail: student.guardianEmail || "",
          address: {
            street: student.address?.street || "", city: student.address?.city || "",
            state: student.address?.state || "", zipCode: student.address?.zipCode || ""
          },
          notes: student.notes || "", status: student.status || "Active"
        });
      } else {
        alert(data.error || "Failed to load");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
      navigate("/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `${API_URL}/students/${id}` : `${API_URL}/students`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert(isEditMode ? "Student updated" : "Student created");
        navigate("/dashboard");
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div className="page">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f" }}>
              {isEditMode ? "Edit Student" : "Add New Student"}
            </h1>
            <button onClick={() => navigate("/dashboard")} className="btn btn_secondary">
              ← Back
            </button>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <h2 className="section_title">Basic Information</h2>
              
              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Name *</label>
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form_group">
                  <label className="label">Student ID *</label>
                  <input type="text" name="studentId" className="input" value={formData.studentId} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Email *</label>
                  <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form_group">
                  <label className="label">Phone</label>
                  <input type="text" name="phone" className="input" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="input" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="form_group">
                  <label className="label">Gender</label>
                  <select name="gender" className="select" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <h2 className="section_title">Academic Information</h2>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Grade *</label>
                  <select name="grade" className="select" value={formData.grade} onChange={handleChange} required>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                <div className="form_group">
                  <label className="label">Department *</label>
                  <input type="text" name="department" className="input" value={formData.department} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Enrollment Year *</label>
                  <input type="number" name="enrollmentYear" className="input" value={formData.enrollmentYear} onChange={handleChange} required />
                </div>
                <div className="form_group">
                  <label className="label">GPA</label>
                  <input type="number" name="gpa" className="input" value={formData.gpa} onChange={handleChange} min="0" max="4" step="0.01" />
                </div>
              </div>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Attendance Status</label>
                  <select name="attendanceStatus" className="select" value={formData.attendanceStatus} onChange={handleChange}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
                <div className="form_group">
                  <label className="label">Attendance %</label>
                  <input type="number" name="attendancePercentage" className="input" value={formData.attendancePercentage} onChange={handleChange} min="0" max="100" />
                </div>
              </div>

              <div className="form_group">
                <label className="label">Status</label>
                <select name="status" className="select" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <h2 className="section_title">Guardian Information</h2>

              <div className="grid grid_2">
                <div className="form_group">
                  <label className="label">Guardian Name</label>
                  <input type="text" name="guardianName" className="input" value={formData.guardianName} onChange={handleChange} />
                </div>
                <div className="form_group">
                  <label className="label">Guardian Phone</label>
                  <input type="text" name="guardianPhone" className="input" value={formData.guardianPhone} onChange={handleChange} />
                </div>
              </div>

              <div className="form_group">
                <label className="label">Guardian Email</label>
                <input type="email" name="guardianEmail" className="input" value={formData.guardianEmail} onChange={handleChange} />
              </div>

              <h2 className="section_title">Address</h2>

              <div className="form_group">
                <label className="label">Street</label>
                <input type="text" name="address.street" className="input" value={formData.address.street} onChange={handleChange} />
              </div>

              <div className="grid grid_3">
                <div className="form_group">
                  <label className="label">City</label>
                  <input type="text" name="address.city" className="input" value={formData.address.city} onChange={handleChange} />
                </div>
                <div className="form_group">
                  <label className="label">State</label>
                  <input type="text" name="address.state" className="input" value={formData.address.state} onChange={handleChange} />
                </div>
                <div className="form_group">
                  <label className="label">Zip Code</label>
                  <input type="text" name="address.zipCode" className="input" value={formData.address.zipCode} onChange={handleChange} />
                </div>
              </div>

              <h2 className="section_title">Notes</h2>

              <div className="form_group">
                <label className="label">Additional Notes</label>
                <textarea name="notes" className="textarea" value={formData.notes} onChange={handleChange} rows="4" />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="btn btn_primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? "Saving..." : "💾 Save Student"}
                </button>
                <button type="button" onClick={() => navigate("/dashboard")} className="btn btn_secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STUDENT DETAIL PAGE ====================
function StudentDetailPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students/${id}`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setStudent(data.student);
      } else {
        alert(data.error || "Failed to load");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${student.name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        alert("Student deleted");
        navigate("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString();
  };

  const getGradeClass = (grade) => {
    if (grade === "10th") return "grade_10";
    if (grade === "11th") return "grade_11";
    if (grade === "12th") return "grade_12";
    return "";
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div className="page">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <button onClick={() => navigate("/dashboard")} className="btn btn_secondary">
              ← Back to Dashboard
            </button>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => navigate(`/students/${id}/edit`)} className="btn btn_primary">
                ✏️ Edit
              </button>
              <button onClick={handleDelete} className="btn btn_danger">
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ padding: "2rem", borderBottom: "2px solid #fef3c7" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#78350f", marginBottom: "0.5rem" }}>
                {student.name}
              </h1>
              <p style={{ color: "#57534e", fontSize: "1.125rem", marginBottom: "1rem" }}>
                Student ID: {student.studentId}
              </p>
              <span className={`grade_badge ${getGradeClass(student.grade)}`}>{student.grade}</span>
            </div>

            <div style={{ padding: "2rem" }}>
              <h2 className="section_title">Basic Information</h2>
              <div className="grid grid_2">
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📧 Email
                  </div>
                  <div style={{ color: "#57534e" }}>{student.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📞 Phone
                  </div>
                  <div style={{ color: "#57534e" }}>{student.phone || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🎂 Date of Birth
                  </div>
                  <div style={{ color: "#57534e" }}>{formatDate(student.dateOfBirth)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    👤 Gender
                  </div>
                  <div style={{ color: "#57534e" }}>{student.gender || "Not provided"}</div>
                </div>
              </div>

              <h2 className="section_title">Academic Information</h2>
              <div className="grid grid_2">
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🏫 Department
                  </div>
                  <div style={{ color: "#57534e" }}>{student.department}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📅 Enrollment Year
                  </div>
                  <div style={{ color: "#57534e" }}>{student.enrollmentYear}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📊 GPA
                  </div>
                  <div style={{ color: "#57534e" }}>{student.gpa || "N/A"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    ✅ Attendance Status
                  </div>
                  <div style={{ color: "#57534e" }}>{student.attendanceStatus}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📈 Attendance %
                  </div>
                  <div style={{ color: "#57534e" }}>{student.attendancePercentage}%</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🎓 Status
                  </div>
                  <div style={{ color: "#57534e" }}>{student.status}</div>
                </div>
              </div>

              <h2 className="section_title">Guardian Information</h2>
              <div className="grid grid_2">
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    👨‍👩‍👧 Guardian Name
                  </div>
                  <div style={{ color: "#57534e" }}>{student.guardianName || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📞 Guardian Phone
                  </div>
                  <div style={{ color: "#57534e" }}>{student.guardianPhone || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📧 Guardian Email
                  </div>
                  <div style={{ color: "#57534e" }}>{student.guardianEmail || "Not provided"}</div>
                </div>
              </div>

              <h2 className="section_title">Address</h2>
              <div className="grid grid_2">
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🏠 Street
                  </div>
                  <div style={{ color: "#57534e" }}>{student.address?.street || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🏙️ City
                  </div>
                  <div style={{ color: "#57534e" }}>{student.address?.city || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    🗺️ State
                  </div>
                  <div style={{ color: "#57534e" }}>{student.address?.state || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#78350f", marginBottom: "0.25rem" }}>
                    📮 Zip Code
                  </div>
                  <div style={{ color: "#57534e" }}>{student.address?.zipCode || "Not provided"}</div>
                </div>
              </div>

              {student.notes && (
                <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "2px solid #fef3c7" }}>
                  <h2 className="section_title">Notes</h2>
                  <p style={{ color: "#57534e", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{student.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children, isAuthenticated, loading }) {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// ==================== PUBLIC ROUTE ====================
function PublicRoute({ children, isAuthenticated, loading }) {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

// ==================== MAIN APP COMPONENT ====================
function App() {
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated} loading={loading}>
              <AuthPage onLogin={login} onRegister={register} />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute isAuthenticated={isAuthenticated} loading={loading}>
              <AuthPage onLogin={login} onRegister={register} />
            </PublicRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <DashboardPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/new"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <StudentFormPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <StudentDetailPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/:id/edit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <StudentFormPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;