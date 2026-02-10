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
      title: en ? "Sign In" : "Вхід",
      email: "E-mail",
      password: en ? "Password" : "Пароль",
      btn: en ? "Sign In" : "Увійти",
      signup: en ? "Create account" : "Зареєструватися",
      admin: en ? "For admin" : "Для адміна",
      back: en ? "Back" : "Назад",
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

  function handleBack() {
    const nextRaw = params.get("next");
    if (nextRaw) navigate(decodeURIComponent(nextRaw));
    else navigate("/", { replace: true });
  }

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

  const showResend = err.toLowerCase().includes("verified") || err.toLowerCase().includes("not verified");

  return (
    <div className="fixed inset-0 bg-[#0E3A73] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-8 relative">
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 text-xl opacity-80 hover:opacity-100"
          title={t.back}
          type="button"
        >
          ✕
        </button>

        <h1 className="text-3xl font-semibold">{t.title}</h1>

        {info ? (
          <div className="mt-4 bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-3 text-sm">
            {info}
          </div>
        ) : null}

        {err ? (
          <div className="mt-4 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm">
            {err}
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

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#A94F5E] hover:opacity-90 disabled:opacity-60 transition"
            type="submit"
          >
            {t.btn}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/85">
          <Link to="/register" className="underline">
            {t.signup}
          </Link>
          <Link to="/admin-auth" className="underline">
            {t.admin}
          </Link>
        </div>
      </div>
    </div>
  );
}