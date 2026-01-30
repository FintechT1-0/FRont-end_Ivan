import { NavLink } from "react-router-dom";

const navCls = ({ isActive }) =>
  `block rounded px-3 py-2 text-sm ${
    isActive ? "bg-white/15" : "hover:bg-white/10"
  }`;

export default function AdminLayout({ children, title = "Dashboard" }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block min-h-screen w-[220px] bg-[#2E5D8C] text-white">
          <div className="px-4 py-3 text-sm font-semibold">FinTech Admin</div>
          <nav className="mt-2 space-y-1 px-2">
            <NavLink to="/admin" className={navCls}>Dashboard</NavLink>
            <NavLink to="/admin/courses" className={navCls}>Courses</NavLink>
            <NavLink to="/admin/settings" className={navCls}>Settings</NavLink>
          </nav>
        </aside>

        <div className="flex-1">
          {/* Top bar */}
          <header className="flex items-center justify-between bg-[#2E5D8C] px-4 py-3 text-white">
            <div className="text-sm font-semibold">{title}</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="rounded bg-white/15 px-2 py-1">UA</div>
              <div className="rounded bg-white/10 px-2 py-1">EN</div>
              <div className="ml-2 h-9 w-9 rounded bg-white/15" />
            </div>
          </header>

          {/* Mobile nav */}
          <div className="md:hidden bg-[#2E5D8C] px-4 pb-3">
            <div className="flex gap-2">
              <NavLink to="/admin" className={() => "rounded bg-white/15 px-3 py-2 text-sm text-white"}>Dashboard</NavLink>
              <NavLink to="/admin/courses" className={() => "rounded bg-white/10 px-3 py-2 text-sm text-white"}>Courses</NavLink>
            </div>
          </div>

          <main className="p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}