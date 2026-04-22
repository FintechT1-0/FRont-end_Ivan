import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { registerUser, resendVerification } from "../api/auth";
import { useLang } from "../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;
  const message = error?.response?.data?.message;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export default function RegisterPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showResend, setShowResend] = useState(false);

  const [info, setInfo] = useState("");
  const [errorText, setErrorText] = useState("");

  const t = {
    created:
      lang === "ua"
        ? "Акаунт створено. Перевір пошту для підтвердження."
        : "Account created. Check your email for verification.",
    resend:
      lang === "ua"
        ? "Повторно надіслати лист"
        : "Resend verification email",
    resendOk:
      lang === "ua"
        ? "Лист повторно надіслано."
        : "Verification email has been sent again.",
    resendFail:
      lang === "ua"
        ? "Не вдалося повторно надіслати лист"
        : "Failed to resend verification email",
    registerFail:
      lang === "ua"
        ? "Не вдалося зареєструватися"
        : "Failed to sign up",
    backToLogin:
      lang === "ua"
        ? "Перейти до входу"
        : "Go to login",
  };

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setInfo("");
      setErrorText("");

      await registerUser(formData);

      setRegisteredEmail(formData.email || "");
      setShowResend(true);
      setInfo(t.created);
    } catch (error) {
      setErrorText(getBackendError(error, t.registerFail));

      if (formData?.email) {
        setRegisteredEmail(formData.email);
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;

    try {
      setResendLoading(true);
      setInfo("");
      setErrorText("");

      await resendVerification({ email: registeredEmail });
      setInfo(t.resendOk);
    } catch (error) {
      setErrorText(getBackendError(error, t.resendFail));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F5F7",
        position: "relative",
      }}
    >
      <AuthCard
        initialMode="register"
        onRegister={handleRegister}
        loading={loading}
        lang={lang}
      />

      {(info || errorText || showResend) && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            width: "min(92vw, 560px)",
            zIndex: 60,
            borderRadius: "22px",
            padding: "18px",
            background:
              "linear-gradient(180deg, rgba(19,54,90,0.92) 0%, rgba(10,37,67,0.96) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
            color: "#FFFFFF",
          }}
        >
          {info ? (
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: showResend ? "14px" : 0,
              }}
            >
              {info}
            </div>
          ) : null}

          {errorText ? (
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#FFD7D7",
                marginBottom: showResend ? "14px" : 0,
              }}
            >
              {errorText}
            </div>
          ) : null}

          {showResend ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || !registeredEmail}
                style={{
                  minWidth: "210px",
                  height: "42px",
                  border: "none",
                  borderRadius: "999px",
                  background: "#B3131A",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: resendLoading || !registeredEmail ? "default" : "pointer",
                  opacity: resendLoading || !registeredEmail ? 0.7 : 1,
                  boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                }}
              >
                {resendLoading ? "..." : t.resend}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  minWidth: "150px",
                  height: "42px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "transparent",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {t.backToLogin}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}