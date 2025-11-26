import React, { useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register, checkEmail } from "../service/auth.js"
import { useToast } from "../context/ToastContext.jsx"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const NAME_RE = /^[A-Z][a-z]{0,39}$/

function normalizeName(s) {
  s = s.trim()
  return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s
}

export default function RegistrationForm() {
  const nav = useNavigate()
  const { notify } = useToast()
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [emailWarn, setEmailWarn] = useState(null)

  const errors = useMemo(() => {
    const e = {}
    if (!name.trim()) e.name = "Вкажіть ім'я"
    else if (!NAME_RE.test(name.trim())) e.name = "Формат: Перша літера велика, далі малі (латиниця), до 40 символів."
    if (!surname.trim()) e.surname = "Вкажіть прізвище"
    else if (!NAME_RE.test(surname.trim())) e.surname = "Формат: Перша літера велика, далі малі (латиниця), до 40 символів."
    if (!email.trim()) e.email = "Вкажіть email"
    else if (!EMAIL_RE.test(email)) e.email = "Некоректний email"
    if (!password) e.password = "Вкажіть пароль"
    else if (password.length < 8) e.password = "Мінімум 8 символів"
    if (!confirmPassword) e.confirmPassword = "Повторіть пароль"
    else if (confirmPassword !== password) e.confirmPassword = "Паролі не збігаються"
    return e
  }, [name, surname, email, password, confirmPassword])

  const isValid = Object.keys(errors).length === 0
  const markTouched = (f) => setTouched((t) => ({ ...t, [f]: true }))

  async function handleCheckEmail() {
    setEmailWarn(null)
    if (!EMAIL_RE.test(email)) return
    try {
      const res = await checkEmail(email.trim())
      if (res?.exists) setEmailWarn("Email вже зайнятий")
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, surname: true, email: true, password: true, confirmPassword: true })
    setErrorMsg(null)
    if (!isValid) return
    try {
      setSubmitting(true)
      const payload = {
        name: normalizeName(name),
        surname: normalizeName(surname),
        email: email.trim(),
        password
      }
      await register(payload)
      notify("Акаунт створено. Увійдіть.", "success")
      nav("/login", { replace: true })
    } catch (err) {
      const status = err?.response?.status
      const data = err?.response?.data
      let msg = data?.message || data?.detail || "Не вдалося зареєструватись."
      if (status === 409) msg = "Email вже використовується"
      if (status === 422) {
        const detail = data?.detail
        const map = {}
        if (Array.isArray(detail)) {
          detail.forEach((d) => {
            const loc = Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : null
            if (loc && typeof d?.msg === "string") {
              map[loc] = /should match pattern/.test(d.msg)
                ? "Формат: перша літера велика, далі малі (латиниця), до 40 символів."
                : d.msg
            }
          })
        }
        if (map.name) msg = map.name
        if (map.surname) msg = map.surname
        if (map.email) msg = map.email
        if (map.password) msg = map.password
      }
      setErrorMsg(msg)
      notify("Помилка реєстрації", "error")
      console.log(err?.response?.data || err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">FinTech UniVerse 1.0</h1>
            <p className="text-sm text-slate-500">Реєстрація акаунта (MVP)</p>
          </header>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Ім'я</label>
              <input
                id="name"
                type="text"
                placeholder="Ваше ім'я"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${touched.name && errors.name ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { setName((v) => normalizeName(v)); markTouched("name") }}
                aria-invalid={Boolean(touched.name && errors.name)}
              />
              {touched.name && errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="surname" className="block text-sm font-medium text-slate-700">Прізвище</label>
              <input
                id="surname"
                type="text"
                placeholder="Ваше прізвище"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${touched.surname && errors.surname ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"}`}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onBlur={() => { setSurname((v) => normalizeName(v)); markTouched("surname") }}
                aria-invalid={Boolean(touched.surname && errors.surname)}
              />
              {touched.surname && errors.surname && <p className="mt-1 text-xs text-rose-600">{errors.surname}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${touched.email && errors.email ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => { markTouched("email"); handleCheckEmail() }}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              {!errors.email && emailWarn && <p className="mt-1 text-xs text-amber-600">{emailWarn}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Пароль</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${touched.password && errors.password ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                aria-invalid={Boolean(touched.password && errors.password)}
              />
              {touched.password && errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
              <p className="mt-1 text-[11px] text-slate-500">Мінімум 8 символів.</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Повторити пароль</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${touched.confirmPassword && errors.confirmPassword ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
                aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
              />
              {touched.confirmPassword && errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid || submitting}
              aria-busy={submitting}
            >
              {submitting ? "Створюємо акаунт…" : "Зареєструватись"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Вже маєте акаунт? <Link to="/login" className="text-indigo-600">Увійти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
