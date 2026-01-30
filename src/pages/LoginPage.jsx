import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as authApi from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function onClose() {
    // повертаємось туди, звідки прийшли (Home/Courses/…)
    const from = location.state?.from || "/";
    navigate(from);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await authApi.login({ email: email.trim(), password });
      if (data?.token) localStorage.setItem("token", data.token);

      // після логіну → в кабінет
      navigate("/cabinet");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F3D6B] flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg bg-[#3E628A] rounded-2xl p-8 shadow-lg">
        {/* Close (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white text-xl leading-none hover:bg-white/25"
          aria-label="Close"
          title="Close"
        >
          ×
        </button>

        <h1 className="text-3xl font-semibold text-white text-center mb-8">
          Sign In
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-white/90 mb-2">E-mail</label>
            <input
              className="w-full h-12 rounded-xl px-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
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
              placeholder="Your password"
              autoComplete="current-password"
              required
              type="password"
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
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-2">
            <Link className="text-white/90 underline" to="/register">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}