import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Container from "../components/Container";

const linkBase =
  "block rounded-xl px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition text-base md:text-lg";
const linkActive = "bg-white/15 text-white";

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
    >
      {children}
    </NavLink>
  );
}

function Tile({ title, subtitle, className = "" }) {
  return (
    <div className={`rounded-[56px] ${className}`}>
      <div className="p-7 md:p-8 text-white">
        <div className="text-xl md:text-2xl font-light tracking-wide">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-3 text-sm md:text-base text-white/85 leading-relaxed">
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function UserCabinetPage() {
  const navigate = useNavigate();
  const { user, loadingUser, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarW = isSidebarOpen ? 280 : 84;

  const fullName = useMemo(() => {
    if (!user) return "";
    const name = `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
    return name || user?.login || user?.email || "User";
  }, [user]);

  const handleLogout = () => {
    logout(); // clears token in context
    navigate("/login", { replace: true });
  };

  // Optional: if context still loading
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#2E5D8C] flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  // If someone opened /cabinet without auth (ProtectedRoute should prevent it, but just in case)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#2E5D8C] flex items-center justify-center text-white text-lg">
        Not authorized
      </div>
    );
  }

  return (
    <Layout hideHeader>
      <section className="bg-white">
        <Container variant="wide" className="py-6">
          <div className="overflow-hidden rounded-[42px] bg-[#2E5D8C]">
            <div className="flex min-h-[760px] relative">
              {/* SIDEBAR */}
              <aside
                className="bg-[#0E3B72] text-white relative shrink-0 transition-[width] duration-300 ease-out"
                style={{ width: sidebarW }}
              >
                {/* top area (no X, no back arrow here) */}
                <div className="px-5 pt-5">
                  <div className="h-11 w-11 rounded bg-white/0" />
                </div>

                {/* menu (only when open) */}
                <div className={`mt-10 px-4 ${isSidebarOpen ? "" : "hidden"}`}>
                  <div className="space-y-2">
                    <SidebarLink to="/">Main</SidebarLink>
                    <SidebarLink to="/courses">Courses</SidebarLink>
                    <SidebarLink to="/insights">Insights</SidebarLink>
                    <SidebarLink to="/partners">Partners</SidebarLink>

                    <div className="h-4" />

                    <SidebarLink to="/cabinet">User cabinet</SidebarLink>
                    <SidebarLink to="/admin">Admin panel</SidebarLink>
                  </div>
                </div>

                {/* TOGGLE arrow */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((v) => !v)}
                  aria-label="Toggle sidebar"
                  className="absolute top-1/2 -right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-[#0E3B72] shadow-[0_8px_18px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition"
                  title={isSidebarOpen ? "Hide menu" : "Show menu"}
                >
                  <span className="text-xl leading-none">
                    {isSidebarOpen ? "‹" : "›"}
                  </span>
                </button>

                {/* bottom white area + Logout */}
                <div className="absolute bottom-0 left-0 right-0 bg-white">
                  <div className="px-4 py-4">
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-[#0E3B72] text-white py-3 text-base md:text-lg hover:bg-[#0b2f5a] transition"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </aside>

              {/* CONTENT */}
              <main className="flex-1 p-8 md:p-10">
                {/* Top white bar with real user name */}
                <div className="flex justify-center">
                  <div className="w-full max-w-[720px] rounded-full bg-white px-6 py-4 text-center">
                    <span className="text-[#0E3B72] text-lg md:text-2xl font-medium tracking-wide">
                      {fullName}
                    </span>
                  </div>
                </div>

                {/* DESKTOP layout (matches your cabinet макет) */}
                <div className="mt-14 hidden lg:grid grid-cols-12 gap-10">
                  {/* 1) Learning progress */}
                  <Tile
                    title="Learning progress"
                    subtitle="Your current progress and milestones."
                    className="col-span-4 bg-[#A85D6B] h-[520px]"
                  />

                  {/* 2) Recommended courses */}
                  <Tile
                    title="Recommended courses"
                    subtitle="Selected based on your interests and activity."
                    className="col-span-4 bg-[#B1182D] h-[460px] mt-10"
                  />

                  {/* right column: 3 + 4 stacked */}
                  <div className="col-span-4 flex flex-col gap-10">
                    <Tile
                      title="Last visited course"
                      subtitle="Continue where you left off."
                      className="bg-[#A85D6B] h-[240px]"
                    />
                    <Tile
                      title="Newest insight"
                      subtitle="Latest update from Insights."
                      className="bg-[#A85D6B] h-[240px]"
                    />
                  </div>
                </div>

                {/* MOBILE/TABLET fallback */}
                <div className="mt-14 grid lg:hidden grid-cols-1 md:grid-cols-2 gap-8">
                  <Tile
                    title="Learning progress"
                    subtitle="Your current progress and milestones."
                    className="bg-[#A85D6B] h-[420px] md:h-[460px]"
                  />
                  <Tile
                    title="Recommended courses"
                    subtitle="Selected based on your interests and activity."
                    className="bg-[#B1182D] h-[360px] md:h-[420px]"
                  />
                  <Tile
                    title="Last visited course"
                    subtitle="Continue where you left off."
                    className="bg-[#A85D6B] h-[240px]"
                  />
                  <Tile
                    title="Newest insight"
                    subtitle="Latest update from Insights."
                    className="bg-[#A85D6B] h-[240px]"
                  />
                </div>
              </main>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}