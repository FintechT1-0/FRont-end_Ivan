import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authApi from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await authApi.register({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password,
      });

      // Після успішної реєстрації — на логін
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F3D6B] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#3E628A] rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white text-center mb-8">
          Sign Up
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-white/90 mb-2">First name</label>
            <input
              className="w-full h-12 rounded-xl px-4 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ily"
              autoComplete="given-name"
              required
            />
            <p className="text-white/70 text-xs mt-1">
              Must start with a capital letter.
            </p>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Last name</label>
            <input
              className="w-full h-12 rounded-xl px-4 outline-none"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Vovk"
              autoComplete="family-name"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 mb-2">E-mail</label>
            <input
              className="w-full h-12 rounded-xl px-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              autoComplete="email"
              required
              type="email"
            />
          </div>

          <div>
            <label className="block text-white/90 mb-2">Password</label>
            <input
              className="w-full h-12 rounded-xl px-4 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              required
              type="password"
              minLength={8}
            />
          </div>

          {error ? (
            <div className="bg-[#BC0109] text-white px-4 py-3 rounded-xl">
              {error}
            </div>
          ) : null}

          <button
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#BC0109] text-white font-semibold disabled:opacity-60"
            type="submit"
          >
            {submitting ? "Signing up..." : "Sign Up"}
          </button>

          <div className="text-center mt-2">
            <Link className="text-white/90 underline" to="/login">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}