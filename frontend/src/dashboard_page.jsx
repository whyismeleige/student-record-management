import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import page_styles from "./page.module.css";
import card_styles from "./card.module.css";
import button_styles from "./button.module.css";
import student_styles from "./student_card.module.css";

const API_URL = "http://localhost:5000/api";

export function DashboardPage({ user, on_logout }) {
  const navigate = useNavigate();
  const [students, set_students] = useState([]);
  const [stats, set_stats] = useState(null);
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [filter_grade, set_filter_grade] = useState("");

  useEffect(() => {
    fetch_students();
    fetch_stats();
  }, [filter_grade]);

  const fetch_students = async () => {
    try {
      set_loading(true);
      let url = `${API_URL}/students?`;
      if (filter_grade) url += `grade=${filter_grade}&`;
      if (search_query) url += `search=${search_query}&`;

      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        set_students(data.students || []);
      } else {
        alert(data.error || "Failed to fetch students");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      set_loading(false);
    }
  };

  const fetch_stats = async () => {
    try {
      const response = await fetch(`${API_URL}/students/stats/overview`, {
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        set_stats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handle_delete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        alert("Student deleted");
        fetch_students();
        fetch_stats();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const get_grade_class = (grade) => {
    if (grade === "10th") return student_styles.grade_10;
    if (grade === "11th") return student_styles.grade_11;
    if (grade === "12th") return student_styles.grade_12;
    return "";
  };

  return (
    <div>
      <Navbar user={user} on_logout={on_logout} />

      <div className={page_styles.page}>
        <div className={page_styles.container}>
          <div className={page_styles.page_header}>
            <h1 className={page_styles.page_title}>Student Dashboard</h1>
            <button
              onClick={() => navigate("/students/new")}
              className={button_styles.btn_primary}
            >
              ➕ Add Student
            </button>
          </div>

          {stats && (
            <div className={card_styles.grid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "2.5rem" }}>
              <div className={card_styles.stat_card}>
                <div className={card_styles.stat_label}>Total Students</div>
                <div className={card_styles.stat_value}>{stats.total}</div>
              </div>
              <div className={card_styles.stat_card}>
                <div className={card_styles.stat_label}>Active</div>
                <div className={card_styles.stat_value}>{stats.active}</div>
              </div>
              <div className={card_styles.stat_card}>
                <div className={card_styles.stat_label}>Average GPA</div>
                <div className={card_styles.stat_value}>
                  {stats.averageGPA?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>
          )}

          <div className={page_styles.filter_bar}>
            <input
              type="text"
              className={page_styles.filter_input}
              placeholder="🔍 Search by name, ID, or email..."
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
            />
            <select
              className={page_styles.filter_select}
              value={filter_grade}
              onChange={(e) => set_filter_grade(e.target.value)}
            >
              <option value="">All Grades</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
            <button
              onClick={fetch_students}
              className={button_styles.btn_primary}
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className={page_styles.loading}>Loading...</div>
          ) : students.length === 0 ? (
            <div className={card_styles.card}>
              <p className={page_styles.empty_state}>No students found</p>
            </div>
          ) : (
            <div className={student_styles.grid_4}>
              {students.map((student) => (
                <div key={student._id} className={student_styles.student_card}>
                  <div className={student_styles.student_card_header}>
                    <span
                      className={`${student_styles.grade_badge} ${get_grade_class(
                        student.grade
                      )}`}
                    >
                      {student.grade}
                    </span>
                  </div>
                  <div className={student_styles.student_card_body}>
                    <h3 className={student_styles.student_name}>
                      {student.name}
                    </h3>
                    <p className={student_styles.student_id}>
                      ID: {student.studentId}
                    </p>
                    <div className={student_styles.student_info}>
                      <div className={student_styles.info_row}>
                        📧 {student.email}
                      </div>
                      <div className={student_styles.info_row}>
                        🏫 {student.department}
                      </div>
                      <div className={student_styles.info_row}>
                        📊 GPA: {student.gpa || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className={student_styles.student_card_actions}>
                    <button
                      onClick={() => navigate(`/students/${student._id}`)}
                      className={button_styles.btn_secondary}
                      style={{ flex: 1, padding: "0.5rem" }}
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/students/${student._id}/edit`)
                      }
                      className={button_styles.btn_secondary}
                      style={{ flex: 1, padding: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handle_delete(student._id, student.name)
                      }
                      className={button_styles.btn_danger}
                      style={{ flex: 1, padding: "0.5rem" }}
                    >
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