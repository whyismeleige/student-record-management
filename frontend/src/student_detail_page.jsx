import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import page_styles from "./page.module.css";
import card_styles from "./card.module.css";
import button_styles from "./button.module.css";
import student_styles from "./student_card.module.css";

const API_URL = "http://localhost:5000/api";

export function StudentDetailPage({ user, on_logout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, set_student] = useState(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    fetch_student();
  }, [id]);

  const fetch_student = async () => {
    try {
      set_loading(true);
      const response = await fetch(`${API_URL}/students/${id}`, {
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        set_student(data.student);
      } else {
        alert(data.error || "Failed to load student");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
      navigate("/dashboard");
    } finally {
      set_loading(false);
    }
  };

  const handle_delete = async () => {
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

  const format_date = (date_string) => {
    if (!date_string) return "Not provided";
    const date = new Date(date_string);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const get_grade_class = (grade) => {
    if (grade === "10th") return student_styles.grade_10;
    if (grade === "11th") return student_styles.grade_11;
    if (grade === "12th") return student_styles.grade_12;
    return "";
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} on_logout={on_logout} />
        <div className={page_styles.page}>
          <div className={page_styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div>
      <Navbar user={user} on_logout={on_logout} />

      <div className={page_styles.page}>
        <div
          className={page_styles.container}
          style={{ maxWidth: "1000px" }}
        >
          <div className={page_styles.detail_header}>
            <button
              onClick={() => navigate("/dashboard")}
              className={button_styles.btn_secondary}
            >
              ← Back to Dashboard
            </button>
            <div className={page_styles.detail_actions}>
              <button
                onClick={() => navigate(`/students/${id}/edit`)}
                className={button_styles.btn_primary}
              >
                ✏️ Edit
              </button>
              <button
                onClick={handle_delete}
                className={button_styles.btn_danger}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className={card_styles.card}>
            <div className={card_styles.card_header}>
              <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#78350f", marginBottom: "0.75rem" }}>
                {student.name}
              </h1>
              <p style={{ color: "#78350f", fontSize: "1.125rem", marginBottom: "1rem", fontWeight: "600" }}>
                Student ID: {student.studentId}
              </p>
              <span className={`${student_styles.grade_badge} ${get_grade_class(student.grade)}`}>
                {student.grade}
              </span>
            </div>

            <div className={card_styles.card_body}>
              <h2 className={page_styles.section_title}>Basic Information</h2>
              <div className={page_styles.detail_info_grid}>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📧 Email</div>
                  <div className={page_styles.info_value}>{student.email}</div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📞 Phone</div>
                  <div className={page_styles.info_value}>
                    {student.phone || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🎂 Date of Birth</div>
                  <div className={page_styles.info_value}>
                    {format_date(student.dateOfBirth)}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>👤 Gender</div>
                  <div className={page_styles.info_value}>
                    {student.gender || "Not provided"}
                  </div>
                </div>
              </div>

              <h2 className={page_styles.section_title}>Academic Information</h2>
              <div className={page_styles.detail_info_grid}>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🏫 Department</div>
                  <div className={page_styles.info_value}>
                    {student.department}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📅 Enrollment Year</div>
                  <div className={page_styles.info_value}>
                    {student.enrollmentYear}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📊 GPA</div>
                  <div className={page_styles.info_value}>
                    {student.gpa || "N/A"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>✅ Attendance Status</div>
                  <div className={page_styles.info_value}>
                    {student.attendanceStatus}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📈 Attendance %</div>
                  <div className={page_styles.info_value}>
                    {student.attendancePercentage}%
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🎓 Status</div>
                  <div className={page_styles.info_value}>{student.status}</div>
                </div>
              </div>

              <h2 className={page_styles.section_title}>Guardian Information</h2>
              <div className={page_styles.detail_info_grid}>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>👨‍👩‍👧 Guardian Name</div>
                  <div className={page_styles.info_value}>
                    {student.guardianName || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📞 Guardian Phone</div>
                  <div className={page_styles.info_value}>
                    {student.guardianPhone || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📧 Guardian Email</div>
                  <div className={page_styles.info_value}>
                    {student.guardianEmail || "Not provided"}
                  </div>
                </div>
              </div>

              <h2 className={page_styles.section_title}>Address</h2>
              <div className={page_styles.detail_info_grid}>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🏠 Street</div>
                  <div className={page_styles.info_value}>
                    {student.address?.street || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🏙️ City</div>
                  <div className={page_styles.info_value}>
                    {student.address?.city || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>🗺️ State</div>
                  <div className={page_styles.info_value}>
                    {student.address?.state || "Not provided"}
                  </div>
                </div>
                <div className={page_styles.info_item}>
                  <div className={page_styles.info_label}>📮 Zip Code</div>
                  <div className={page_styles.info_value}>
                    {student.address?.zipCode || "Not provided"}
                  </div>
                </div>
              </div>

              {student.notes && (
                <div className={page_styles.notes_section}>
                  <h2 className={page_styles.section_title}>Notes</h2>
                  <p className={page_styles.notes_content}>{student.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}