import { useEffect, useState } from "react";
import { FiBookOpen, FiGithub, FiMenu, FiPlus, FiX } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./styles.module.css";

const navItems = [
  { label: "Overview", to: "/overview" },
  { label: "Students", to: "/students" },
  { label: "Attendance", to: "/attendance" },
  { label: "Classes", to: "/classes" },
  { label: "Fees", to: "/fees" },
];

const Header = ({ onAddStudent }) => {
  const location = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const menuOpen = openPath === location.pathname;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let previousY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (menuOpen || currentY < 24 || currentY < previousY - 2) setVisible(true);
      else if (currentY > previousY + 2) setVisible(false);
      previousY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${visible || menuOpen ? styles.visible : styles.hidden}`}>
      <div className={styles.topRow}>
        <NavLink to="/overview" className={styles.brand} aria-label="Bellwether Academy home">
          <span className={styles.brandIcon}><FiBookOpen aria-hidden="true" /></span>
          <span><strong>Bellwether</strong><small>ACADEMY OFFICE</small></span>
        </NavLink>
        <div className={styles.topActions}>
          <a className={styles.repository} href="https://github.com/a2rp/school-information-system" target="_blank" rel="noreferrer">
            <FiGithub aria-hidden="true" /><span>Repository</span>
          </a>
          <button type="button" className={styles.addButton} onClick={onAddStudent}>
            <FiPlus aria-hidden="true" /><span>New student</span>
          </button>
          <button type="button" className={styles.menuButton} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setOpenPath(menuOpen ? null : location.pathname)}>
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
            {item.label}
          </NavLink>
        ))}
        <button type="button" className={styles.mobileAdd} onClick={onAddStudent}><FiPlus aria-hidden="true" /> New student</button>
      </nav>
    </header>
  );
};

export default Header;
