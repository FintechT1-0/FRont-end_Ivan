import React, { createContext, useContext, useState, useCallback } from "react"
import Toast from "../components/Toast.jsx"

const ToastCtx = createContext({ notify: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const notify = useCallback((msg, type = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])
  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
        <div className="flex flex-col gap-2 w-full max-w-md px-4">
          {toasts.map((t) => (
            <Toast key={t.id} type={t.type} msg={t.msg} />
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
