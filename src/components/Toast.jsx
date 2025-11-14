import React from "react";

export default function Toast({ type = "info", message, onClose }) {
  if (!message) return null;
  const base = "fixed top-4 right-4 z-50 rounded-xl shadow px-4 py-3";
  const tone =
    type === "error"
      ? "bg-rose-600 text-white"
      : type === "success"
      ? "bg-emerald-600 text-white"
      : "bg-slate-800 text-white";
  return (
    <div className={`${base} ${tone}`}>
      <div className="flex items-start gap-3">
        <div className="text-sm">{message}</div>
        <button className="text-xs opacity-80 hover:opacity-100" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
