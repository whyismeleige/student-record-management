import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import page_styles from "./page.module.css";
import card_styles from "./card.module.css";
import form_styles from "./form.module.css";
import button_styles from "./button.module.css";

const API_URL = "http://localhost:5000/api";

export function StudentFormPage({ user, on_logout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const is_edit_mode = Boolean(id);

  const [loading, set_loading] = useState(false);
  const [initial_loading, set_initial_loading] = useState(is_edit_mode);

  const [form_data, set_form_data] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    grade: "10th",
    department: "Science",
    enrollmentYear: new Date().getFullYear(),
    gpa: "",
    attendanceStatus: "Present",
    attendancePercentage: "100",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: { street: "", city: "", state: "", zipCode: "" },
    notes: "",
    status: "Active"
  });

  useEffect(() => {
    if (is_edit_mode) {
      fetch_student();
    }
  }, [id]);

  const fetch_student = async () => {
    try {
      set_initial_loading(true);
      const response = await fetch(`${API_URL}/students/${id}`, {
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        const student = data.student;
        const formatted_date = student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "";
        set_form_data({
          name: student.name || "",
          studentId: student.studentId || "",
          email: student.email || "",
          phone: student.phone || "",
          dateOfBirth: formatted_date,
          gender: student.gender || "Male",
          grade: student.grade || "10th",
          department: student.department || "Science",
          enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
          gpa: student.gpa || "",
          attendanceStatus: student.attendanceStatus || "Present",
          attendancePercentage: student.attendancePercentage || "100",
          guardianName: student.guardianName || "",
          guardianPhone: student.guardianPhone || "",
          guardianEmail: student.guardianEmail || "",
          address: {
            street: student.address?.street || "",
            city: student.address?.city || "",
            state: student.address?.state || "",
            zipCode: student.address?.zipCode || ""
          },
          notes: student.notes || "",
          status: student.status || "Active"
        });
      } else {
        alert(data.error || "Failed to load");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
      navigate("/dashboard");
    } finally {
      set_initial_loading(false);
    }
  };

  const handle_change = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const address_field = name.split(".")[1];
      set_form_data({
        ...form_data,
        address: { ...form_data.address, [address_field]: value }
      });
    } else {
      set_form_data({ ...form_data, [name]: value });
    }
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    set_loading(true);

    try {
      const url = is_edit_mode
        ? `${API_URL}/students/${id}`
        : `${API_URL}/students`;
      const method = is_edit_mode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form_data)
      });

      const data = await response.json();
      if (response.ok) {
        alert(is_edit_mode ? "Student updated" : "Student created");
        navigate("/dashboard");
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      set_loading(false);
    }
  };

  if (initial_loading) {
    return (
      <div>
        <Navbar user={user} on_logout={on_logout} />
        <div className={page_styles.page}>
          <div className={page_styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} on_logout={on_logout} />

      <div className={page_styles.page}>
        <div
          className={page_styles.container}
          style={{ maxWidth: "900px" }}
        >
          <div className={page_styles.page_header}>
            <h1 className={page_styles.page_title}>
              {is_edit_mode ? "✏️ Edit Student" : "➕ Add New Student"}
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className={button_styles.btn_secondary}
            >
              ← Back
            </button>
          </div>

          <div className={card_styles.card}>
            <form onSubmit={handle_submit}>
              <h2 className={form_styles.section_title}>Basic Information</h2>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    className={form_styles.input}
                    value={form_data.name}
                    onChange={handle_change}
                    required
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Student ID *</label>
                  <input
                    type="text"
                    name="studentId"
                    className={form_styles.input}
                    value={form_data.studentId}
                    onChange={handle_change}
                    required
                  />
                </div>
              </div>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    className={form_styles.input}
                    value={form_data.email}
                    onChange={handle_change}
                    required
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className={form_styles.input}
                    value={form_data.phone}
                    onChange={handle_change}
                  />
                </div>
              </div>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className={form_styles.input}
                    value={form_data.dateOfBirth}
                    onChange={handle_change}
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Gender</label>
                  <select
                    name="gender"
                    className={form_styles.select}
                    value={form_data.gender}
                    onChange={handle_change}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <h2 className={form_styles.section_title}>Academic Information</h2>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Grade *</label>
                  <select
                    name="grade"
                    className={form_styles.select}
                    value={form_data.grade}
                    onChange={handle_change}
                    required
                  >
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Department *</label>
                  <input
                    type="text"
                    name="department"
                    className={form_styles.input}
                    value={form_data.department}
                    onChange={handle_change}
                    required
                  />
                </div>
              </div>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Enrollment Year *</label>
                  <input
                    type="number"
                    name="enrollmentYear"
                    className={form_styles.input}
                    value={form_data.enrollmentYear}
                    onChange={handle_change}
                    required
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>GPA</label>
                  <input
                    type="number"
                    name="gpa"
                    className={form_styles.input}
                    value={form_data.gpa}
                    onChange={handle_change}
                    min="0"
                    max="4"
                    step="0.01"
                  />
                </div>
              </div>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Attendance Status</label>
                  <select
                    name="attendanceStatus"
                    className={form_styles.select}
                    value={form_data.attendanceStatus}
                    onChange={handle_change}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Attendance %</label>
                  <input
                    type="number"
                    name="attendancePercentage"
                    className={form_styles.input}
                    value={form_data.attendancePercentage}
                    onChange={handle_change}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className={form_styles.form_group}>
                <label className={form_styles.label}>Status</label>
                <select
                  name="status"
                  className={form_styles.select}
                  value={form_data.status}
                  onChange={handle_change}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <h2 className={form_styles.section_title}>Guardian Information</h2>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    className={form_styles.input}
                    value={form_data.guardianName}
                    onChange={handle_change}
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>Guardian Phone</label>
                  <input
                    type="text"
                    name="guardianPhone"
                    className={form_styles.input}
                    value={form_data.guardianPhone}
                    onChange={handle_change}
                  />
                </div>
              </div>

              <div className={form_styles.form_group}>
                <label className={form_styles.label}>Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  className={form_styles.input}
                  value={form_data.guardianEmail}
                  onChange={handle_change}
                />
              </div>

              <h2 className={form_styles.section_title}>Address</h2>

              <div className={form_styles.form_group}>
                <label className={form_styles.label}>Street</label>
                <input
                  type="text"
                  name="address.street"
                  className={form_styles.input}
                  value={form_data.address.street}
                  onChange={handle_change}
                />
              </div>

              <div className={form_styles.grid_2}>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>City</label>
                  <input
                    type="text"
                    name="address.city"
                    className={form_styles.input}
                    value={form_data.address.city}
                    onChange={handle_change}
                  />
                </div>
                <div className={form_styles.form_group}>
                  <label className={form_styles.label}>State</label>
                  <input
                    type="text"
                    name="address.state"
                    className={form_styles.input}
                    value={form_data.address.state}
                    onChange={handle_change}
                  />
                </div>
              </div>

              <div className={form_styles.form_group}>
                <label className={form_styles.label}>Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  className={form_styles.input}
                  value={form_data.address.zipCode}
                  onChange={handle_change}
                />
              </div>

              <h2 className={form_styles.section_title}>Additional Notes</h2>

              <div className={form_styles.form_group}>
                <label className={form_styles.label}>Notes</label>
                <textarea
                  name="notes"
                  className={form_styles.textarea}
                  value={form_data.notes}
                  onChange={handle_change}
                  placeholder="Enter any additional notes about the student..."
                />
              </div>

              <button
                type="submit"
                className={button_styles.btn_primary}
                style={{ width: "100%", marginTop: "2rem", padding: "1rem" }}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : is_edit_mode
                  ? "💾 Update Student"
                  : "➕ Add Student"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}