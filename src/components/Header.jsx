import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#2E5D8C]">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-6 gap-10">
        <img src={Logo} alt="FinTech UniVerse" className="h-10" />

        <nav className="flex gap-8 text-lg">
          <NavLink to="/">Main</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/partners">Partners</NavLink>
        </nav>

        <div className="ml-auto">
          <NavLink to="/login">👤</NavLink>
        </div>
      </div>
    </header>
  );
}