import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import button_styles from "./button.module.css";

export function Navbar({ user, on_logout }) {
  const navigate = useNavigate();

  const handle_logout = () => {
    on_logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_container}>
        <Link to="/dashboard" className={styles.logo}>
          📚 Scholar Sync
        </Link>
        <div className={styles.nav_items}>
          <Link to="/dashboard" className={styles.nav_link}>
            Dashboard
          </Link>
          <span className={styles.user_name}>{user?.name}</span>
          <button 
            onClick={handle_logout} 
            className={button_styles.btn_primary}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}