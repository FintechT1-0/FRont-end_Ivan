import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("finu_user") || "null");
  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("finu_user");
    window.location.assign("/login");
  };
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-4">Вітаю, {user?.firstName || "користувач"}!</p>
        <button onClick={logout} className="rounded-xl bg-slate-800 text-white px-4 py-2">
          Вийти
        </button>
      </div>
    </div>
  );
}
