import { createContext, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const setAuthToken = (t) => {
    const val = t || "";
    setToken(val);
    if (val) localStorage.setItem("token", val);
    else localStorage.removeItem("token");
  };

  const logout = () => {
    setAuthToken("");
    setUser(null);
  };

  const refreshMe = async () => {
    const t = localStorage.getItem("token");
    if (!t) return null;

    const { data } = await client.get("/auth/me");
    setUser(data || null);
    return data || null;
  };

  const login = async ({ email, password }) => {
    const { data } = await client.post("/auth/login", { email, password });
    setAuthToken(data?.token);
    setUser(data?.user || null);
    return data;
  };

  const register = async (payload) => {
    const { data } = await client.post("/auth/register", payload);
    if (data?.token) setAuthToken(data.token);
    if (data?.user) setUser(data.user);
    return data;
  };

  useEffect(() => {
    let alive = true;

    async function init() {
      setInitializing(true);

      try {
        if (!token) {
          if (alive) setUser(null);
          return;
        }

        const { data } = await client.get("/auth/me");
        if (!alive) return;

        setUser(data || null);
      } catch {
        if (!alive) return;
        logout();
      } finally {
        if (!alive) return;
        setInitializing(false);
      }
    }

    init();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      isAuthed: Boolean(token),
      login,
      register,
      logout,
      refreshMe,
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