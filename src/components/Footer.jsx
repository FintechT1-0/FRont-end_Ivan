import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useLang } from "../context/LanguageContext";

const glassFooter = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: "rgba(255,255,255,0.86)",
        textDecoration: "none",
        fontSize: "14px",
      }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const { lang } = useLang();

  const t = {
    title: "FinTech UniVerse",
    description:
      lang === "ua"
        ? "Платформа для курсів, інсайтів та AI-асистента"
        : "Platform for courses, insights and AI assistant",
    navigation: lang === "ua" ? "Навігація" : "Navigation",
    account: lang === "ua" ? "Акаунт" : "Account",
    admin: lang === "ua" ? "Адмін" : "Admin",
    home: lang === "ua" ? "Головна" : "Home",
    courses: lang === "ua" ? "Курси" : "Courses",
    insights: lang === "ua" ? "Інсайди" : "Insights",
    login: lang === "ua" ? "Увійти" : "Login",
    register: lang === "ua" ? "Реєстрація" : "Register",
    rights:
      lang === "ua"
        ? "Усі права захищено"
        : "All rights reserved",
  };

  return (
    <footer
      style={{
        background: "#082947",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            ...glassFooter,
            borderRadius: "24px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "24px",
              color: "#fff",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={Logo} alt="logo" style={{ width: "40px" }} />
                <span style={{ fontWeight: 600 }}>{t.title}</span>
              </div>

              <p style={{ marginTop: "10px", opacity: 0.8 }}>
                {t.description}
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 600 }}>{t.navigation}</p>
              <FooterLink to="/">{t.home}</FooterLink>
              <br />
              <FooterLink to="/courses">{t.courses}</FooterLink>
              <br />
              <FooterLink to="/insights">{t.insights}</FooterLink>
            </div>

            <div>
              <p style={{ fontWeight: 600 }}>{t.account}</p>
              <FooterLink to="/login">{t.login}</FooterLink>
              <br />
              <FooterLink to="/register">{t.register}</FooterLink>
              <br />
              <FooterLink to="/admin/auth">{t.admin}</FooterLink>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "12px",
              opacity: 0.6,
            }}
          >
            © FinTech UniVerse. {t.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}