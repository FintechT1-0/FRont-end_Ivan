import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

export default function LoginPage() {
  const { lang } = useLang();
  const { refreshMe } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const next = useMemo(() => params.get("next") || "/cabinet", [params]);

  const handleLogin = async (formData) => {
    try {
      setLoading(true);

      const data = await loginUser(formData);
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      const me = await refreshMe();

      if (me?.role === "admin") {
        navigate("/admin");
        return;
      }

      navigate(next);
    } catch (error) {
      alert(
        getBackendError(
          error,
          lang === "ua" ? "Не вдалося увійти" : "Failed to sign in"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      initialMode="login"
      onLogin={handleLogin}
      loading={loading}
      lang={lang}
    />
  );
}