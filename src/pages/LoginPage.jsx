import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

function mapReason(reason, lang) {
  const ua = lang !== "en";
  const r = String(reason || "").toLowerCase();

  if (!r) return ua ? "Верифікація не пройшла. Спробуйте ще раз." : "Verification failed. Please try again.";
  if (r.includes("expired") || r.includes("time"))
    return ua
      ? "Посилання застаріло. Запросіть новий лист для підтвердження."
      : "The link has expired. Request a new verification email.";
  if (r.includes("invalid") || r.includes("token"))
    return ua ? "Невірне або пошкоджене посилання підтвердження." : "Invalid verification link/token.";
  if (r.includes("already"))
    return ua ? "Пошта вже підтверджена. Можна входити." : "Email is already verified. You can sign in.";

  return ua ? `Причина: ${reason}` : `Reason: ${reason}`;
}

export default function LoginPage() {
  const { lang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [bannerClosed, setBannerClosed] = useState(false);

  const t = useMemo(
    () => ({
      title: lang === "en" ? "Sign In" : "Вхід",
      email: "E-mail",
      password: lang === "en" ? "Password" : "Пароль",
      btn: lang === "en" ? "Sign In" : "Увійти",
      signup: lang === "en" ? "Create account" : "Зареєструватися",
      admin: lang === "en" ? "For admin" : "Для адміна",
      back: lang === "en" ? "Back" : "Назад",
      invalid: lang === "en" ? "Invalid email or password." : "Невірний e-mail або пароль.",
      verifiedTitle: lang === "en" ? "Email verified" : "Пошту підтверджено",
      verifiedText: lang === "en" ? "You can now sign in." : "Тепер можна увійти в акаунт.",
      failedTitle: lang === "en" ? "Verification failed" : "Верифікація не вдалася",
      registeredTitle: lang === "en" ? "Check your email" : "Перевір пошту",
      registeredText:
        lang === "en"
          ? "We sent you a verification email. Confirm it, then sign in."
          : "Ми надіслали лист для підтвердження. Підтверди пошту і тоді увійди.",
      ok: "OK",
    }),
    [lang]
  );

  const verification = params.get("verification");
  const reason = params.get("reason");
  const registered = params.get("registered");

  const banner = useMemo(() => {
    if (bannerClosed) return null;

    if (verification === "true") {
      return { type: "success", title: t.verifiedTitle, text: t.verifiedText };
    }
    if (verification === "false") {
      return { type: "error", title: t.failedTitle, text: mapReason(reason, lang) };
    }
    if (registered === "true") {
      return { type: "info", title: t.registeredTitle, text: t.registeredText };
    }
    return null;
  }, [bannerClosed, verification, reason, registered, t, lang]);

  useEffect(() => {
    setBannerClosed(false);
  }, [verification, reason, registered]);

  function closeBanner() {
    const nextRaw = params.get("next");
    const next = nextRaw ? { next: nextRaw } : {};
    setParams(next, { replace: true });
    setBannerClosed(true);
  }

  function handleBack() {
    const nextRaw = params.get("next");
    if (nextRaw) {
      navigate(decodeURIComponent(nextRaw));
    } else {
      navigate("/", { replace: true });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
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
    } catch {
      setErr(t.invalid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] bg-[#0E3A73] text-white flex items-center justify-center px-6">
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

        {banner ? (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm flex items-start justify-between gap-3 ${
              banner.type === "success"
                ? "bg-emerald-500/15 border-emerald-400/30"
                : banner.type === "error"
                ? "bg-red-500/15 border-red-400/30"
                : "bg-white/10 border-white/15"
            }`}
          >
            <div>
              <div className="font-semibold">{banner.title}</div>
              <div className="mt-1 opacity-90">{banner.text}</div>
            </div>
            <button
              type="button"
              onClick={closeBanner}
              className="shrink-0 h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 transition"
            >
              {t.ok}
            </button>
          </div>
        ) : null}

        {err ? (
          <div className="mt-4 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm">
            {err}
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