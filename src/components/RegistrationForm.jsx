import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister, checkEmail as apiCheckEmail } from "../service/auth";

const NAME_RE = /^[A-Za-zА-Яа-яІіЇїЄєҐґ' -]{2,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASS_MIN = 8;

export default function RegistrationForm() {
  const nav = useNavigate();
  const alive = useRef(true);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => () => { alive.current = false; }, []);

  async function checkEmailExists(value) {
    try {
      if (!EMAIL_RE.test(value)) return setEmailTaken(false);
      const res = await apiCheckEmail(value.trim());
      setEmailTaken(Boolean(res?.exists));
    } catch {}
  }

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Вкажіть ім'я";
    else if (!NAME_RE.test(name.trim())) e.name = "2–50 символів, лише літери";
    if (!surname.trim()) e.surname = "Вкажіть прізвище";
    else if (!NAME_RE.test(surname.trim())) e.surname = "2–50 символів, лише літери";
    if (!email.trim()) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Некоректний email";
    else if (emailTaken) e.email = "Email вже використовується";
    if (!password) e.password = "Вкажіть пароль";
    else if (password.length < PASS_MIN) e.password = `Мінімум ${PASS_MIN} символів`;
    if (!agree) e.agree = "Потрібна згода";
    return e;
  }, [name, surname, email, emailTaken, password, agree]);

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, surname: true, email: true, password: true, agree: true });
    setFormError(null);
    if (!isValid) return;

    const payload = { name: name.trim(), surname: surname.trim(), email: email.trim(), password };

    try {
      setSubmitting(true);
      await apiRegister(payload);
      if (!alive.current) return;
      nav("/login", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 422) {
        const detail = data?.detail;
        const map = {};
        if (Array.isArray(detail)) {
          detail.forEach((d) => {
            const loc = Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : null;
            if (loc && typeof d?.msg === "string") map[loc] = d.msg;
          });
        } else if (data?.errors && typeof data.errors === "object") {
          Object.assign(map, data.errors);
        }
        const firstMsg = map.name || map.surname || map.email || map.password || "Дані не пройшли валідацію";
        setFormError(firstMsg);
      } else if (status === 409) {
        setEmailTaken(true);
        setTouched((t) => ({ ...t, email: true }));
        setFormError("Email вже використовується");
      } else if (status >= 400) {
        setFormError(data?.message || data?.detail || "Не вдалося зареєструватись");
      } else {
        setFormError("Мережева помилка");
      }
    } finally {
      if (alive.current) setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#e7e4df]">
      <div className="w-full max-w-lg">
        <div className="mx-4 rounded-2xl bg-[#d9d9db] p-8">
          <div className="text-center text-2xl font-semibold mb-8">Sign Up</div>

          {formError && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label className="block text-sm mb-2">login</label>
              <input
                className={`w-full rounded-2xl px-4 py-3 bg-[#e8eefc] outline-none ring-0 border ${
                  touched.name && errors.name ? "border-rose-300" : "border-slate-300"
                }`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                autoComplete="given-name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">e-mail</label>
              <input
                className={`w-full rounded-2xl px-4 py-3 bg-[#e8eefc] outline-none ring-0 border ${
                  touched.email && errors.email ? "border-rose-300" : "border-slate-300"
                }`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => { setTouched((t) => ({ ...t, email: true })); checkEmailExists(email); }}
                autoComplete="email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">password</label>
              <input
                className={`w-full rounded-2xl px-4 py-3 bg-[#e8eefc] outline-none ring-0 border ${
                  touched.password && errors.password ? "border-rose-300" : "border-slate-300"
                }`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                autoComplete="new-password"
              />
            </div>

            <label className="flex items-center gap-3 mb-6 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="appearance-none w-5 h-5 rounded-full border border-slate-700 grid place-items-center"
              />
              <span className="text-[15px]">I Agree To The Terms And Conditions</span>
            </label>

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full rounded-2xl bg-[#eeece7] py-3 text-lg font-semibold disabled:opacity-50"
            >
              {submitting ? "Створюємо…" : "Sign Up"}
            </button>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="underline">sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
