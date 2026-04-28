import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicCourseById } from "../api/courses";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import SafeImage from "../components/SafeImage";

const RED = "#B3131A";

const glass = {
  background:
    "linear-gradient(180deg, rgba(19,54,90,0.82) 0%, rgba(10,37,67,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function useScreen() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
}

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
  const { isMobile, isTablet } = useScreen();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

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
      resources: lang === "ua" ? "Extra матеріали" : "Extra materials",
      privateTitle:
        lang === "ua" ? "Увійди або зареєструйся" : "Sign in or register",
      privateText:
        lang === "ua"
          ? "Extra матеріали доступні тільки зареєстрованим користувачам."
          : "Extra materials are available only for registered users.",
      signIn: lang === "ua" ? "Увійти" : "Sign in",
      register: lang === "ua" ? "Зареєструватися" : "Register",
      openExtra:
        lang === "ua" ? "Відкрити extra матеріали" : "Open extra materials",
      noChapters:
        lang === "ua"
          ? "Глави для цього курсу ще не додані."
          : "Chapters have not been added yet.",
      resource: lang === "ua" ? "Ресурс" : "Resource",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getPublicCourseById(id);
        if (!active) return;

        setCourse(data);
        setActiveChapter(0);
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
    return (
      <div style={page}>
        <div style={center}>{t.loading}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={page}>
        <div style={center}>{t.notFound}</div>
      </div>
    );
  }

  const heroStyle = {
    ...hero,
    gridTemplateColumns: isMobile || isTablet ? "1fr" : "420px 1fr",
    padding: isMobile ? "16px" : "22px",
    gap: isMobile ? "18px" : "28px",
  };

  const imageBoxStyle = {
    ...imageBox,
    height: isMobile ? "220px" : isTablet ? "320px" : "280px",
  };

  const titleStyle = {
    ...title,
    fontSize: isMobile ? "28px" : isTablet ? "34px" : "40px",
  };

  const twoColumnsStyle = {
    ...twoColumns,
    gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.7fr 0.9fr",
  };

  const resourcesGridStyle = {
    ...resourcesGrid,
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(3, 1fr)",
  };

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={{ marginBottom: "18px" }}>
          <Link to="/courses" style={backLink}>
            ← {t.back}
          </Link>
        </div>

        <section style={heroStyle}>
          <div style={imageBoxStyle}>
            {course.image ? (
              <SafeImage
                src={course.image}
                alt={getTitle(course, lang)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : null}
          </div>

          <div>
            <div style={tagsWrap}>
              <span style={badge}>{isInternal ? t.internal : t.external}</span>
              {course.category ? (
                <span style={badge}>{course.category}</span>
              ) : null}
            </div>

            <h1 style={titleStyle}>{getTitle(course, lang)}</h1>
            <p style={text}>{getDescription(course, lang)}</p>

            <div style={meta}>
              <span>{course.durationText || "-"}</span>
              <span>
                {Number(course.price) > 0 ? `${course.price} $` : t.free}
              </span>
              {course.speaker ? <span>{course.speaker}</span> : null}
            </div>

            {isExternal && course.link ? (
              <a
                href={course.link}
                target="_blank"
                rel="noreferrer"
                style={redBtn}
              >
                {t.open}
              </a>
            ) : null}
          </div>
        </section>

        <div style={twoColumnsStyle}>
          <section style={section}>
            <h2 style={sectionTitle}>{t.about}</h2>
            <p style={text}>{getDescription(course, lang)}</p>

            {Array.isArray(course.tags) && course.tags.length > 0 ? (
              <div style={tagsWrap}>
                {course.tags.map((tag) => (
                  <span key={tag} style={badge}>
                    {tag}
                  </span>
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
            <InfoRow
              label={t.price}
              value={Number(course.price) > 0 ? `${course.price} $` : t.free}
            />
            {course.speaker ? (
              <InfoRow label={t.speaker} value={course.speaker} />
            ) : null}
          </aside>
        </div>

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
                      key={`${chapter.title_ua || chapter.title_en}-${index}`}
                      type="button"
                      onClick={() => setActiveChapter(index)}
                      style={chapterTab(activeChapter === index)}
                    >
                      {index + 1}. {getChapterTitle(chapter, lang)}
                    </button>
                  ))}
                </div>

                <div style={chapterBox} key={`chapter-${activeChapter}`}>
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
                        <div style={resourcesGridStyle}>
                          {activeChapterData.embeddings.map((url, index) =>
                            isYoutube(url) ? (
                              <div
                                key={`${activeChapter}-${url}-${index}`}
                                style={resourceCard}
                              >
                                <iframe
                                  key={`${activeChapter}-${url}`}
                                  src={getYoutubeEmbed(url)}
                                  title={`Video ${activeChapter + 1}-${index + 1}`}
                                  style={iframe}
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <a
                                key={`${activeChapter}-${url}-${index}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                style={resourceLink}
                              >
                                {t.resource} {index + 1}
                              </a>
                            )
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowAuthPopup(true)}
                          style={lockedButton}
                        >
                          {t.openExtra}
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </section>
        ) : null}

        {showAuthPopup ? (
          <div style={modalOverlay}>
            <div style={modal}>
              <button
                type="button"
                onClick={() => setShowAuthPopup(false)}
                style={modalClose}
              >
                ×
              </button>

              <h3 style={modalTitle}>{t.privateTitle}</h3>
              <p style={modalText}>{t.privateText}</p>

              <div style={modalActions}>
                <Link to="/login" style={redBtnModal}>
                  {t.signIn}
                </Link>

                <Link to="/register" style={ghostBtn}>
                  {t.register}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
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

const page = {
  minHeight: "100vh",
  background: "#082947",
  color: "#FFFFFF",
  padding: "34px 16px 48px",
};

const wrap = {
  width: "100%",
  maxWidth: "1180px",
  margin: "0 auto",
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
  display: "grid",
  alignItems: "center",
};

const imageBox = {
  width: "100%",
  borderRadius: "24px",
  overflow: "hidden",
  background: "rgba(111,134,164,0.78)",
};

const title = {
  margin: "18px 0 12px",
  color: "#FFFFFF",
  lineHeight: 1.15,
  fontWeight: 800,
  wordBreak: "break-word",
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

const tagsWrap = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "16px",
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
  background: RED,
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
    background: active ? RED : "rgba(255,255,255,0.06)",
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
  gap: "14px",
};

const resourceCard = {
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  padding: "10px",
};

const iframe = {
  width: "100%",
  height: "190px",
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

const lockedButton = {
  width: "100%",
  minHeight: "54px",
  borderRadius: "16px",
  border: "1px solid rgba(179,19,26,0.35)",
  background: "rgba(179,19,26,0.12)",
  color: "#FFFFFF",
  padding: "0 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modal = {
  width: "100%",
  maxWidth: "430px",
  borderRadius: "24px",
  background: "#FFFFFF",
  color: "#101828",
  padding: "26px",
  position: "relative",
  boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
};

const modalClose = {
  position: "absolute",
  top: "12px",
  right: "14px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "none",
  background: "#EEF3F8",
  color: "#101828",
  fontSize: "20px",
  cursor: "pointer",
};

const modalTitle = {
  margin: "0 0 10px",
  color: "#101828",
  fontSize: "22px",
  fontWeight: 800,
};

const modalText = {
  margin: 0,
  color: "#344054",
  fontSize: "14px",
  lineHeight: 1.6,
};

const modalActions = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const redBtnModal = {
  minWidth: "130px",
  height: "42px",
  borderRadius: "999px",
  background: RED,
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 800,
};

const ghostBtn = {
  minWidth: "150px",
  height: "42px",
  borderRadius: "999px",
  border: "1px solid #2E5D8C",
  color: "#2E5D8C",
  background: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 800,
};