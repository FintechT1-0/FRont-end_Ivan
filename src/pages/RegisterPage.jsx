import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { lang } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const t = useMemo(() => {
    const en = lang === "en";
    return {
      title: en ? "CREATE ACCOUNT" : "СТВОРИТИ АКАУНТ",
      subtitle: en
        ? "or use your email for registration:"
        : "або використай email для реєстрації:",
      name: en ? "Name" : "Ім’я",
      surname: en ? "Surname" : "Прізвище",
      email: "Email",
      password: en ? "Password" : "Пароль",
      btn: en ? "Sign up" : "Зареєструватися",
      signin: en ? "Sign in" : "Увійти",
      welcome: en ? "WELCOME BACK!" : "З ПОВЕРНЕННЯМ!",
      welcomeText: en
        ? "To keep connected with us please login with your personal info"
        : "Щоб залишатись з нами, увійди, використовуючи свої персональні дані",
      ok: en
        ? "Account created. Check your email to verify it, then sign in."
        : "Акаунт створено. Підтвердь пошту в листі, після цього увійди.",
    };
  }, [lang]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);

    try {
      await register({ name, surname, email, password });
      setInfo(t.ok);
      setTimeout(() => {
        navigate("/login?verification=pending", { replace: true });
      }, 700);
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      setErr(detail || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#102744]">
      <div className="min-h-screen grid md:grid-cols-[1fr_1.7fr]">
        <div className="relative overflow-hidden bg-[#071F43] flex items-center justify-center px-8 py-14">
          <div
            className="absolute top-10 left-12 w-10 h-10 bg-[#6a83a6]"
            style={{ transform: "rotate(23deg)" }}
          />

          <div
            className="absolute bg-[#50647D]"
            style={{
              width: "144px",
              height: "144px",
              top: "331px",
              left: "-57px",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              transform: "rotate(-168.24deg)",
              transformOrigin: "center",
            }}
          />

          <div className="absolute top-[52%] right-3 w-8 h-8 rounded-full bg-[#6a83a6]" />

          <div className="absolute bottom-[-10px] left-[-6px] w-64 h-64 bg-[#6a83a6] rounded-tr-full" />

          <div
            className="absolute bottom-24 right-20 w-10 h-4 bg-[#6a83a6]"
            style={{ transform: "rotate(28deg)" }}
          />

          <div className="relative z-10 max-w-[360px] text-center text-white">
            <h2 className="text-[44px] xl:text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em]">
              {t.welcome}
            </h2>

            <p className="mt-16 text-[22px] leading-[1.35] text-white/95">
              {t.welcomeText}
            </p>

            <div className="mt-20">
              <Link
                to="/login"
                className="inline-flex items-center justify-center min-w-[165px] h-14 rounded-full border border-white/70 text-white text-[18px] font-semibold hover:bg-white/10 transition px-10"
              >
                {t.signin}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-12 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-[700px]">
            <h1 className="text-center text-[42px] md:text-[56px] xl:text-[64px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#102744]">
              {t.title}
            </h1>

            <p className="mt-20 text-center text-[22px] leading-none text-[#314b66]">
              {t.subtitle}
            </p>

            {info ? (
              <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-base text-emerald-800">
                {info}
              </div>
            ) : null}

            {err ? (
              <div className="mt-8 rounded-2xl border border-rose-300 bg-rose-50 px-5 py-4 text-base text-rose-800">
                {err}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-10 space-y-4">
              <input
                className="w-full h-16 rounded-full bg-[#dfe4eb] px-7 outline-none text-[18px] text-[#44566c] placeholder:text-[#44566c]"
                placeholder={t.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="given-name"
              />

              <input
                className="w-full h-16 rounded-full bg-[#dfe4eb] px-7 outline-none text-[18px] text-[#44566c] placeholder:text-[#44566c]"
                placeholder={t.surname}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                autoComplete="family-name"
              />

              <input
                className="w-full h-16 rounded-full bg-[#dfe4eb] px-7 outline-none text-[18px] text-[#44566c] placeholder:text-[#44566c]"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
              />

              <input
                className="w-full h-16 rounded-full bg-[#dfe4eb] px-7 outline-none text-[18px] text-[#44566c] placeholder:text-[#44566c]"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />

              <div className="pt-12 flex justify-center">
                <button
                  disabled={loading}
                  className="min-w-[180px] h-14 rounded-full bg-[#b30808] hover:opacity-90 disabled:opacity-60 transition text-white text-[18px] font-semibold px-10"
                  type="submit"
                >
                  {loading ? "..." : t.btn}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}