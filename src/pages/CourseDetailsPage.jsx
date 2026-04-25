import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../api/courses";
import SafeImage from "../components/SafeImage";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

const glass = {
  background:
    "linear-gradient(180deg, rgba(19,54,90,0.82) 0%, rgba(10,37,67,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function getTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Course"
    : course.title_en || course.title_ua || "Course";
}

function getDescription(course, lang) {
  return lang === "ua"
    ? course.description_ua || course.description_en || ""
    : course.description_en || course.description_ua || "";
}

function getChapterTitle(chapter, lang) {
  return lang === "ua"
    ? chapter.title_ua || chapter.title_en || "Chapter"
    : chapter.title_en || chapter.title_ua || "Chapter";
}

function getChapterText(chapter, lang) {
  return lang === "ua"
    ? chapter.description_ua || chapter.description_en || ""
    : chapter.description_en || chapter.description_ua || "";
}

function getYoutubeEmbed(url = "") {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }

    return url;
  } catch {
    return url;
  }
}

function isYoutube(url = "") {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { lang } = useLang();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);

  const isLoggedIn = Boolean(user);
  const chapters = Array.isArray(course?.chapters) ? course.chapters : [];
  const activeChapterData = chapters[activeChapter];
  const isInternal = course?.course_type === "internal";
  const isExternal = course?.course_type === "external";

  const t = useMemo(() => {
    return {
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      notFound: lang === "ua" ? "Курс не знайдено" : "Course not found",
      back: lang === "ua" ? "Назад до курсів" : "Back to courses",
      about: lang === "ua" ? "Про курс" : "About course",
      info: lang === "ua" ? "Інформація про курс" : "Course information",
      category: lang === "ua" ? "Категорія" : "Category",
      duration: lang === "ua" ? "Тривалість" : "Duration",
      speaker: lang === "ua" ? "Спікер" : "Speaker",
      format: lang === "ua" ? "Формат" : "Format",
      online: lang === "ua" ? "Онлайн" : "Online",
      type: lang === "ua" ? "Тип" : "Type",
      price: lang === "ua" ? "Ціна" : "Price",
      free: lang === "ua" ? "Безкоштовно" : "Free",
      open: lang === "ua" ? "Перейти на курс" : "Open course",
      external: lang === "ua" ? "Зовнішній курс" : "External course",
      internal: lang === "ua" ? "Внутрішній курс" : "Internal course",
      chapters: lang === "ua" ? "Глави курсу" : "Course chapters",
      resources: lang === "ua" ? "Додаткові ресурси" : "Extra resources",
      publicTitle:
        lang === "ua"
          ? "Доступно всім користувачам"
          : "Available to all users",
      publicText:
        lang === "ua"
          ? "Базова інформація про курс доступна без реєстрації."
          : "Basic course information is available without registration.",
      privateTitle:
        lang === "ua"
          ? "Доступно лише зареєстрованим користувачам"
          : "Available only to registered users",
      privateText:
        lang === "ua"
          ? "Увійди або зареєструйся, щоб отримати доступ до додаткових відео та ресурсів."
          : "Sign in or register to access extra videos and resources.",
      login: lang === "ua" ? "Увійти / Зареєструватися" : "Sign in / Register",
      noChapters:
        lang === "ua"
          ? "Глави для цього курсу ще не додані."
          : "Chapters have not been added yet.",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        if (!active) return;
        setCourse(data);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setCourse(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div style={page}><div style={center}>{t.loading}</div></div>;
  }

  if (!course) {
    return <div style={page}><div style={center}>{t.notFound}</div></div>;
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ marginBottom: "18px" }}>
          <Link to="/courses" style={backLink}>← {t.back}</Link>
        </div>

        <section style={hero}>
          <div style={imageBox}>
            {course.image ? (
              <SafeImage
                src={course.image}
                alt={getTitle(course, lang)}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          <div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={badge}>{isInternal ? t.internal : t.external}</span>
              {course.category ? <span style={badge}>{course.category}</span> : null}
            </div>

            <h1 style={title}>{getTitle(course, lang)}</h1>

            <p style={text}>{getDescription(course, lang)}</p>

            <div style={meta}>
              <span>{course.durationText}</span>
              <span>{Number(course.price) > 0 ? `${course.price} $` : t.free}</span>
              {course.speaker ? <span>{course.speaker}</span> : null}
            </div>

            {isExternal && course.link ? (
              <a href={course.link} target="_blank" rel="noreferrer" style={redBtn}>
                {t.open}
              </a>
            ) : null}
          </div>
        </section>

        <div style={twoColumns}>
          <section style={section}>
            <h2 style={sectionTitle}>{t.about}</h2>
            <p style={text}>{getDescription(course, lang)}</p>

            {Array.isArray(course.tags) && course.tags.length > 0 ? (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                {course.tags.map((tag) => (
                  <span key={tag} style={badge}>{tag}</span>
                ))}
              </div>
            ) : null}
          </section>

          <aside style={section}>
            <h2 style={sectionTitle}>{t.info}</h2>
            <InfoRow label={t.category} value={course.category || "-"} />
            <InfoRow label={t.duration} value={course.durationText || "-"} />
            <InfoRow label={t.format} value={t.online} />
            <InfoRow label={t.type} value={isInternal ? t.internal : t.external} />
            <InfoRow label={t.price} value={Number(course.price) > 0 ? `${course.price} $` : t.free} />
            {course.speaker ? <InfoRow label={t.speaker} value={course.speaker} /> : null}
          </aside>
        </div>

        <section style={{ ...section, marginTop: "22px", borderColor: "rgba(83,171,255,0.35)" }}>
          <h2 style={sectionTitle}>{t.publicTitle}</h2>
          <p style={text}>{t.publicText}</p>
        </section>

        {isInternal ? (
          <section style={{ ...section, marginTop: "22px" }}>
            <h2 style={sectionTitle}>{t.chapters}</h2>

            {chapters.length === 0 ? (
              <p style={text}>{t.noChapters}</p>
            ) : (
              <>
                <div style={tabs}>
                  {chapters.map((chapter, index) => (
                    <button
                      key={`${chapter.title_ua}-${index}`}
                      type="button"
                      onClick={() => setActiveChapter(index)}
                      style={chapterTab(activeChapter === index)}
                    >
                      {index + 1}. {getChapterTitle(chapter, lang)}
                    </button>
                  ))}
                </div>

                <div style={chapterBox}>
                  <h3 style={chapterTitle}>
                    {getChapterTitle(activeChapterData, lang)}
                  </h3>

                  <p style={{ ...text, whiteSpace: "pre-line" }}>
                    {getChapterText(activeChapterData, lang)}
                  </p>

                  {Array.isArray(activeChapterData?.embeddings) &&
                  activeChapterData.embeddings.length > 0 ? (
                    <div style={{ marginTop: "22px" }}>
                      <h3 style={chapterTitle}>{t.resources}</h3>

                      {isLoggedIn ? (
                        <div style={resourcesGrid}>
                          {activeChapterData.embeddings.map((url, index) =>
                            isYoutube(url) ? (
                              <div key={url} style={resourceCard}>
                                <iframe
                                  src={getYoutubeEmbed(url)}
                                  title={`Video ${index + 1}`}
                                  style={iframe}
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                style={resourceLink}
                              >
                                Resource {index + 1}
                              </a>
                            )
                          )}
                        </div>
                      ) : (
                        <LockedBlock t={t} />
                      )}
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </section>
        ) : null}

        <section style={{ ...section, marginTop: "22px", borderColor: "rgba(179,19,26,0.35)" }}>
          <h2 style={sectionTitle}>{t.privateTitle}</h2>
          <p style={text}>{t.privateText}</p>

          {!isLoggedIn ? (
            <Link to="/login" style={redBtn}>{t.login}</Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={infoRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LockedBlock({ t }) {
  return (
    <div style={locked}>
      <h3 style={{ margin: "0 0 8px", color: "#FFFFFF" }}>{t.privateTitle}</h3>
      <p style={text}>{t.privateText}</p>
      <Link to="/login" style={redBtn}>{t.login}</Link>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#082947",
  color: "#FFFFFF",
  padding: "34px 16px 48px",
};

const center = {
  textAlign: "center",
  paddingTop: "80px",
  color: "#FFFFFF",
};

const backLink = {
  color: "rgba(255,255,255,0.82)",
  textDecoration: "none",
  fontSize: "14px",
};

const hero = {
  ...glass,
  borderRadius: "30px",
  padding: "22px",
  display: "grid",
  gridTemplateColumns: "420px 1fr",
  gap: "28px",
  alignItems: "center",
};

const imageBox = {
  height: "280px",
  borderRadius: "24px",
  overflow: "hidden",
  background: "rgba(111,134,164,0.78)",
};

const title = {
  margin: "18px 0 12px",
  color: "#FFFFFF",
  fontSize: "40px",
  lineHeight: 1.15,
  fontWeight: 800,
};

const text = {
  margin: 0,
  color: "rgba(255,255,255,0.82)",
  fontSize: "14px",
  lineHeight: 1.7,
};

const meta = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "18px",
  color: "rgba(255,255,255,0.78)",
  fontSize: "13px",
};

const twoColumns = {
  display: "grid",
  gridTemplateColumns: "1.7fr 0.9fr",
  gap: "22px",
  marginTop: "24px",
};

const section = {
  ...glass,
  borderRadius: "26px",
  padding: "22px",
};

const sectionTitle = {
  margin: "0 0 14px",
  color: "#FFFFFF",
  fontSize: "22px",
  fontWeight: 800,
};

const badge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "26px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.86)",
  fontSize: "12px",
  fontWeight: 700,
};

const redBtn = {
  marginTop: "20px",
  minWidth: "180px",
  height: "42px",
  borderRadius: "999px",
  background: "#B3131A",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 800,
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.78)",
  fontSize: "14px",
};

const tabs = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

function chapterTab(active) {
  return {
    minHeight: "38px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: active ? "#B3131A" : "rgba(255,255,255,0.06)",
    color: "#FFFFFF",
    padding: "0 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  };
}

const chapterBox = {
  borderRadius: "20px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "20px",
};

const chapterTitle = {
  margin: "0 0 12px",
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: 800,
};

const resourcesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
};

const resourceCard = {
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  padding: "10px",
};

const iframe = {
  width: "100%",
  height: "150px",
  border: "none",
  borderRadius: "14px",
};

const resourceLink = {
  minHeight: "48px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  textDecoration: "none",
  fontSize: "13px",
};

const locked = {
  borderRadius: "18px",
  background: "rgba(179,19,26,0.12)",
  border: "1px solid rgba(179,19,26,0.35)",
  padding: "18px",
};