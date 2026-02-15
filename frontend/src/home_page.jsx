import { useNavigate } from "react-router-dom";
import page_styles from "./page.module.css";
import card_styles from "./card.module.css";
import button_styles from "./button.module.css";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={page_styles.centered_page}>
      <div className={card_styles.card} style={{ maxWidth: "500px", width: "100%" }}>
        <div className={page_styles.home_content}>
          <h1 className={page_styles.home_title}>📚 Scholar Sync</h1>
          <p className={page_styles.home_subtitle}>
            Student Record Management System
          </p>
          <div className={page_styles.home_actions}>
            <button
              onClick={() => navigate("/login")}
              className={button_styles.btn_primary}
              style={{ flex: 1 }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className={button_styles.btn_secondary}
              style={{ flex: 1 }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}