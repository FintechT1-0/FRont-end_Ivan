import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null); // можна заповнити пізніше, коли /me буде ок
  const [loadingUser, setLoadingUser] = useState(false);

  const isAuthed = !!token;

  useEffect(() => {
    // якщо хочеш: тут можна потім підключити /me, але зараз не чіпаємо
    // щоб не вилітало на 401 / PRO FEATURE ONLY
  }, []);

  async function login(identity, password) {
    const data = await authApi.login({ identity, password });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    // якщо бекенд повертає user — можна setUser(data.user)
    return data;
  }

  async function register(payload) {
    return authApi.register(payload);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user, // поки може бути null
      loadingUser,
      isAuthed,
      login,
      register,
      logout,
      setUser, // на майбутнє
    }),
    [token, user, loadingUser, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}