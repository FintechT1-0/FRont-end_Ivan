import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";

export default function Header() {
  const { lang, toggleLang } = useLang();

  const nav = {
    main: { en: "Main", ua: "Головна" },
    courses: { en: "Courses", ua: "Курси" },
    insights: { en: "Insights", ua: "Інсайди" },
    partners: { en: "Partners", ua: "Партнери" },
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2E5D8C]">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-6 gap-10">
        <img src={Logo} alt="FinTech UniVerse" className="h-10" />

        <nav className="flex gap-8 text-lg text-white">
          <NavLink to="/">{nav.main[lang]}</NavLink>
          <NavLink to="/courses">{nav.courses[lang]}</NavLink>
          <NavLink to="/insights">{nav.insights[lang]}</NavLink>
          <NavLink to="/partners">{nav.partners[lang]}</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {/* language switch */}
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 text-sm text-white"
          >
            {lang === "en" ? "UA" : "EN"}
          </button>

          {/* profile */}
          <NavLink to="/login" className="text-white text-lg">
            👤
          </NavLink>
        </div>
      </div>
    </header>
  );
}