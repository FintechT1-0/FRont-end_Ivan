import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* LEFT: logo */}
        <div style={styles.logoBlock}>
          <img
            src={Logo}
            alt="FinTech UniVerse"
            style={styles.logo}
          />
        </div>

        {/* CENTER: navigation */}
        <nav style={styles.nav}>
          <NavItem to="/">Main</NavItem>
          <NavItem to="/courses">Courses</NavItem>
          <NavItem to="/insights">Insights</NavItem>
          <NavItem to="/partners">Partners</NavItem>
        </nav>
      </div>

      {/* BOTTOM LINE */}
      <div style={styles.bottom}>
        © {new Date().getFullYear()} FinTech UniVerse. All rights reserved.
      </div>
    </footer>
  );
}

/* ---------- helpers ---------- */

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.navItem,
        opacity: isActive ? 1 : 0.75,
      })}
    >
      {children}
    </NavLink>
  );
}

/* ---------- styles ---------- */

const styles = {
  footer: {
    background: "#2E5D8C",
    marginTop: 80,
  },

  inner: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "32px 24px",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
  },

  logoBlock: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    height: 40,
  },

  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
  },

  navItem: {
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 500,
    transition: "opacity 0.2s",
  },

  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.15)",
    padding: "16px 24px",
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
};