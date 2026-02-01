import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { getInsightsEn, getInsightsUa } from "../api/insights";
import SafeImage from "../components/SafeImage";

function safeText(v) {
  return typeof v === "string" ? v : "";
}

export default function InsightsPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "en" ? "Insider" : "Інсайди",
      search: lang === "en" ? "Search" : "Пошук",
      latest: lang === "en" ? "Latest" : "Найновіші",
      loading: lang === "en" ? "Loading…" : "Завантаження…",
      empty: lang === "en" ? "No insights found" : "Інсайдів не знайдено",
      read: lang === "en" ? "Read" : "Читати",
      noImage: lang === "en" ? "No image" : "Немає фото",
    };
  }, [lang]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const data = lang === "en" ? await getInsightsEn() : await getInsightsUa();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [lang]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((n) => {
      const hay = [
        safeText(n.title),
        safeText(n.excerpt),
        safeText(n.content),
        safeText(n.category),
        safeText(n.date),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [items, q]);

  const latest = filtered.slice(0, 6);
  const rest = filtered.slice(6, 24);

  function openDetails(item) {
    const u = encodeURIComponent(item.url || "");
    navigate(`/insights/view?u=${u}`);
  }

  const Placeholder = ({ className = "" }) => (
    <div className={`w-full h-full flex items-center justify-center text-white/70 text-sm ${className}`}>
      {t.noImage}
    </div>
  );

  const Tile = ({ item }) => {
    const hasImg = Boolean(item?.image || item?.thumbnail);
    return (
      <button
        type="button"
        onClick={() => openDetails(item)}
        className="min-w-[240px] max-w-[240px] text-left bg-white/10 rounded-2xl overflow-hidden hover:opacity-95 transition"
        title={item.title}
      >
        <div className="h-[140px] bg-[#D9D9D9]">
          {hasImg ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="p-3">
          <div className="text-[12px] text-white/70 flex items-center justify-between gap-2">
            <span className="truncate">{item.category || ""}</span>
            <span className="shrink-0">{item.date || ""}</span>
          </div>
          <div className="mt-2 font-semibold text-sm line-clamp-2">{item.title}</div>
        </div>
      </button>
    );
  };

  const CardText = ({ item }) => {
    const hasImg = Boolean(item?.image || item?.thumbnail);
    const preview = item.excerpt || item.content || "";
    return (
      <button
        type="button"
        onClick={() => openDetails(item)}
        className="text-left bg-white/10 rounded-3xl overflow-hidden hover:opacity-95 transition"
        title={item.title}
      >
        <div className="h-[200px] bg-[#D9D9D9]">
          {hasImg ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="p-5">
          <div className="text-[12px] text-white/70 flex items-center justify-between gap-2">
            <span className="truncate">{item.category || ""}</span>
            <span className="shrink-0">{item.date || ""}</span>
          </div>
          <div className="mt-2 text-lg font-semibold line-clamp-2">{item.title}</div>
          <div className="mt-2 text-sm text-white/80 line-clamp-3">{preview}</div>
          <div className="mt-4 text-sm underline text-white/90">{t.read}</div>
        </div>
      </button>
    );
  };

  const CardPhoto = ({ item }) => {
    const hasImg = Boolean(item?.image || item?.thumbnail);
    return (
      <button
        type="button"
        onClick={() => openDetails(item)}
        className="text-left bg-white/10 rounded-3xl overflow-hidden hover:opacity-95 transition"
        title={item.title}
      >
        <div className="h-[320px] bg-[#D9D9D9] relative">
          {hasImg ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Placeholder className="absolute inset-0" />
          )}

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-[12px] text-white/75 flex items-center justify-between gap-2">
              <span className="truncate">{item.category || ""}</span>
              <span className="shrink-0">{item.date || ""}</span>
            </div>
            <div className="mt-2 font-semibold line-clamp-2">{item.title}</div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-[#0E3A73] text-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-4xl font-semibold">{t.title}</h1>

          <div className="relative w-full max-w-[420px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.search}
              className="h-11 w-full rounded-xl bg-white/10 text-white px-4 pr-10 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80">🔍</span>
          </div>
        </div>

        <div className="mt-8 bg-[#0B3D78] rounded-[28px] p-6">
          {loading ? (
            <div className="text-center py-10">{t.loading}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 opacity-70">{t.empty}</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">{t.latest}</div>
              </div>

              <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
                {latest.map((item) => (
                  <Tile key={item.url} item={item} />
                ))}
              </div>

              <div className="mt-8 border-t border-white/15 pt-8">
                <div className="grid grid-cols-12 gap-6">
                  {rest.map((item, idx) => {
                    const isPhotoOnly = idx % 3 === 2;
                    return (
                      <div key={item.url} className="col-span-12 md:col-span-6 lg:col-span-4">
                        {isPhotoOnly ? <CardPhoto item={item} /> : <CardText item={item} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}