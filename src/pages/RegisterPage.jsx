import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { registerUser } from "../api/auth";
import { useLang } from "../context/LanguageContext";

export default function RegisterPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      await registerUser(formData);
      alert(
        lang === "ua"
          ? "Акаунт створено. Перевір пошту для підтвердження."
          : "Account created. Check your email for verification."
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(lang === "ua" ? "Не вдалося зареєструватися" : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      initialMode="register"
      onRegister={handleRegister}
      loading={loading}
      lang={lang}
    />
  );
}