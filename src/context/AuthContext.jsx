// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, register as apiRegister, me as apiMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const loadMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const u = await apiMe();
      setUser(u);
    } catch (err) {
      // Якщо токен протух/невалідний — очищаємо
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ identity, email, password }) => {
    // Підтримка двох форматів:
    // 1) login({ identity, password }) - як у вашому api/auth.js
    // 2) login({ email, password }) - якщо десь так викликають
    const payload = identity ? { identity, password } : { identity: email, password };

    const data = await apiLogin(payload);
    // backend повертає { token, user }
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    // backend повертає UserInfo
    const createdUser = await apiRegister(payload);
    return createdUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthed = !!user;
  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      loadingUser,
      isAuthed,
      isAdmin,
      login,
      register,
      logout,
      reload: loadMe,
    }),
    [user, loadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}