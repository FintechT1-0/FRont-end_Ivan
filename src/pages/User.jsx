import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "../service/auth";
import { clearToken } from "../utils/token";

export default function UserPage() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    me()
      .then((u) => {
        if (mounted) setUser(u?.user || u);
      })
      .catch(() => {
        clearToken();
        nav("/login", { replace: true });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [nav]);

  return (
    <div className="min-h-screen bg-[#e6e2dc] p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#e0ddd7] p-6">
        <div className="flex items-center gap-6 mb-8">
          <button onClick={() => nav("/login")} className="text-xl">×</button>
          <div className="h-16 w-16 rounded-full bg-[#a7a4a3] grid place-items-center text-white text-lg">
            {(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="h-1 w-32 rounded bg-white mb-2" />
            <div className="text-sm opacity-70">{user?.email || (loading ? "Loading..." : "No email")}</div>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => {
                clearToken();
                nav("/login", { replace: true });
              }}
              className="rounded-xl px-4 py-2 bg-black/70 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <div className="h-64 rounded-2xl bg-[#d7d7d7]" />
          </div>
          <div className="col-span-4">
            <div className="h-40 rounded-2xl bg-[#d7d7d7] mb-6" />
            <div className="h-28 rounded-2xl bg-[#d7d7d7]" />
          </div>
          <div className="col-span-4">
            <div className="h-32 rounded-2xl bg-[#d7d7d7] mb-6" />
            <div className="h-32 rounded-2xl bg-[#d7d7d7]" />
          </div>
          <div className="col-span-12">
            <div className="h-16 rounded-2xl bg-[#d7d7d7]" />
          </div>
        </div>
      </div>
    </div>
  );
}
