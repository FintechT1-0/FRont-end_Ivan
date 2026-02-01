import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition
     ${isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`;

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F3A5F] text-white flex flex-col">
        <div className="px-6 py-5 text-xl font-semibold border-b border-white/10">
          Admin Panel
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            Courses
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>
          <NavLink to="/admin/activity" className={linkClass}>
            Activity
          </NavLink>
          <NavLink to="/admin/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full h-10 rounded-md bg-white/10 hover:bg-white/20 transition text-sm"
          >
            Вийти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}