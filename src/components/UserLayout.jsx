import { NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";

export default function UserLayout() {
  const { lang } = useLang();

  const t = {
    dashboard: lang === "ua" ? "Панель" : "Dashboard",
    courses: lang === "ua" ? "Мої курси" : "My courses",
    settings: lang === "ua" ? "Налаштування" : "Settings",
    support: lang === "ua" ? "Допомога та підтримка" : "Help & Support",
  };

  return (
    <div style={page}>
      <aside style={sidebar}>
        <div style={logoBox}>
          <img src={Logo} alt="FinTech UniVerse" style={logo} />
        </div>

        <nav style={nav}>
          <SideLink to="/cabinet" end>
            {t.dashboard}
          </SideLink>

          <SideLink to="/cabinet/courses">
            {t.courses}
          </SideLink>

          <SideLink to="/cabinet/settings">
            {t.settings}
          </SideLink>
        </nav>

        <div style={support}>{t.support}</div>
      </aside>

      <main style={content}>
        <Outlet />
      </main>
    </div>
  );
}

function SideLink({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        minHeight: "44px",
        padding: "0 18px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: isActive ? 800 : 600,
        background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
        border: isActive
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid transparent",
      })}
    >
      {children}
    </NavLink>
  );
}

const page = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  background: "#082947",
};

const sidebar = {
  background:
    "linear-gradient(180deg, rgba(10,42,73,0.98) 0%, rgba(6,31,56,0.98) 100%)",
  padding: "28px 24px",
  display: "flex",
  flexDirection: "column",
};

const logoBox = {
  width: "140px",
  height: "58px",
  borderRadius: "999px",
  background: "linear-gradient(180deg, #123A61 0%, #082947 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "34px",
};

const logo = {
  width: "42px",
  height: "42px",
  objectFit: "contain",
};

const nav = {
  display: "grid",
  gap: "16px",
};

const support = {
  marginTop: "auto",
  color: "rgba(255,255,255,0.82)",
  fontSize: "14px",
  fontWeight: 600,
};

const content = {
  minWidth: 0,
};