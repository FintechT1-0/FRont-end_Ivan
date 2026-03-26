import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

function HeaderLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `transition hover:text-white ${
          isActive ? "text-white" : "text-white/85"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { lang, toggleLang } = useLang();
  const { user, token, initializing, refreshMe } = useAuth();
  const navigate = useNavigate();

  const nav = {
    main: { en: "Main", ua: "Головна" },
    courses: { en: "Courses", ua: "Курси" },
    insights: { en: "Insights", ua: "Інсайди" },
    partners: { en: "Partners", ua: "Партнери" },
    signIn: { en: "Sign In", ua: "Увійти" },
  };

  const goCabinet = async () => {
    if (initializing) return;

    let u = user;

    if (!u && token) {
      try {
        u = await refreshMe();
      } catch {
        u = null;
      }
    }

    if (!u) return navigate("/login?next=%2Fcabinet");
    if (u.role === "admin") return navigate("/admin");
    return navigate("/cabinet");
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-3 pt-3 sm:px-4 md:px-6 md:pt-5">
        <div
          className="rounded-[26px] border border-white/20 px-4 py-3 md:rounded-[30px] md:px-8 md:py-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(29,66,101,0.62) 0%, rgba(19,52,87,0.52) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 35px rgba(0,0,0,0.18), 0 0 30px rgba(255,255,255,0.04)",
          }}
        >
          <div className="hidden md:flex items-center">
            <img src={Logo} alt="FinTech UniVerse" className="h-10 w-auto shrink-0" />

            <nav className="ml-auto flex items-center gap-7 text-lg">
              <HeaderLink to="/">{nav.main[lang]}</HeaderLink>
              <HeaderLink to="/courses">{nav.courses[lang]}</HeaderLink>
              <HeaderLink to="/insights">{nav.insights[lang]}</HeaderLink>
              <HeaderLink to="/partners">{nav.partners[lang]}</HeaderLink>
            </nav>

            <div className="ml-8 flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white transition"
                type="button"
              >
                {lang === "en" ? "UA" : "EN"}
              </button>

              <button
                onClick={goCabinet}
                className="px-5 py-2 rounded-full bg-[#A0141A] hover:opacity-90 transition text-white text-sm"
                type="button"
              >
                {nav.signIn[lang]}
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="FinTech UniVerse" className="h-8 w-auto shrink-0" />

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={toggleLang}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition"
                  type="button"
                >
                  {lang === "en" ? "UA" : "EN"}
                </button>

                <button
                  onClick={goCabinet}
                  className="px-4 py-1.5 rounded-full bg-[#A0141A] hover:opacity-90 transition text-white text-xs"
                  type="button"
                >
                  {nav.signIn[lang]}
                </button>
              </div>
            </div>

            <nav className="mt-3 flex items-center justify-end gap-4 text-xs sm:text-sm">
              <HeaderLink to="/">{nav.main[lang]}</HeaderLink>
              <HeaderLink to="/courses">{nav.courses[lang]}</HeaderLink>
              <HeaderLink to="/insights">{nav.insights[lang]}</HeaderLink>
              <HeaderLink to="/partners">{nav.partners[lang]}</HeaderLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}