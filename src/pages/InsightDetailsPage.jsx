import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { getInsightsEn, getInsightsUa } from "../api/insights";
import SafeImage from "../components/SafeImage";

function sanitizeHtml(html) {
  if (!html) return "";
  let out = String(html);

  // remove script tags
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // remove inline event handlers like onclick=
  out = out.replace(/\son\w+="[^"]*"/gi, "");
  out = out.replace(/\son\w+='[^']*'/gi, "");

  // optionally remove style attributes (to keep design consistent)
  out = out.replace(/\sstyle="[^"]*"/gi, "");
  out = out.replace(/\sstyle='[^']*'/gi, "");

  return out;
}

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
      loading: lang === "en" ? "Loading…" : "Завантаження…",
      notFound: lang === "en" ? "Insight not found" : "Інсайт не знайдено",
      back: lang === "en" ? "Back" : "Назад",
      source: lang === "en" ? "Open original source" : "Відкрити оригінальне джерело",
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
      <div className="bg-[#0E3A73] text-white min-h-[90vh]">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">{t.loading}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-[#0E3A73] text-white min-h-[90vh]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-xl font-semibold">{t.notFound}</div>
          <div className="mt-4">
            <Link to="/insights" className="underline text-white/90 hover:text-white">
              ← {t.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasImg = Boolean(item?.image || item?.thumbnail);
  const summary = item.excerpt || "";
  const rawHtml = item.content || "";
  const html = sanitizeHtml(rawHtml);

  const Placeholder = () => (
    <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
      {t.noImage}
    </div>
  );

  return (
    <div className="bg-[#0E3A73] text-white min-h-[90vh]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white"
          >
            <span className="text-lg">←</span>
            <span className="underline">{t.back}</span>
          </Link>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition"
          >
            {t.source}
          </a>
        </div>

        <article className="bg-[#0B3D78] rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="h-[360px] bg-[#D9D9D9]">
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
            <div className="text-[12px] text-white/70 flex items-center justify-between gap-3">
              <span className="truncate">{item.category || ""}</span>
              <span className="shrink-0">{item.date || ""}</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight">
              {item.title}
            </h1>

            {summary ? (
              <section className="mt-8">
                <div className="text-sm font-semibold text-white/90">{t.summary}</div>
                <p className="mt-2 text-white/85 leading-7">{summary}</p>
              </section>
            ) : null}

            <section className="mt-10">
              <div className="text-sm font-semibold text-white/90">{t.full}</div>

              {/* Styled HTML content */}
              <div
                className="
                  mt-4 text-white/90 leading-7
                  max-w-none
                  prose prose-invert
                  prose-p:my-3
                  prose-a:text-white prose-a:underline prose-a:underline-offset-4
                  prose-strong:text-white
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:my-1
                  prose-blockquote:border-l prose-blockquote:border-white/30 prose-blockquote:pl-4 prose-blockquote:text-white/80
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