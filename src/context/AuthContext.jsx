import { createContext, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    let alive = true;

    async function init() {
      setInitializing(true);

      if (!token) {
        if (!alive) return;
        setUser(null);
        setInitializing(false);
        return;
      }

      try {
        const { data } = await client.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!alive) return;
        setUser(data || null);
      } catch {
        if (!alive) return;
        setToken("");
        setUser(null);
      } finally {
        if (!alive) return;
        setInitializing(false);
      }
    }

    init();
    return () => {
      alive = false;
    };
  }, [token]);

  async function login({ email, password }) {
    const { data } = await client.post("/auth/login", { email, password });
    setToken(data?.token || "");
    setUser(data?.user || null);
    return data;
  }

  async function register(payload) {
    const { data } = await client.post("/auth/register", payload);
    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      isAuthed: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}