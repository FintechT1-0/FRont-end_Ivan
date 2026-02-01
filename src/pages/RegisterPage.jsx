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

  const t = useMemo(() => {
    return {
      title: lang === "en" ? "Sign Up" : "Реєстрація",
      name: lang === "en" ? "Name" : "Ім’я",
      surname: lang === "en" ? "Surname" : "Прізвище",
      email: lang === "en" ? "E-mail" : "E-mail",
      password: lang === "en" ? "Password" : "Пароль",
      btn: lang === "en" ? "Create account" : "Створити акаунт",
      signin: lang === "en" ? "Already have an account? Sign In" : "Вже є акаунт? Увійти",
      emailUsed: lang === "en" ? "This email is already in use." : "Ця пошта вже використовується.",
    };
  }, [lang]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register({ name, surname, email, password });
      navigate("/login", { replace: true });
    } catch (e2) {
      console.error(e2);
      const status = e2?.response?.status;
      setErr(status === 400 ? t.emailUsed : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] bg-[#0E3A73] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-semibold">{t.title}</h1>

        {err ? <div className="mt-4 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm">{err}</div> : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.surname}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
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
            minLength={8}
          />

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#A94F5E] hover:opacity-90 disabled:opacity-60 transition"
            type="submit"
          >
            {t.btn}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/85">
          <Link to="/login" className="underline">
            {t.signin}
          </Link>
        </div>
      </div>
    </div>
  );
}