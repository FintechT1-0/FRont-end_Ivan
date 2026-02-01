import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function AdminAuthPage() {
  const { lang } = useLang();
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "en" ? "Admin Sign Up" : "Реєстрація адміна",
      name: lang === "en" ? "Name" : "Ім’я",
      surname: lang === "en" ? "Surname" : "Прізвище",
      email: lang === "en" ? "E-mail" : "E-mail",
      password: lang === "en" ? "Password" : "Пароль",
      adminPass: lang === "en" ? "Admin password" : "Admin password",
      btn: lang === "en" ? "Sign Up (Admin)" : "Зареєструвати адміна",
      invalidAdmin: lang === "en" ? "Provided admin password is invalid." : "Невірний admin password.",
      emailUsed: lang === "en" ? "This email is already in use." : "Ця пошта вже використовується.",
      backLogin: lang === "en" ? "Back to Sign In" : "Назад до входу",
    };
  }, [lang]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register({ name, surname, email, password, admin_password: adminPassword });
      const data = await login({ email, password });
      if (data?.user?.role === "admin") navigate("/admin", { replace: true });
      else navigate("/cabinet", { replace: true });
    } catch (e2) {
      console.error(e2);
      const status = e2?.response?.status;
      if (status === 403) setErr(t.invalidAdmin);
      else if (status === 400) setErr(t.emailUsed);
      else setErr("Error");
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
          <input className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none" placeholder={t.surname} value={surname} onChange={(e) => setSurname(e.target.value)} required />
          <input className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} />
          <input className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none" placeholder={t.adminPass} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} type="password" required />

          <button disabled={loading} className="w-full h-11 rounded-xl bg-[#A94F5E] hover:opacity-90 disabled:opacity-60 transition" type="submit">
            {t.btn}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/85">
          <Link to="/login" className="underline">
            {t.backLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}