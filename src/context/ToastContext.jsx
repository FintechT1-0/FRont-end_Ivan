import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastCtx = createContext({ show: () => {} });

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("info");

  const show = useCallback((message, t = "info", ms = 2500) => {
    setType(t);
    setMsg(message);
    if (ms) setTimeout(() => setMsg(null), ms);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <Toast type={type} message={msg} onClose={() => setMsg(null)} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
