import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const data = await authApi.me();
      setUser(data);
    } catch (_) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function login(email, password) {
    const data = await authApi.login({ email, password });

    if (data?.token) localStorage.setItem("token", data.token);

    if (data?.user) {
      setUser(data.user);
      setLoadingUser(false);
      return data;
    }

    await loadMe();
    return data;
  }

  async function register(payload) {
    const data = await authApi.register(payload);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loadingUser, login, register, logout, reload: loadMe }),
    [user, loadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}