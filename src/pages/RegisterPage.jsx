import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BackArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const from = useMemo(() => location.state?.from || "/", [location.state]);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  function goBack() {
    if (window.history.length > 1) nav(-1);
    else nav(from);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!name || !surname || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await register({ name, surname, email, password });
      setOk(true);
      setTimeout(() => {
        nav("/login", { replace: true, state: { from } });
      }, 300);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Registration failed";
      setError(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D3C6A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[520px] relative">
        <button
          type="button"
          onClick={goBack}
          className="absolute -top-14 left-0 flex items-center gap-2 text-white/90 hover:text-white"
          aria-label="Back"
        >
          <BackArrow />
          <span className="text-sm">Back</span>
        </button>

        <div className="rounded-[32px] bg-white/10 backdrop-blur-md border border-white/15 p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl md:text-3xl font-semibold">Create account</h1>
          <p className="mt-3 text-white/80">
            Register to access your user cabinet and courses.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm text-white/85 mb-2">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/15 border border-white/15 px-4 outline-none focus:border-white/35"
                placeholder="Name"
              />
            </div>

            <div>
              <label className="block text-sm text-white/85 mb-2">Surname</label>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/15 border border-white/15 px-4 outline-none focus:border-white/35"
                placeholder="Surname"
              />
            </div>

            <div>
              <label className="block text-sm text-white/85 mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-12 rounded-xl bg-white/15 border border-white/15 px-4 outline-none focus:border-white/35"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/85 mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full h-12 rounded-xl bg-white/15 border border-white/15 px-4 outline-none focus:border-white/35"
                placeholder="min 8 characters"
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {ok ? (
              <div className="rounded-xl bg-green-500/15 border border-green-400/30 px-4 py-3 text-sm text-green-100">
                Account created. Redirecting to login...
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#B80A0A] hover:opacity-90 disabled:opacity-60 font-semibold"
            >
              {loading ? "Loading..." : "Create account"}
            </button>

            <button
              type="button"
              onClick={() => nav("/login", { state: { from } })}
              className="w-full h-12 rounded-xl bg-white/15 hover:bg-white/20 border border-white/15"
            >
              I already have an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}