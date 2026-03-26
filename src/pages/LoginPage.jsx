import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { resendVerificationEmail } from "../api/auth";

export default function LoginPage() {
  const { lang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const t = useMemo(() => {
    const en = lang === "en";
    return {
      title: en ? "SIGN IN TO FINTECH" : "УВІЙТИ В FINTECH",
      subtitle: en ? "or use your email account:" : "або використай свій email:",
      email: en ? "Email" : "Email",
      password: en ? "Password" : "Пароль",
      btn: en ? "Sign in" : "Увійти",
      signup: en ? "Sign up" : "Зареєструватися",
      admin: en ? "For admin" : "Для адміна",
      hello: en ? "HELLO, FRIEND!" : "ПРИВІТ, ДРУЖЕ!",
      helloText: en
        ? "Enter your personal details and start journey with us"
        : "Введи свої дані та почни шлях разом з нами",
      invalid: en ? "Invalid email or password." : "Невірний e-mail або пароль.",
      notVerified: en
        ? "Email is not verified. Please confirm your email first."
        : "Пошта не підтверджена. Спочатку підтвердь e-mail.",
      resend: en ? "Resend verification email" : "Надіслати лист підтвердження ще раз",
      resendOk: en ? "Verification email sent." : "Лист підтвердження надіслано.",
      verifiedOk: en ? "Email verified. You can sign in." : "Пошту підтверджено. Можеш увійти.",
      verifiedFail: en ? "Email verification failed." : "Не вдалося підтвердити пошту.",
    };
  }, [lang]);

  useEffect(() => {
    const verification = params.get("verification");
    const reason = params.get("reason");

    if (verification === "true") {
      setInfo(t.verifiedOk);
      setErr("");
    } else if (verification === "false") {
      setInfo("");
      setErr(reason ? `${t.verifiedFail} ${reason}` : t.verifiedFail);
    }
  }, [params, t.verifiedOk, t.verifiedFail]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      const nextRaw = params.get("next");
      const next = nextRaw ? decodeURIComponent(nextRaw) : null;

      if (next) {
        navigate(next, { replace: true });
        return;
      }

      if (data?.user?.role === "admin") navigate("/admin", { replace: true });
      else navigate("/cabinet", { replace: true });
    } catch (e2) {
      const status = e2?.response?.status;
      const detail = e2?.response?.data?.detail;

      if (status === 403) {
        setErr(detail || t.notVerified);
      } else {
        setErr(detail || t.invalid);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    const mail = email.trim();
    if (!mail) return;

    setResendLoading(true);
    setErr("");
    setInfo("");

    try {
      const res = await resendVerificationEmail(mail);
      setInfo(res?.message || t.resendOk);
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      setErr(detail || "Error");
    } finally {
      setResendLoading(false);
    }
  }

  const showResend =
    err.toLowerCase().includes("verified") || err.toLowerCase().includes("not verified");

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#102744]">
      <div className="min-h-screen grid md:grid-cols-[1.7fr_1fr]">
        <div className="flex items-center justify-center px-8 py-12 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-[700px]">
            <h1 className="text-center text-[42px] md:text-[56px] xl:text-[64px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#102744]">
              {t.title}
            </h1>

            <p className="mt-24 text-center text-[22px] leading-none text-[#314b66]">
              {t.subtitle}
            </p>

            {info ? (
              <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-base text-emerald-800">
                {info}
              </div>
            ) : null}

            {err ? (
              <div className="mt-8 rounded-2xl border border-rose-300 bg-rose-50 px-5 py-4 text-base text-rose-800">
                <div>{err}</div>
                {showResend ? (
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resendLoading || !email.trim()}
                    className="mt-3 underline block disabled:opacity-60"
                  >
                    {resendLoading ? "..." : t.resend}
                  </button>
                ) : null}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-10 space-y-5">
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
                autoComplete="current-password"
              />

              <div className="pt-12 flex justify-center">
                <button
                  disabled={loading}
                  className="min-w-[165px] h-14 rounded-full bg-[#b30808] hover:opacity-90 disabled:opacity-60 transition text-white text-[18px] font-semibold px-10"
                  type="submit"
                >
                  {loading ? "..." : t.btn}
                </button>
              </div>
            </form>

            <div className="mt-10 flex items-center justify-center text-[18px] text-[#3a4f68]">
              <Link to="/admin-auth" className="underline underline-offset-4">
                {t.admin}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#071F43] flex items-center justify-center px-8 py-14">
          <div
            className="absolute top-[-18px] right-[-30px] w-56 h-56 bg-[#6a83a6]"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              transform: "rotate(-17deg)",
            }}
          />

          <div
            className="absolute bottom-[-26px] right-[-18px] w-36 h-36 bg-[#6a83a6]"
            style={{
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              transform: "rotate(-148deg)",
            }}
          />

          <div
            className="absolute top-[38%] left-12 w-12 h-4 bg-[#6a83a6]"
            style={{ transform: "rotate(-25deg)" }}
          />

          <div className="relative z-10 max-w-[440px] text-center text-white">
            <h2 className="text-[52px] xl:text-[60px] font-extrabold leading-[0.9] tracking-[-0.03em]">
              {t.hello}
            </h2>

            <p className="mt-16 text-[24px] leading-[1.4] text-white/95">
              {t.helloText}
            </p>

            <div className="mt-16">
              <Link
                to="/register"
                className="inline-flex items-center justify-center min-w-[170px] h-14 rounded-full border border-white/70 text-white text-[18px] font-semibold hover:bg-white/10 transition px-10"
              >
                {t.signup}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}