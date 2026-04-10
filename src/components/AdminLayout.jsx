import { NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const shellBg = "#6E819B";

const topGlass = {
  background:
    "linear-gradient(180deg, rgba(77, 97, 123, 0.92) 0%, rgba(91, 111, 137, 0.92) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 36px rgba(0,0,0,0.16)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function TopLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.88)",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: 400,
      })}
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
        minHeight: "42px",
        padding: "0 14px",
        borderRadius: "999px",
        textDecoration: "none",
        color: "#FFFFFF",
        fontSize: "13px",
        fontWeight: 500,
        background: isActive
          ? "linear-gradient(180deg, rgba(20,57,95,0.98) 0%, rgba(10,39,70,0.98) 100%)"
          : "transparent",
        border: isActive ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent",
        boxShadow: isActive ? "0 10px 20px rgba(0,0,0,0.18)" : "none",
      })}
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { lang, toggleLang } = useLang();
  const { logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: shellBg,
        padding: "24px 16px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...topGlass,
            borderRadius: "999px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "86px",
              height: "44px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "14px",
              background:
                "linear-gradient(180deg, rgba(23,67,109,0.95) 0%, rgba(15,46,79,0.95) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              flexShrink: 0,
            }}
          >
            <img
              src={Logo}
              alt="FinTech UniVerse"
              style={{
                width: "34px",
                height: "34px",
                objectFit: "contain",
              }}
            />
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "34px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <TopLink to="/">{lang === "ua" ? "Головна" : "Main"}</TopLink>
            <TopLink to="/courses">{lang === "ua" ? "Курси" : "Courses"}</TopLink>
            <TopLink to="/insights">{lang === "ua" ? "Інсайди" : "Insights"}</TopLink>
            <TopLink to="/partners">{lang === "ua" ? "Партнери" : "Partners"}</TopLink>
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={toggleLang}
              style={{
                minWidth: "48px",
                height: "34px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.05)",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              {lang === "ua" ? "EN" : "UA"}
            </button>

            <button
              type="button"
              onClick={logout}
              style={{
                minWidth: "80px",
                height: "34px",
                border: "none",
                borderRadius: "999px",
                background: "#B3131A",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
              }}
            >
              {lang === "ua" ? "Вийти" : "Sign out"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "92px 1fr",
            gap: "0",
            minHeight: "760px",
          }}
        >
          <aside
            style={{
              background: "#082947",
              borderRadius: "0 0 0 0",
              padding: "18px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <SideLink to="/admin" end>
              {lang === "ua" ? "Панель" : "Dashboard"}
            </SideLink>

            <SideLink to="/admin/activity">
              {lang === "ua" ? "Активність" : "Activity/Logs"}
            </SideLink>

            <SideLink to="/admin/users">
              {lang === "ua" ? "Користувачі" : "Users"}
            </SideLink>

            <SideLink to="/admin/courses">
              {lang === "ua" ? "Курси" : "Courses"}
            </SideLink>

            <SideLink to="/admin/settings">
              {lang === "ua" ? "Налаштування" : "Settings"}
            </SideLink>
          </aside>

          <main
            style={{
              background: shellBg,
              padding: "22px 14px 14px",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}