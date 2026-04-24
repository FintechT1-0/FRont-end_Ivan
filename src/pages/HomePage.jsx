import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/hero-bg.mp4";
import { getCourses } from "../api/courses";
import { getInsights } from "../api/insights";
import { useLang } from "../context/LanguageContext";

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const imagePlaceholder = {
  background: "rgba(111, 134, 164, 0.78)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
};

function getLocalizedCourseTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Course"
    : course.title_en || course.title_ua || "Course";
}

function getLocalizedCourseDescription(course, lang) {
  return lang === "ua"
    ? course.description_ua || course.description_en || ""
    : course.description_en || course.description_ua || "";
}

function trimText(text = "", max = 150) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

const desktopCtaButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "34px",
  padding: "0 14px",
  borderRadius: "999px",
  background: "#B3131A",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
};

export default function HomePage() {
  const { lang } = useLang();

  const [coursesData, setCoursesData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        setLoading(true);

        const [coursesResponse, insightsResponse] = await Promise.all([
          getCourses({ page: 1, pageSize: 2 }),
          getInsights(lang),
        ]);

        if (!active) return;

        setCoursesData(coursesResponse?.courses || []);
        setInsightsData(Array.isArray(insightsResponse) ? insightsResponse : []);
      } catch (error) {
        console.error("Failed to load home data:", error);
        if (!active) return;
        setCoursesData([]);
        setInsightsData([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      active = false;
    };
  }, [lang]);

  const topCourses = useMemo(() => coursesData.slice(0, 2), [coursesData]);
  const topInsights = useMemo(() => insightsData.slice(0, 2), [insightsData]);

  const heroSubtitle =
    lang === "ua"
      ? "Ваш провідник у світі фінансових знань"
      : "We are your gateway to financial knowledge.";

  const aboutText =
    lang === "ua"
      ? "Ми аналізуємо ринок освітніх програм, відстежуємо тренди та збираємо цінний fintech-контент в одному місці."
      : "We analyze the landscape of educational programs, track trends, and curate high-value fintech content in one place.";

  const coursesTitle =
    lang === "ua" ? "Топ курси з FinTech" : "Top FinTech Courses";
  const insightsTitle =
    lang === "ua" ? "Останні інсайти" : "Latest Insights";

  return (
    <div style={{ background: "#082947", minHeight: "100vh" }}>
      <div className="md:hidden bg-[#082947] px-4 pb-8">
        <div className="mx-auto w-full max-w-[520px]">
          <section className="relative min-h-[470px] overflow-hidden rounded-b-[28px] border border-white/10 bg-[#082947]">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4,24,44,0.18) 0%, rgba(6,32,58,0.48) 44%, rgba(7,35,62,0.94) 100%)",
              }}
            />

            <div className="relative z-[2] flex min-h-[470px] items-center justify-center px-4 pb-[94px] pt-[88px] text-center">
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(34px, 8vw, 52px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    WebkitTextStroke: "1.3px rgba(220, 232, 244, 0.95)",
                    textShadow:
                      "0 0 18px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.26)",
                  }}
                >
                  FinTech Universe
                </h1>

                <p className="mt-2 text-[13px] text-white/80">
                  {heroSubtitle}
                </p>
              </div>
            </div>
          </section>


          <section className="pt-10">
            <div className="grid grid-cols-2 gap-4">
              <article
                style={glassCard}
                className="rounded-[22px] p-3 text-white"
              >
                <div
                  style={imagePlaceholder}
                  className="mb-3 h-[124px] overflow-hidden rounded-[18px]"
                >
                  {topCourses[0]?.image ? (
                    <img
                      src={topCourses[0].image}
                      alt={getLocalizedCourseTitle(topCourses[0], lang)}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <h3 className="m-0 text-[15px] font-semibold leading-tight">
                  {coursesTitle}
                </h3>

                <p className="mb-4 mt-2 min-h-[70px] text-[10px] leading-[1.4] text-white/85">
                  {loading
                    ? lang === "ua"
                      ? "Завантаження курсів..."
                      : "Loading courses..."
                    : topCourses[0]
                    ? trimText(
                        getLocalizedCourseDescription(topCourses[0], lang),
                        115
                      )
                    : lang === "ua"
                    ? "Курси з’являться після підключення або оновлення контенту."
                    : "Courses will appear after content is connected or updated."}
                </p>

                <Link
                  to="/courses"
                  className="inline-flex min-h-[30px] items-center justify-center rounded-full bg-[#B3131A] px-3 text-[10px] font-semibold text-white no-underline shadow-[0_10px_18px_rgba(179,19,26,0.24)]"
                >
                  {lang === "ua"
                    ? "Переглянути всі курси"
                    : "View all courses"}
                </Link>
              </article>

              <article
                style={glassCard}
                className="rounded-[22px] p-3 text-white"
              >
                <div
                  style={imagePlaceholder}
                  className="mb-3 h-[124px] overflow-hidden rounded-[18px]"
                >
                  {topInsights[0]?.image || topInsights[0]?.thumbnail ? (
                    <img
                      src={topInsights[0].image || topInsights[0].thumbnail}
                      alt={topInsights[0].title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <h3 className="m-0 text-[15px] font-semibold leading-tight">
                  {insightsTitle}
                </h3>

                <p className="mb-4 mt-2 min-h-[70px] text-[10px] leading-[1.4] text-white/85">
                  {loading
                    ? lang === "ua"
                      ? "Завантаження інсайтів..."
                      : "Loading insights..."
                    : topInsights[0]
                    ? trimText(
                        topInsights[0].excerpt || topInsights[0].content,
                        115
                      )
                    : lang === "ua"
                    ? "Інсайти з’являться після оновлення стрічки."
                    : "Insights will appear after the feed is updated."}
                </p>

                <Link
                  to="/insights"
                  className="inline-flex min-h-[30px] items-center justify-center rounded-full bg-[#B3131A] px-3 text-[10px] font-semibold text-white no-underline shadow-[0_10px_18px_rgba(179,19,26,0.24)]"
                >
                  {lang === "ua"
                    ? "Переглянути інсайти"
                    : "View insights"}
                </Link>
              </article>
            </div>
          </section>

          <section className="pt-8">
            <div
              style={glassCard}
              className="rounded-[24px] px-5 py-5 text-center"
            >
              <p className="m-0 text-[14px] leading-[1.45] text-[#E8EFF7]">
                {aboutText}
              </p>
            </div>
          </section>
        </div>
      </div>

      <div
        className="hidden md:block"
        style={{
          background: "#082947",
          minHeight: "100vh",
          padding: "0 16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <section
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "0 0 28px 28px",
              minHeight: "670px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#082947",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(4,24,44,0.18) 0%, rgba(6,32,58,0.48) 44%, rgba(7,35,62,0.94) 100%)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
                minHeight: "670px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 24px 130px",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(46px, 6.5vw, 78px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    WebkitTextStroke: "1.5px rgba(220, 232, 244, 0.95)",
                    textShadow:
                      "0 0 18px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.26)",
                  }}
                >
                  FinTech Universe
                </h1>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "15px",
                  }}
                >
                  {lang === "ua"
                    ? "Твій простір для фінансових знань."
                    : "We are your gateway to financial knowledge."}
                </p>
              </div>
            </div>
          </section>

        

          <section
            style={{
              paddingTop: "36px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "18px",
              }}
            >
              <article
                style={{
                  ...glassCard,
                  borderRadius: "22px",
                  padding: "16px",
                  color: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    ...imagePlaceholder,
                    height: "220px",
                    borderRadius: "18px",
                    marginBottom: "16px",
                    overflow: "hidden",
                  }}
                >
                  {topCourses[0]?.image ? (
                    <img
                      src={topCourses[0].image}
                      alt={getLocalizedCourseTitle(topCourses[0], lang)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                >
                  {lang === "ua"
                    ? "Топ fintech-курсів"
                    : "Top FinTech Courses"}
                </h3>

                <p
                  style={{
                    margin: "10px 0 18px",
                    color: "rgba(255,255,255,0.86)",
                    lineHeight: 1.5,
                    fontSize: "14px",
                    minHeight: "64px",
                  }}
                >
                  {loading
                    ? lang === "ua"
                      ? "Завантаження курсів..."
                      : "Loading courses..."
                    : topCourses[0]
                    ? trimText(
                        getLocalizedCourseDescription(topCourses[0], lang),
                        150
                      )
                    : lang === "ua"
                    ? "Курси з’являться після підключення або оновлення контенту."
                    : "Courses will appear after content is connected or updated."}
                </p>

                <Link to="/courses" style={desktopCtaButton}>
                  {lang === "ua" ? "Усі курси" : "View all courses"}
                </Link>
              </article>

              <article
                style={{
                  ...glassCard,
                  borderRadius: "22px",
                  padding: "16px",
                  color: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    ...imagePlaceholder,
                    height: "220px",
                    borderRadius: "18px",
                    marginBottom: "16px",
                    overflow: "hidden",
                  }}
                >
                  {topInsights[0]?.image || topInsights[0]?.thumbnail ? (
                    <img
                      src={topInsights[0].image || topInsights[0].thumbnail}
                      alt={topInsights[0].title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                >
                  {lang === "ua" ? "Останні інсайти" : "Latest Insights"}
                </h3>

                <p
                  style={{
                    margin: "10px 0 18px",
                    color: "rgba(255,255,255,0.86)",
                    lineHeight: 1.5,
                    fontSize: "14px",
                    minHeight: "64px",
                  }}
                >
                  {loading
                    ? lang === "ua"
                      ? "Завантаження інсайтів..."
                      : "Loading insights..."
                    : topInsights[0]
                    ? trimText(
                        topInsights[0].excerpt || topInsights[0].content,
                        150
                      )
                    : lang === "ua"
                    ? "Інсайти з’являться після оновлення стрічки."
                    : "Insights will appear after the feed is updated."}
                </p>

                <Link to="/insights" style={desktopCtaButton}>
                  {lang === "ua" ? "Інсайди" : "View insights"}
                </Link>
              </article>
            </div>
          </section>

          <section
            style={{
              paddingTop: "34px",
            }}
          >
            <div
              style={{
                ...glassCard,
                borderRadius: "20px",
                padding: "22px 26px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#E8EFF7",
                  fontSize: "18px",
                  lineHeight: 1.45,
                }}
              >
                {aboutText}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}