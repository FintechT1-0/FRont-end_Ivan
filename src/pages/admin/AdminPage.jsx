import { NavLink, Outlet } from "react-router-dom";

import Logo from "../../assets/Logo.png";

import { useLang } from "../../context/LanguageContext";

import { useAuth } from "../../context/AuthContext";

const PAGE_BG = "#70839F";

const NAVY = "#082947";

const RED = "#B3131A";

function TopLink({ to, children }) {

  return (

    <NavLink

      to={to}

      style={({ isActive }) => ({

        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.92)",

        textDecoration: "none",

        fontSize: "10px",

        fontWeight: 400,

        lineHeight: 1,

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

        width: "100%",

        minHeight: "34px",

        padding: "0 16px",

        borderRadius: "999px",

        textDecoration: "none",

        color: "#FFFFFF",

        fontSize: "11px",

        fontWeight: 500,

        lineHeight: 1,

        whiteSpace: "nowrap",

        background: isActive

          ? "linear-gradient(180deg, rgba(18,54,92,1) 0%, rgba(10,39,70,1) 100%)"

          : "transparent",

        border: isActive

          ? "1px solid rgba(255,255,255,0.10)"

          : "1px solid transparent",

        boxShadow: isActive ? "0 10px 20px rgba(0,0,0,0.18)" : "none",

      })}

    >

      {children}

    </NavLink>

  );

}

export default function AdminPage() {

  const { lang, toggleLang } = useLang();

  const { logout } = useAuth();

  return (

    <div

      style={{

        minHeight: "100vh",

        background: PAGE_BG,

        padding: "24px 0",

      }}

    >

      <div

        style={{

          width: "100%",

          maxWidth: "1240px",

          margin: "0 auto",

        }}

      >

        <div

          style={{

            width: "100%",

            minHeight: "760px",

            background: PAGE_BG,

          }}

        >

          <div

            style={{

              height: "58px",

              borderRadius: "999px",

              display: "grid",

              gridTemplateColumns: "92px 1fr 130px",

              alignItems: "center",

              padding: "0 14px",

              background:

                "linear-gradient(180deg, rgba(86,105,130,0.95) 0%, rgba(97,117,143,0.95) 100%)",

              border: "1px solid rgba(255,255,255,0.10)",

              boxShadow:

                "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 28px rgba(0,0,0,0.14)",

            }}

          >

            <div

              style={{

                width: "72px",

                height: "34px",

                borderRadius: "999px",

                display: "flex",

                alignItems: "center",

                paddingLeft: "14px",

                background:

                  "linear-gradient(180deg, rgba(24,67,109,0.98) 0%, rgba(13,44,77,0.98) 100%)",

                border: "1px solid rgba(255,255,255,0.08)",

                boxShadow: "0 8px 16px rgba(0,0,0,0.14)",

              }}

            >

              <img

                src={Logo}

                alt="FinTech UniVerse"

                style={{

                  width: "22px",

                  height: "22px",

                  objectFit: "contain",

                }}

              />

            </div>

            <nav

              style={{

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                gap: "30px",

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

                justifyContent: "flex-end",

                alignItems: "center",

                gap: "8px",

              }}

            >

              <button

                type="button"

                onClick={toggleLang}

                style={{

                  minWidth: "42px",

                  height: "28px",

                  borderRadius: "999px",

                  border: "1px solid rgba(255,255,255,0.18)",

                  background: "rgba(255,255,255,0.05)",

                  color: "#FFFFFF",

                  fontSize: "10px",

                  cursor: "pointer",

                }}

              >

                {lang === "ua" ? "EN" : "UA"}

              </button>

              <button

                type="button"

                onClick={logout}

                style={{

                  minWidth: "68px",

                  height: "28px",

                  border: "none",

                  borderRadius: "999px",

                  background: RED,

                  color: "#FFFFFF",

                  fontSize: "10px",

                  fontWeight: 600,

                  cursor: "pointer",

                  boxShadow: "0 8px 16px rgba(179,19,26,0.22)",

                }}

              >

                {lang === "ua" ? "Вийти" : "Sign out"}

              </button>

            </div>

          </div>

          <div

            style={{

              display: "grid",

              gridTemplateColumns: "128px 1fr",

              marginTop: "14px",

              minHeight: "688px",

            }}

          >

            <aside

              style={{

                background: NAVY,

                padding: "18px 12px",

              }}

            >

              <div

                style={{

                  display: "grid",

                  gap: "12px",

                }}

              >

                <SideLink to="/admin" end>

                  Dashboard

                </SideLink>

                <SideLink to="/admin/activity">

                  Activity/Logs

                </SideLink>

                <SideLink to="/admin/users">

                  Users

                </SideLink>

                <SideLink to="/admin/courses">

                  Courses

                </SideLink>

                <SideLink to="/admin/settings">

                  Settings

                </SideLink>

              </div>

            </aside>

            <main

              style={{

                padding: "18px 18px 0 16px",

              }}

            >

              <div

                style={{

                  width: "100%",

                  maxWidth: "980px",

                }}

              >

                <Outlet />

              </div>

            </main>

          </div>

        </div>

      </div>

    </div>

  );

}