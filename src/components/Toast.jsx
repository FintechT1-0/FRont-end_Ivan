import React from "react"

export default function Toast({ msg, type = "info" }) {
  const color =
    type === "error"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : type === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-slate-50 text-slate-800 border-slate-200"
  return (
    <div className={`rounded-xl border px-3 py-2 shadow-sm ${color}`}>
      {msg}
    </div>
  )
}
