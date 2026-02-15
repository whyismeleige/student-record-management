import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import page_styles from "./page.module.css";
import card_styles from "./card.module.css";
import form_styles from "./form.module.css";
import button_styles from "./button.module.css";

export function AuthPage({ on_login, on_register }) {
  const location = useLocation();
  const navigate = useNavigate();
  const is_login = location.pathname === "/login";

  const [form_data, set_form_data] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty"
  });
  const [loading, set_loading] = useState(false);

  const handle_submit = async (e) => {
    e.preventDefault();
    set_loading(true);

    let success = false;
    if (is_login) {
      success = await on_login(form_data.email, form_data.password);
    } else {
      success = await on_register(
        form_data.name,
        form_data.email,
        form_data.password,
        form_data.role
      );
    }

    set_loading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={page_styles.centered_page}>
      <div className={card_styles.card} style={{ maxWidth: "450px", width: "100%" }}>
        <h1 className={page_styles.auth_title}>
          {is_login ? "🔐 Login" : "📝 Register"}
        </h1>

        <form onSubmit={handle_submit}>
          {!is_login && (
            <div className={form_styles.form_group}>
              <label className={form_styles.label}>Name</label>
              <input
                type="text"
                className={form_styles.input}
                value={form_data.name}
                onChange={(e) =>
                  set_form_data({ ...form_data, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className={form_styles.form_group}>
            <label className={form_styles.label}>Email</label>
            <input
              type="email"
              className={form_styles.input}
              value={form_data.email}
              onChange={(e) =>
                set_form_data({ ...form_data, email: e.target.value })
              }
              required
            />
          </div>

          <div className={form_styles.form_group}>
            <label className={form_styles.label}>Password</label>
            <input
              type="password"
              className={form_styles.input}
              value={form_data.password}
              onChange={(e) =>
                set_form_data({ ...form_data, password: e.target.value })
              }
              required
            />
          </div>

          {!is_login && (
            <div className={form_styles.form_group}>
              <label className={form_styles.label}>Role</label>
              <select
                className={form_styles.select}
                value={form_data.role}
                onChange={(e) =>
                  set_form_data({ ...form_data, role: e.target.value })
                }
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className={button_styles.btn_primary}
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Please wait..." : is_login ? "Login" : "Register"}
          </button>
        </form>

        <p className={page_styles.auth_footer}>
          {is_login ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => navigate(is_login ? "/register" : "/login")}
            className={page_styles.auth_link}
          >
            {is_login ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}