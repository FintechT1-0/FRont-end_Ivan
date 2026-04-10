import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const fieldStyle = {
  width: "100%",
  height: "54px",
  border: "none",
  outline: "none",
  borderRadius: "999px",
  background: "#E9EEF4",
  padding: "0 18px",
  fontSize: "14px",
  color: "#18324B",
};

const primaryButton = {
  minWidth: "130px",
  height: "44px",
  border: "none",
  borderRadius: "999px",
  background: "#B3131A",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(179,19,26,0.24)",
};

const secondaryButton = {
  minWidth: "136px",
  height: "44px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.72)",
  background: "transparent",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

function FloatingShape({ style, delay = "0s", duration = "7s" }) {
  return (
    <span
      style={{
        position: "absolute",
        display: "block",
        animation: `floatShape ${duration} ease-in-out ${delay} infinite`,
        ...style,
      }}
    />
  );
}

function SidePanel({ mode, onSwitch, lang }) {
  const text =
    mode === "login"
      ? {
          title: lang === "ua" ? "ПРИВІТ!" : "HELLO, FRIEND!",
          body:
            lang === "ua"
              ? "Введи свої персональні дані та почни шлях разом з нами"
              : "Enter your personal details and start journey with us",
          button: lang === "ua" ? "Реєстрація" : "Sign up",
        }
      : {
          title: lang === "ua" ? "З ПОВЕРНЕННЯМ!" : "WELCOME BACK!",
          body:
            lang === "ua"
              ? "Щоб продовжити, увійди зі своїми персональними даними"
              : "To keep connected with us please login with your personal info",
          button: lang === "ua" ? "Увійти" : "Sign in",
        };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "34px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(8,38,72,1) 0%, rgba(6,31,59,1) 100%)",
        color: "#ffffff",
        boxShadow: "0 26px 60px rgba(0,0,0,0.22)",
      }}
    >
      <FloatingShape
        delay="0s"
        duration="8s"
        style={{
          width: "220px",
          height: "220px",
          background: "rgba(110,132,165,0.75)",
          borderRadius: mode === "login" ? "0 0 0 100%" : "0 100% 0 0",
          left: mode === "login" ? "-42px" : "auto",
          right: mode === "login" ? "auto" : "-42px",
          bottom: mode === "login" ? "-54px" : "auto",
          top: mode === "login" ? "auto" : "-54px",
        }}
      />

      <FloatingShape
        delay="0.5s"
        duration="6.8s"
        style={{
          width: "0",
          height: "0",
          borderLeft: "34px solid transparent",
          borderRight: "34px solid transparent",
          borderBottom: "62px solid rgba(110,132,165,0.82)",
          transform: mode === "login" ? "rotate(-20deg)" : "rotate(100deg)",
          top: mode === "login" ? "150px" : "42px",
          left: mode === "login" ? "34px" : "auto",
          right: mode === "login" ? "auto" : "38px",
        }}
      />

      <FloatingShape
        delay="1.2s"
        duration="7.8s"
        style={{
          width: "22px",
          height: "22px",
          background: "rgba(110,132,165,0.9)",
          transform: "rotate(24deg)",
          top: "34px",
          left: mode === "login" ? "34px" : "auto",
          right: mode === "login" ? "auto" : "34px",
        }}
      />

      <FloatingShape
        delay="0.9s"
        duration="9s"
        style={{
          width: "18px",
          height: "18px",
          background: "rgba(110,132,165,0.9)",
          transform: "rotate(24deg)",
          bottom: "34px",
          left: mode === "login" ? "auto" : "160px",
          right: mode === "login" ? "38px" : "auto",
        }}
      />

      <FloatingShape
        delay="0.4s"
        duration="8.7s"
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "rgba(110,132,165,0.95)",
          top: mode === "login" ? "208px" : "300px",
          left: mode === "login" ? "44px" : "auto",
          right: mode === "login" ? "auto" : "26px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "320px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "58px",
              lineHeight: 1.02,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {text.title}
          </h2>

          <p
            style={{
              margin: "30px 0 36px",
              color: "rgba(255,255,255,0.84)",
              lineHeight: 1.55,
              fontSize: "16px",
            }}
          >
            {text.body}
          </p>

          <button type="button" style={secondaryButton} onClick={onSwitch}>
            {text.button}
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthForm({
  mode,
  lang,
  loading,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLoginSubmit,
  onRegisterSubmit,
}) {
  const text = useMemo(() => {
    return {
      signInTitle: lang === "ua" ? "УВІЙТИ У FINTECH" : "SIGN IN TO FINTECH",
      signUpTitle: lang === "ua" ? "СТВОРИТИ АКАУНТ" : "CREATE ACCOUNT",
      loginSub:
        lang === "ua"
          ? "або використай свій email"
          : "or use your email account:",
      registerSub:
        lang === "ua"
          ? "або використай email для реєстрації"
          : "or use your email for registration:",
      email: "Email",
      password: lang === "ua" ? "Пароль" : "Password",
      name: lang === "ua" ? "Ім'я" : "Name",
      surname: lang === "ua" ? "Прізвище" : "Surname",
      signIn: lang === "ua" ? "Увійти" : "Sign in",
      signUp: lang === "ua" ? "Реєстрація" : "Sign up",
    };
  }, [lang]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: mode === "login" ? "420px" : "470px",
      }}
    >
      {mode === "login" ? (
        <form onSubmit={onLoginSubmit}>
          <h1
            style={{
              margin: 0,
              textAlign: "center",
              color: "#0A2645",
              fontSize: "62px",
              lineHeight: 1.04,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {text.signInTitle}
          </h1>

          <p
            style={{
              margin: "34px 0 18px",
              textAlign: "center",
              color: "#5E7287",
              fontSize: "15px",
            }}
          >
            {text.loginSub}
          </p>

          <div
            style={{
              display: "grid",
              gap: "14px",
              maxWidth: "340px",
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              placeholder={text.email}
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              style={fieldStyle}
            />

            <input
              type="password"
              placeholder={text.password}
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              style={fieldStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "34px",
            }}
          >
            <button type="submit" style={primaryButton} disabled={loading}>
              {loading ? "..." : text.signIn}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onRegisterSubmit}>
          <h1
            style={{
              margin: 0,
              textAlign: "center",
              color: "#0A2645",
              fontSize: "56px",
              lineHeight: 1.04,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {text.signUpTitle}
          </h1>

          <p
            style={{
              margin: "34px 0 18px",
              textAlign: "center",
              color: "#5E7287",
              fontSize: "15px",
            }}
          >
            {text.registerSub}
          </p>

          <div
            style={{
              display: "grid",
              gap: "12px",
              maxWidth: "360px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              placeholder={text.name}
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              style={fieldStyle}
            />

            <input
              type="text"
              placeholder={text.surname}
              value={registerForm.surname}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  surname: e.target.value,
                }))
              }
              style={fieldStyle}
            />

            <input
              type="email"
              placeholder={text.email}
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              style={fieldStyle}
            />

            <input
              type="password"
              placeholder={text.password}
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              style={fieldStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "34px",
            }}
          >
            <button type="submit" style={primaryButton} disabled={loading}>
              {loading ? "..." : text.signUp}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AuthCard({
  initialMode = "login",
  onLogin,
  onRegister,
  loading = false,
  lang = "ua",
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const switchMode = () => {
    const next = mode === "login" ? "register" : "login";
    setMode(next);
    navigate(next === "login" ? "/login" : "/register");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (onLogin) {
      await onLogin(loginForm);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (onRegister) {
      await onRegister(registerForm);
    }
  };

  const panelOnLeft = mode === "register";

  return (
    <>
      <style>
        {`
          @keyframes floatShape {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-14px) rotate(6deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          .auth-shell {
            position: relative;
            width: min(1260px, 100%);
            min-height: 760px;
            background: #f4f5f7;
            overflow: hidden;
          }

          .auth-panel {
            position: absolute;
            top: 50%;
            left: 0;
            width: 42%;
            height: 78%;
            transform: translate3d(0, -50%, 0);
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: transform;
            z-index: 3;
          }

          .auth-panel.left {
            transform: translate3d(0, -50%, 0);
          }

          .auth-panel.right {
            transform: translate3d(138.1%, -50%, 0);
          }

          .auth-form-side {
            position: absolute;
            top: 0;
            width: 58%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 30px;
            will-change: transform, opacity;
            z-index: 2;
          }

          .auth-form-login {
            left: 0;
            transition:
              opacity 420ms ease,
              transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .auth-form-register {
            right: 0;
            transition:
              opacity 420ms ease,
              transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          @media (max-width: 980px) {
            .auth-shell {
              min-height: auto;
              display: grid;
              gap: 24px;
            }

            .auth-panel,
            .auth-form-side {
              position: relative;
              top: auto;
              left: auto !important;
              right: auto !important;
              width: 100%;
              height: auto;
              transform: none !important;
            }

            .auth-panel {
              min-height: 420px;
              order: 2;
            }

            .auth-form-side {
              min-height: auto;
              padding: 10px 8px;
            }
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          background: "#F4F5F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
        }}
      >
        <div className="auth-shell">
          <div
            className="auth-form-side auth-form-login"
            style={{
              opacity: mode === "login" ? 1 : 0,
              transform:
                mode === "login"
                  ? "translate3d(0, 0, 0) scale(1)"
                  : "translate3d(-36px, 0, 0) scale(0.985)",
              pointerEvents: mode === "login" ? "auto" : "none",
            }}
          >
            <AuthForm
              mode="login"
              lang={lang}
              loading={loading}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              registerForm={registerForm}
              setRegisterForm={setRegisterForm}
              onLoginSubmit={handleLoginSubmit}
              onRegisterSubmit={handleRegisterSubmit}
            />
          </div>

          <div
            className="auth-form-side auth-form-register"
            style={{
              opacity: mode === "register" ? 1 : 0,
              transform:
                mode === "register"
                  ? "translate3d(0, 0, 0) scale(1)"
                  : "translate3d(36px, 0, 0) scale(0.985)",
              pointerEvents: mode === "register" ? "auto" : "none",
            }}
          >
            <AuthForm
              mode="register"
              lang={lang}
              loading={loading}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              registerForm={registerForm}
              setRegisterForm={setRegisterForm}
              onLoginSubmit={handleLoginSubmit}
              onRegisterSubmit={handleRegisterSubmit}
            />
          </div>

          <div className={`auth-panel ${panelOnLeft ? "left" : "right"}`}>
            <SidePanel mode={mode} onSwitch={switchMode} lang={lang} />
          </div>
        </div>
      </div>
    </>
  );
}