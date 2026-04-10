import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { getInsightsEn, getInsightsUa } from "../api/insights";
import SafeImage from "../components/SafeImage";

function sanitizeHtml(html) {
  if (!html) return "";
  let out = String(html);

  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\son\w+="[^"]*"/gi, "");
  out = out.replace(/\son\w+='[^']*'/gi, "");
  out = out.replace(/\sstyle="[^"]*"/gi, "");
  out = out.replace(/\sstyle='[^']*'/gi, "");

  return out;
}

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

export default function InsightDetailsPage() {
  const { lang } = useLang();
  const [params] = useSearchParams();
  const urlParam = params.get("u") || "";

  const url = useMemo(() => {
    try {
      return decodeURIComponent(urlParam);
    } catch {
      return urlParam;
    }
  }, [urlParam]);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    return {
      loading: lang === "en" ? "Loading..." : "Завантаження...",
      notFound: lang === "en" ? "Insight not found" : "Інсайт не знайдено",
      back: lang === "en" ? "Back" : "Назад",
      source: lang === "en" ? "Open original source" : "Відкрити джерело",
      summary: lang === "en" ? "Summary" : "Коротко",
      full: lang === "en" ? "Full text" : "Повний текст",
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

        const list = Array.isArray(data) ? data : [];
        const found = list.find((x) => x.url === url) || null;

        setItem(found);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setItem(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (!url) {
      setItem(null);
      setLoading(false);
      return;
    }

    load();

    return () => {
      alive = false;
    };
  }, [lang, url]);

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white">
        <div className="mx-auto max-w-5xl px-6 py-10 text-center">
          {t.loading}
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div style={glassCard} className="rounded-[28px] p-8">
            <div className="text-xl font-semibold">{t.notFound}</div>

            <div className="mt-4">
              <Link
                to="/insights"
                className="text-white/90 underline hover:text-white"
              >
                ← {t.back}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasImg = Boolean(item?.image || item?.thumbnail);
  const summary = item.excerpt || "";
  const html = sanitizeHtml(item.content || "");

  const Placeholder = () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/70">
      {t.noImage}
    </div>
  );

  return (
    <div className="min-h-[90vh] bg-[#082947] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white"
          >
            ← <span className="underline">{t.back}</span>
          </Link>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-5 py-2 text-sm font-medium text-white"
            style={{
              background: "#B3131A",
              boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
            }}
          >
            {t.source}
          </a>
        </div>

        <article style={glassCard} className="rounded-[28px] overflow-hidden">

          <div className="h-[360px] bg-[#6F86A4]/70">
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

          <div className="p-8 md:p-10">

            <div className="flex justify-between text-[12px] text-white/70">
              <span>{item.category || ""}</span>
              <span>{item.date || ""}</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold">
              {item.title}
            </h1>

            {summary && (
              <section className="mt-8">
                <div className="text-sm font-semibold text-white/90">
                  {t.summary}
                </div>
                <p className="mt-2 text-white/85 leading-7">
                  {summary}
                </p>
              </section>
            )}

            <section className="mt-10">
              <div className="text-sm font-semibold text-white/90">
                {t.full}
              </div>

              <div
                className="
                  prose prose-invert mt-4 max-w-none text-white/90
                  prose-p:my-3
                  prose-a:text-white prose-a:underline
                  prose-strong:text-white
                "
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </section>

          </div>
        </article>

      </div>
    </div>
  );
}