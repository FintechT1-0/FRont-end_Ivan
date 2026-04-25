import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const PAGE_BG = "#56677F";
const NAVY = "#082947";
const RED = "#B3131A";

function TopLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={{
        color: "#FFFFFF",
        textDecoration: "none",
        fontSize: "10px",
        fontWeight: 500,
      }}
    >
      {children}
    </NavLink>
  );
}

function SideLink({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        height: "38px",
        padding: "0 18px",
        borderRadius: "999px",
        textDecoration: "none",
        color: "#FFFFFF",
        fontSize: "12px",
        fontWeight: 600,
        background: isActive
          ? "linear-gradient(180deg, #123A61 0%, #082947 100%)"
          : "transparent",
        border: isActive
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid transparent",
      })}
    >
      {children}
    </NavLink>
  );
}

export default function AdminPage() {
  const { lang, toggleLang } = useLang();
  const { logout } = useAuth();

  const t = {
    main: lang === "ua" ? "Головна" : "Main",
    courses: lang === "ua" ? "Курси" : "Courses",
    insights: lang === "ua" ? "Інсайди" : "Insights",
    partners: lang === "ua" ? "Партнери" : "Partners",
    dashboard: lang === "ua" ? "Панель" : "Dashboard",
    activity: lang === "ua" ? "Активність" : "Activity/Logs",
    users: lang === "ua" ? "Користувачі" : "Users",
    settings: lang === "ua" ? "Налаштування" : "Settings",
    logout: lang === "ua" ? "Вийти" : "Sign out",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            height: "56px",
            borderRadius: "999px",
            display: "grid",
            gridTemplateColumns: "150px 1fr 150px",
            alignItems: "center",
            padding: "0 18px",
            background:
              "linear-gradient(180deg, rgba(86,105,130,0.96) 0%, rgba(77,96,122,0.96) 100%)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            marginLeft: "170px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "44px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, #123A61 0%, #082947 100%)",
              border: "1px solid rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 18px rgba(0,0,0,0.18)",
              transform: "translateX(-145px)",
            }}
          >
            <img
              src={Logo}
              alt="FinTech UniVerse"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
              }}
            />
          </div>

          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "34px",
            }}
          >
            <TopLink to="/">{t.main}</TopLink>
            <TopLink to="/courses">{t.courses}</TopLink>
            <TopLink to="/insights">{t.insights}</TopLink>
            <TopLink to="/partners">{t.partners}</TopLink>
          </nav>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button type="button" onClick={toggleLang} style={langButton}>
              {lang === "ua" ? "EN" : "UA"}
            </button>

            <button type="button" onClick={logout} style={logoutButton}>
              {t.logout}
            </button>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "170px 1fr",
            marginTop: "18px",
            minHeight: "700px",
          }}
        >
          <aside
            style={{
              background: NAVY,
              padding: "28px 14px",
              minHeight: "700px",
            }}
          >
            <div style={{ display: "grid", gap: "14px" }}>
              <SideLink to="/admin" end>
                {t.dashboard}
              </SideLink>
              <SideLink to="/admin/activity">{t.activity}</SideLink>
              <SideLink to="/admin/users">{t.users}</SideLink>
              <SideLink to="/admin/courses">{t.courses}</SideLink>
              <SideLink to="/admin/settings">{t.settings}</SideLink>
            </div>
          </aside>

          <main
            style={{
              padding: "28px 24px 0",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

const langButton = {
  minWidth: "42px",
  height: "24px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#FFFFFF",
  fontSize: "10px",
  fontWeight: 700,
  cursor: "pointer",
};

const logoutButton = {
  minWidth: "70px",
  height: "24px",
  border: "none",
  borderRadius: "999px",
  background: RED,
  color: "#FFFFFF",
  fontSize: "10px",
  fontWeight: 700,
  cursor: "pointer",
};