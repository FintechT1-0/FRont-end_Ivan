import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInsights } from "../api/insights";
import { useLang } from "../context/LanguageContext";

export default function UserInsightsPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);

    getInsights(lang)
      .then((data) => {
        // API може повертати або масив, або об'єкт { items: [...] }
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

        if (!alive) return;
        // Якщо треба тільки 4 інсайди — залишай slice(0, 4)
        setItems(list.slice(0, 4));
      })
      .catch(() => {
        if (!alive) return;
        setItems([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [lang]);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-6">Інсайди</h1>

      {loading ? (
        <div className="text-white/70">Завантаження…</div>
      ) : items.length === 0 ? (
        <div className="text-white/70">Поки що немає інсайтів</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <button
              key={item.id ?? item.url ?? item.title}
              onClick={() => navigate("/insights/view", { state: { item } })}
              className="text-left rounded-2xl bg-white/10 p-5 hover:bg-white/15 transition"
            >
              <div className="font-semibold line-clamp-2">{item.title}</div>
              <div className="mt-2 text-sm text-white/80 line-clamp-3">
                {item.excerpt || ""}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
