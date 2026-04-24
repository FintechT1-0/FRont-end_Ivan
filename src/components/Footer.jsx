import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";

export default function Footer() {
  const { lang } = useLang();

  const t =
    lang === "ua"
      ? {
          brand: "FinTech UniVerse",
          desc: "Платформа для курсів, інсайтів та AI асистента",
          navigation: "Навігація",
          account: "Акаунт",
          home: "Головна",
          courses: "Курси",
          insights: "Інсайти",
          login: "Увійти",
          register: "Реєстрація",
          admin: "Адмін",
          rights: "© FinTech UniVerse. Усі права захищено",
        }
      : {
          brand: "FinTech UniVerse",
          desc: "Platform for courses, insights and AI assistant",
          navigation: "Navigation",
          account: "Account",
          home: "Home",
          courses: "Courses",
          insights: "Insights",
          login: "Login",
          register: "Register",
          admin: "Admin",
          rights: "© FinTech UniVerse. All rights reserved",
        };

  return (
    <footer className="bg-[#082947] px-3 pb-4 pt-3 md:px-6 md:pb-8 md:pt-6">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="rounded-[28px] border border-white/10 px-5 py-5 md:rounded-[30px] md:px-10 md:py-9"
          style={{
            background:
              "linear-gradient(180deg, rgba(19,54,90,0.82) 0%, rgba(10,37,67,0.9) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.22)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div className="grid grid-cols-[1.35fr_0.9fr_0.9fr] gap-5 md:grid-cols-[1.6fr_0.8fr_0.8fr] md:gap-10">
            <div>
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={Logo}
                  alt="FinTech UniVerse"
                  className="h-5 w-auto object-contain md:h-8"
                />
                <div className="text-[14px] font-semibold text-white md:text-[20px]">
                  {t.brand}
                </div>
              </div>

              <p className="mt-4 max-w-[420px] text-[10px] leading-[1.45] text-white/85 md:mt-6 md:text-[18px]">
                {t.desc}
              </p>

              <div className="mt-8 text-[9px] text-white/60 md:mt-14 md:text-sm">
                {t.rights}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold text-white md:text-[18px]">
                {t.navigation}
              </div>

              <div className="mt-3 flex flex-col gap-2 text-[10px] text-white/90 md:mt-4 md:gap-3 md:text-[16px]">
                <Link to="/" className="transition hover:text-white">
                  {t.home}
                </Link>
                <Link to="/courses" className="transition hover:text-white">
                  {t.courses}
                </Link>
                <Link to="/insights" className="transition hover:text-white">
                  {t.insights}
                </Link>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold text-white md:text-[18px]">
                {t.account}
              </div>

              <div className="mt-3 flex flex-col gap-2 text-[10px] text-white/90 md:mt-4 md:gap-3 md:text-[16px]">
                <Link to="/login" className="transition hover:text-white">
                  {t.login}
                </Link>
                <Link to="/register" className="transition hover:text-white">
                  {t.register}
                </Link>
                <Link to="/admin/auth" className="transition hover:text-white">
                  {t.admin}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}