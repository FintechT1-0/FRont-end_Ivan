import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

function HeaderLink({ to, children, mobile = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          mobile ? "text-[10px] leading-none" : "text-sm md:text-[15px] leading-none",
          "transition-colors duration-200 whitespace-nowrap",
          isActive ? "text-white font-medium" : "text-white/80 hover:text-white",
        ].join(" ")
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
    insights: { en: "Insights", ua: "Insights" },
    partners: { en: "Partners", ua: "Partners" },
    signIn: { en: "Sign In", ua: "Увійти" },
    cabinet: { en: "Cabinet", ua: "Кабінет" },
  };

  const goCabinet = async () => {
    if (initializing) return;

    let currentUser = user;

    if (!currentUser && token) {
      try {
        currentUser = await refreshMe();
      } catch {
        currentUser = null;
      }
    }

    if (!currentUser) {
      navigate("/login?next=%2Fcabinet");
      return;
    }

    if (currentUser.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/cabinet");
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto w-full max-w-[1280px] px-3 pt-3 md:px-6 md:pt-6">
        <div
          className="relative overflow-hidden rounded-[26px] border border-white/15 px-3 py-3 md:rounded-[34px] md:px-6 md:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(22,58,94,0.92) 0%, rgba(14,43,73,0.95) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 40px rgba(0,0,0,0.25)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.08), transparent 35%)",
            }}
          />

          <div className="relative hidden items-center md:flex">
            <NavLink
              to="/"
              className="flex h-[58px] w-[150px] items-center rounded-[999px] border border-white/10 pl-4"
              style={{
                background:
                  "linear-gradient(180deg, rgba(31,76,121,0.95) 0%, rgba(18,49,81,0.96) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={Logo}
                alt="FinTech UniVerse"
                className="h-[34px] w-auto object-contain"
              />
            </NavLink>

            <nav className="mx-auto flex items-center gap-10">
              <HeaderLink to="/">{nav.main[lang]}</HeaderLink>
              <HeaderLink to="/courses">{nav.courses[lang]}</HeaderLink>
              <HeaderLink to="/insights">{nav.insights[lang]}</HeaderLink>
              <HeaderLink to="/partners">{nav.partners[lang]}</HeaderLink>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLang}
                className="flex h-[38px] min-w-[52px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-white transition hover:bg-white/10"
              >
                {lang === "en" ? "UA" : "EN"}
              </button>

              <button
                type="button"
                onClick={goCabinet}
                className="flex h-[38px] items-center justify-center rounded-full bg-[#B3131A] px-5 text-sm font-medium text-white transition hover:opacity-90"
                style={{
                  boxShadow: "0 8px 20px rgba(179,19,26,0.32)",
                }}
              >
                {user ? nav.cabinet[lang] : nav.signIn[lang]}
              </button>
            </div>
          </div>

          <div className="relative md:hidden">
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className="flex h-[34px] w-[54px] shrink-0 items-center justify-center rounded-full border border-white/10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(31,76,121,0.95) 0%, rgba(18,49,81,0.96) 100%)",
                }}
              >
                <img
                  src={Logo}
                  alt="FinTech UniVerse"
                  className="h-[16px] w-auto object-contain"
                />
              </NavLink>

              <nav className="flex min-w-0 flex-1 items-center justify-center gap-3">
                <HeaderLink mobile to="/">
                  {nav.main[lang]}
                </HeaderLink>
                <HeaderLink mobile to="/courses">
                  {nav.courses[lang]}
                </HeaderLink>
                <HeaderLink mobile to="/insights">
                  {nav.insights[lang]}
                </HeaderLink>
                <HeaderLink mobile to="/partners">
                  {nav.partners[lang]}
                </HeaderLink>
              </nav>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="flex h-[30px] min-w-[34px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-2 text-[9px] font-medium text-white"
                >
                  {lang === "en" ? "UA" : "EN"}
                </button>

                <button
                  type="button"
                  onClick={goCabinet}
                  className="flex h-[30px] shrink-0 items-center justify-center rounded-full bg-[#B3131A] px-3 text-[9px] font-medium text-white"
                >
                  {user ? nav.cabinet[lang] : nav.signIn[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}