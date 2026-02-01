import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";

const linkBase =
  "block rounded-2xl px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition";
const linkActive = "bg-white/15 text-white";

function SidebarLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
    >
      {children}
    </NavLink>
  );
}

export default function UserLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(true);

  const sidebarW = open ? 300 : 92;

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-[#0E3A73] text-white min-h-[90vh]">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="rounded-[44px] overflow-hidden bg-[#2E5D8C]/90 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="flex min-h-[760px] relative">
            <aside
              className="bg-[#0B2F5A] shrink-0 transition-[width] duration-300 ease-out relative"
              style={{ width: sidebarW }}
            >
              <div className="h-20 px-5 flex items-center gap-3">
                <img src={Logo} alt="FinTech UniVerse" className="h-9 w-auto" />
                {open ? (
                  <div className="text-white/90 text-lg font-medium tracking-wide">
                    Cabinet
                  </div>
                ) : null}
              </div>

              <div className={`px-4 ${open ? "" : "hidden"}`}>
                <div className="space-y-2">
                  <SidebarLink to="/cabinet" end>
                    Dashboard
                  </SidebarLink>
                  <SidebarLink to="/cabinet/courses">My courses</SidebarLink>
                  <SidebarLink to="/cabinet/insights">Insights</SidebarLink>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="absolute top1/4 -right-5 -translate-y-1/2 h-11 w-11 rounded-full bg-white text-[#0B2F5A] shadow-[0_10px_25px_rgba(0,0,0,0.25)] grid place-items-center"
                aria-label="Toggle sidebar"
              >
                <span className="text-2xl leading-none">{open ? "‹" : "›"}</span>
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded-2xl bg-white text-[#0B2F5A] py-3 font-medium hover:opacity-95 transition"
                >
                  Logout
                </button>
              </div>
            </aside>

            <main className="flex-1 p-8 md:p-10">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}