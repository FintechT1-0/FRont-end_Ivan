import heroVideo from "../assets/hero-bg.mp4";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicClient from "../api/publicClient";
import { useLang } from "../context/LanguageContext";

function pickImage(item) {
  return item?.image || item?.thumbnail || null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const ua = lang === "ua";

  const t = useMemo(
    () => ({
      hero: ua
        ? "FinTech UniVerse — твій міст до фінансових знань"
        : "FinTech UniVerse — your gateway to financial knowledge",

      about: ua
        ? "Ми аналізуємо ринок освітніх програм, відстежуємо тренди та збираємо цінний FinTech-контент в одному місці."
        : "We analyze the landscape of educational programs, track trends, and curate high-value fintech content in one place.",

      coursesTitle: ua ? "Топ FinTech курси" : "Top FinTech Courses",
      coursesText: ua
        ? "Курси з’являться тут після наповнення адмін-панелі."
        : "Courses will appear here after admin panel content is added.",
      coursesCta: ua ? "Переглянути всі курси" : "View all courses",

      insightsTitle: ua ? "Найновіші інсайди" : "Latest Insights",
      insightsCta: ua ? "Переглянути інсайди" : "View insights",
      loading: ua ? "Завантаження…" : "Loading…",
      empty: ua ? "Поки що немає інсайтів" : "No insights yet",

      partners: ua
        ? "Наші партнери та провайдери контенту"
        : "Our partners and content providers",
      bottom: ua
        ? "Ми співпрацюємо з освітніми платформами та FinTech-компаніями, щоб моніторити найбільш релевантні можливості для користувачів."
        : "We collaborate with educational platforms and fintech companies to monitor the most relevant opportunities for our users.",
    }),
    [ua]
  );

  const [latestInsight, setLatestInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoadingInsight(true);
      try {
        const endpoint = lang === "en" ? "/insights/en" : "/insights/ua";
        const res = await publicClient.get(endpoint);
        const list = res?.data || [];
        const newest = Array.isArray(list) ? list[0] : null;
        if (alive) setLatestInsight(newest || null);
      } catch {
        if (alive) setLatestInsight(null);
      } finally {
        if (alive) setLoadingInsight(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [lang]);

  const insightImg = pickImage(latestInsight);

  return (
    <div className="w-full">
      <section className="relative w-full h-[760px] overflow-hidden bg-[#0D3C6A]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[#0D3C6A]/55" />

        <div className="relative mx-auto max-w-[1400px] px-6 h-full flex items-end pb-20">
          <h1 className="text-[44px] md:text-[56px] font-light text-white">
            {t.hero}
          </h1>
        </div>
      </section>

      <section className="w-full bg-[#9C5B66]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 text-center">
          <p className="text-[28px] md:text-[40px] font-light leading-snug text-white">
            {t.about}
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-[1400px] px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-[#9C5B66] p-16 flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="text-[44px] font-light mb-10 text-white">
                {t.coursesTitle}
              </div>

              <div className="text-white/90 text-[18px] leading-relaxed max-w-[460px]">
                {t.coursesText}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="text-center underline text-white"
            >
              {t.coursesCta}
            </button>
          </div>

          <div className="bg-[#0B3F7A] p-16 flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="text-[44px] font-light mb-10 text-right text-white">
                {t.insightsTitle}
              </div>

              {loadingInsight ? (
                <div className="text-white/80 text-right">{t.loading}</div>
              ) : !latestInsight ? (
                <div className="text-white/80 text-[18px] leading-relaxed max-w-[520px] ml-auto text-right">
                  {t.empty}
                </div>
              ) : (
                <div className="max-w-[520px] ml-auto text-right">
                  {insightImg ? (
                    <div className="ml-auto mb-6 w-full max-w-[520px] h-[180px] bg-white/10 rounded-2xl overflow-hidden">
                      <img
                        src={insightImg}
                        alt={latestInsight?.title || "insight"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="text-white text-[22px] font-medium leading-snug line-clamp-2">
                    {latestInsight?.title || "—"}
                  </div>

                  <div className="mt-4 text-white/85 text-[16px] leading-relaxed line-clamp-4">
                    {latestInsight?.excerpt || ""}
                  </div>

                  <div className="mt-4 text-white/60 text-sm">
                    {latestInsight?.date || ""}{" "}
                    {latestInsight?.category ? `• ${latestInsight.category}` : ""}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/insights")}
              className="text-center underline text-white"
            >
              {t.insightsCta}
            </button>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#3E658F]">
        <div className="mx-auto max-w-[1400px] px-6 py-24">
          <div className="text-center text-[44px] font-light mb-12 text-white">
            {t.partners}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="bg-white rounded-[44px] h-[420px]" />
            <div className="bg-white rounded-[44px] h-[520px]" />
            <div className="bg-white rounded-[44px] h-[420px]" />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#BC0109]">
        <div className="mx-auto max-w-[1400px] px-6 py-28">
          <p className="text-[28px] md:text-[40px] font-light leading-snug max-w-[920px] text-white">
            {t.bottom}
          </p>
        </div>
      </section>
    </div>
  );
}