// src/pages/UserInsightsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

function pickImage(item) {
  return item?.image || item?.thumbnail || null;
}

function Card({ item, onOpen }) {
  const img = pickImage(item);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-[28px] bg-white/10 hover:bg-white/15 transition overflow-hidden"
    >
      <div className="bg-white/10 h-[220px]">
        {img ? (
          <img
            src={img}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>

      <div className="p-5 text-white">
        <div className="text-sm text-white/70">{item.category || ""}</div>
        <div className="mt-2 text-base font-semibold line-clamp-2">
          {item.title}
        </div>
        <div className="mt-2 text-sm text-white/80 line-clamp-2">
          {item.excerpt || ""}
        </div>
        <div className="mt-4 text-xs text-white/60">{item.date || ""}</div>
      </div>
    </button>
  );
}

export default function UserInsightsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { lang } = useLang();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    const ua = lang !== "en";
    return {
      title: ua ? "Інсайди" : "Insights",
      newest: ua ? "Найновіші" : "Newest",
      all: ua ? "Усі новини" : "All news",
      loading: ua ? "Завантаження…" : "Loading…",
      empty: ua ? "Немає новин" : "No news",
    };
  }, [lang]);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const endpoint = lang === "en" ? "/insights/en" : "/insights/ua";

    async function load() {
      setLoading(true);
      try {
        const res = await client.get(endpoint, { headers });
        const list = res?.data || [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, lang]);

  const newest = items.slice(0, 6);

  const open = (item) => {
    navigate("/insights/view", { state: { item } });
  };

  return (
    <div className="text-white">
      <div className="text-2xl font-semibold">{t.title}</div>

      <div className="mt-8">
        <div className="text-lg font-semibold">{t.newest}</div>

        <div className="mt-4 flex gap-5 overflow-x-auto pb-4">
          {newest.map((item) => (
            <div key={item.url} className="min-w-[280px] max-w-[280px]">
              <Card item={item} onOpen={() => open(item)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="text-lg font-semibold">{t.all}</div>

        {loading ? (
          <div className="mt-4 text-white/80">{t.loading}</div>
        ) : items.length === 0 ? (
          <div className="mt-4 text-white/70">{t.empty}</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.url} item={item} onOpen={() => open(item)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}