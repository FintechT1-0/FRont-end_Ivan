import heroVideo from "../assets/hero-bg.mp4";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicClient from "../api/publicClient";
import { useLang } from "../context/LanguageContext";

function pickImage(item) {
  return item?.image || item?.thumbnail || null;
}

const glassCardStyle = {
  background:
    "linear-gradient(180deg, rgba(18,52,87,0.88) 0%, rgba(10,35,58,0.92) 100%)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.18)",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const ua = lang === "ua";

  const t = useMemo(
    () => ({
      heroTitle: "FINTECH UNIVERSE",
      heroSub: ua
        ? "We are your gateway to financial knowledge"
        : "We are your gateway to financial knowledge",
      about: ua
        ? "We analyze the landscape of educational programs, track trends, and curate high-value fintech content in one place."
        : "We analyze the landscape of educational programs, track trends, and curate high-value fintech content in one place.",
      coursesTitle: ua ? "Top FinTech Courses" : "Top FinTech Courses",
      coursesText: ua
        ? "Discover fintech courses in digital finance, blockchain, AI, RegTech, SupTech, and fintech product development. FinTech UniVerse bridges the gap between the course market and your professional growth."
        : "Discover fintech courses in digital finance, blockchain, AI, RegTech, SupTech, and fintech product development. FinTech UniVerse bridges the gap between the course market and your professional growth.",
      coursesCta: ua ? "View all courses" : "View all courses",
      insightsTitle: ua ? "Latest Insights" : "Latest Insights",
      insightsText: ua
        ? "Global regulators announce new requirements for digital assets: a brief overview of key updates."
        : "Global regulators announce new requirements for digital assets: a brief overview of key updates.",
      insightsCta: ua ? "View insights" : "View insights",
      partnersTitle: ua
        ? "Our partners and content providers"
        : "Our partners and content providers",
      bottom: ua
        ? "We collaborate with educational platforms and fintech companies to monitor the most relevant opportunities for our users."
        : "We collaborate with educational platforms and fintech companies to monitor the most relevant opportunities for our users.",
      loading: ua ? "Loading…" : "Loading…",
      empty: ua ? "No insights yet" : "No insights yet",
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
    <div className="w-full bg-[#071F35] text-white">
      <section className="relative overflow-hidden -mt-[88px] pt-[88px] md:-mt-[96px] md:pt-[96px]">
        <div className="relative h-[620px] sm:h-[700px] md:h-[760px]">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-[#071F35]/58" />

          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 h-full flex flex-col">
            <div className="flex-1 flex items-end justify-center pb-44 sm:pb-44 md:pb-28">
              <div className="text-center">
                <div className="text-[34px] sm:text-[56px] md:text-[92px] font-extralight tracking-[0.08em] leading-none text-transparent">
                  <span
                    style={{
                      WebkitTextStroke: "1.5px rgba(255,255,255,0.75)",
                      textShadow:
                        "0 0 18px rgba(255,255,255,0.08), 0 0 4px rgba(255,255,255,0.05)",
                    }}
                  >
                    {t.heroTitle}
                  </span>
                </div>

                <div className="mt-3 text-white/85 text-sm sm:text-base">
                  {t.heroSub}
                </div>
              </div>
            </div>

            <div className="absolute left-4 right-4 bottom-8 sm:left-6 sm:right-6 md:bottom-10">
              <div
                className="mx-auto max-w-[1280px] rounded-[28px] border border-white/10 px-5 py-6 sm:px-8 sm:py-8"
                style={glassCardStyle}
              >
                <p className="text-center text-white/90 text-sm sm:text-lg leading-relaxed max-w-[920px] mx-auto">
                  {t.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 pb-8 sm:pb-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div
            className="rounded-[24px] sm:rounded-[28px] border border-white/10 p-3 sm:p-6"
            style={glassCardStyle}
          >
            <div className="rounded-[20px] sm:rounded-[22px] bg-white/30 h-[140px] sm:h-[210px] grid place-items-center">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
            </div>

            <div className="mt-4 sm:mt-5 text-[16px] sm:text-lg font-semibold">
              {t.coursesTitle}
            </div>

            <div className="mt-2 text-[11px] sm:text-sm leading-relaxed text-white/80">
              {t.coursesText}
            </div>

            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-4 sm:mt-5 inline-flex items-center rounded-full bg-[#A0141A] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-medium hover:opacity-90"
            >
              {t.coursesCta}
            </button>
          </div>

          <div
            className="rounded-[24px] sm:rounded-[28px] border border-white/10 p-3 sm:p-6"
            style={glassCardStyle}
          >
            <div className="rounded-[20px] sm:rounded-[22px] bg-white/30 h-[140px] sm:h-[210px] overflow-hidden grid place-items-center">
              {loadingInsight ? (
                <div className="text-[10px] sm:text-sm text-white/70">
                  {t.loading}
                </div>
              ) : insightImg ? (
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
              ) : (
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
              )}
            </div>

            <div className="mt-4 sm:mt-5 text-[16px] sm:text-lg font-semibold">
              {t.insightsTitle}
            </div>

            <div className="mt-2 text-[11px] sm:text-sm leading-relaxed text-white/80 line-clamp-4">
              {latestInsight?.excerpt || latestInsight?.title || t.insightsText}
            </div>

            <button
              type="button"
              onClick={() => navigate("/insights")}
              className="mt-4 sm:mt-5 inline-flex items-center rounded-full bg-[#A0141A] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-medium hover:opacity-90"
            >
              {t.insightsCta}
            </button>
          </div>
        </div>

        <div
          className="mt-8 rounded-[24px] sm:rounded-[28px] border border-white/10 px-5 py-5 sm:px-8 sm:py-8"
          style={glassCardStyle}
        >
          <p className="text-center text-[11px] sm:text-base leading-relaxed text-white/90 max-w-[920px] mx-auto">
            {t.about}
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-[18px] sm:text-[28px] font-semibold mb-5 sm:mb-6">
            {t.partnersTitle}
          </h2>

          <div className="grid grid-cols-12 gap-3 sm:gap-6">
            <div className="col-span-5 rounded-[22px] sm:rounded-[28px] bg-white/30 h-[150px] sm:h-[320px] grid place-items-center">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
            </div>

            <div className="col-span-4 rounded-[22px] sm:rounded-[28px] bg-white/30 h-[150px] sm:h-[320px] grid place-items-center">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
            </div>

            <div className="col-span-3 flex flex-col gap-3 sm:gap-6">
              <div className="rounded-[20px] sm:rounded-[28px] bg-white/30 h-[69px] sm:h-[150px] grid place-items-center">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
              </div>
              <div className="rounded-[20px] sm:rounded-[28px] bg-white/30 h-[69px] sm:h-[150px] grid place-items-center">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-white/70" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/30 shrink-0 grid place-items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-white/70" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-sm leading-none text-white/90 truncate">
                    lorem ipsum
                  </div>
                  <div className="mt-1 text-[7px] sm:text-xs leading-none text-white/60 truncate">
                    lorem ipsum lorem
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-8 rounded-[24px] sm:rounded-[28px] border border-white/10 px-5 py-6 sm:px-8 sm:py-8"
          style={glassCardStyle}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 text-[9px] sm:text-sm text-white/75">
            <div className="space-y-2 sm:space-y-3">
              <div className="text-white/90 text-[10px] sm:text-base leading-snug">
                lorem ipsum lorem ipsum lorem
              </div>
              <div>FinTech ipsum lorem ipsum lorem ipsum lorem ipsum lorem</div>
              <div>ipsum lorem</div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
            </div>

            <div className="flex flex-col items-start">
              <div className="text-[10px] sm:text-base text-white/90 leading-snug">
                Follow
                <br />
                FinTech
              </div>

             <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
  <a
    href="#"
    className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
    aria-label="Instagram"
  >
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 1.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z" />
    </svg>
  </a>

  <a
    href="#"
    className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
    aria-label="Facebook"
  >
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white">
      <path d="M13.5 21v-7h2.3l.35-2.7H13.5V9.58c0-.78.22-1.3 1.34-1.3H16.3V5.86A17.7 17.7 0 0 0 14.18 5c-2.1 0-3.54 1.28-3.54 3.64v2.66H8.25V14h2.39v7Z" />
    </svg>
  </a>

<a
  href="#"
  className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
  aria-label="X"
>
  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white">
    <path d="M18.244 2H21l-6.016 6.876L22 22h-5.49l-4.3-6.272L6.72 22H4l6.43-7.35L2 2h5.63l3.887 5.67L18.244 2Zm-.964 18.2h1.523L6.8 3.71H5.164Z" />
  </svg>
</a>

  <a
    href="#"
    className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
    aria-label="WhatsApp"
  >
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0 11.94 11.94 0 0 0 1.74 17.9L0 24l6.27-1.64A11.94 11.94 0 0 0 24 12.06a11.82 11.82 0 0 0-3.48-8.58ZM12.06 21.5a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.72.98 1-3.63-.22-.37A9.43 9.43 0 1 1 12.06 21.5Zm5.18-7.04c-.28-.14-1.64-.81-1.9-.9-.25-.1-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.15.18-.31.21-.58.07-.28-.14-1.15-.42-2.19-1.33a8.17 8.17 0 0 1-1.52-1.88c-.16-.28 0-.43.12-.57.13-.13.28-.34.42-.5.14-.17.18-.28.28-.46.09-.18.04-.35-.03-.49-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.46.07-.7.35-.25.28-.94.92-.94 2.24s.96 2.6 1.1 2.78c.14.18 1.88 2.87 4.56 4.03.64.27 1.14.43 1.53.55.64.2 1.22.17 1.68.1.51-.08 1.64-.67 1.87-1.32.23-.64.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33Z" />
    </svg>
  </a>
</div>

              <div className="mt-4 sm:mt-6 w-12 h-8 sm:w-16 sm:h-10 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}