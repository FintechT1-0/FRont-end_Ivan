import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

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
      console.error(error);
      alert(lang === "ua" ? "Не вдалося увійти" : "Failed to sign in");
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