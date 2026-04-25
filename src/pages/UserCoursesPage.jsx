import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/courses";
import { useLang } from "../context/LanguageContext";

function normalizeCoursesResponse(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.courses || [];
}

function getTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Курс"
    : course.title_en || course.title_ua || "Course";
}

function getDescription(course, lang) {
  return lang === "ua"
    ? course.description_ua || course.description_en || ""
    : course.description_en || course.description_ua || "";
}

function readRecentCourses() {
  try {
    const raw = localStorage.getItem("recent_courses");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function UserCoursesPage() {
  const { lang } = useLang();

  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "МОЇ КУРСИ" : "MY COURSES",
      available: lang === "ua" ? "Доступні курси" : "Available courses",
      recent: lang === "ua" ? "Останні відкриті" : "Recently opened",
      popularCourse: lang === "ua" ? "Популярний курс" : "Popular course",
      popularInsight: lang === "ua" ? "Популярний інсайт" : "Popular insight",
      open: lang === "ua" ? "Відкрити" : "Open",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      empty: lang === "ua" ? "Курсів поки немає" : "No courses yet",
      noRecent:
        lang === "ua"
          ? "Тут з’являться курси, які ти відкриєш."
          : "Courses you open will appear here.",
      external: lang === "ua" ? "Зовнішній" : "External",
      internal: lang === "ua" ? "Внутрішній" : "Internal",
      dev: lang === "ua" ? "Сектор у розробці" : "In development",
      devText:
        lang === "ua"
          ? "Бекенд поки не віддає ці дані."
          : "Backend does not provide this data yet.",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);

        const data = await getCourses({
          page: 1,
          page_size: 12,
          isPublished: true,
        });

        if (!active) return;

        setCourses(normalizeCoursesResponse(data));
        setRecentCourses(readRecentCourses());
      } catch {
        if (!active) return;
        setCourses([]);
        setRecentCourses(readRecentCourses());
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={page}>
      <div style={wrap}>
        <h1 style={title}>{t.title}</h1>

        <div style={layout}>
          <main style={main}>
            <section style={card}>
              <div style={sectionHead}>
                <h2 style={h2}>{t.available}</h2>
              </div>

              {loading ? (
                <div style={message}>{t.loading}</div>
              ) : courses.length === 0 ? (
                <div style={message}>{t.empty}</div>
              ) : (
                <div style={coursesGrid}>
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </section>

            <section style={card}>
              <div style={sectionHead}>
                <h2 style={h2}>{t.recent}</h2>
              </div>

              {recentCourses.length === 0 ? (
                <div style={message}>{t.noRecent}</div>
              ) : (
                <div style={recentList}>
                  {recentCourses.slice(0, 5).map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      style={recentItem}
                    >
                      <span>{getTitle(course, lang)}</span>
                      <span style={recentOpen}>{t.open}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </main>

          <aside style={side}>
            <DisabledBox title={t.popularCourse} text={t.devText} badge={t.dev} />
            <DisabledBox title={t.popularInsight} text={t.devText} badge={t.dev} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, lang, t }) {
  const title = getTitle(course, lang);
  const description = getDescription(course, lang);
  const type = course.course_type === "internal" ? t.internal : t.external;

  return (
    <article style={courseCard}>
      <div style={courseImage}>
        {course.image ? (
          <img src={course.image} alt={title} style={image} />
        ) : (
          <span style={imageText}>{title.slice(0, 1)}</span>
        )}
      </div>

      <div style={courseBody}>
        <div style={badge}>{type}</div>
        <h3 style={courseTitle}>{title}</h3>
        <p style={courseText}>{description}</p>

        <div style={meta}>
          <span>{course.durationText || "-"}</span>
          <span>{course.price ? `$${course.price}` : "Free"}</span>
        </div>

        <Link to={`/courses/${course.id}`} style={openBtn}>
          {t.open}
        </Link>
      </div>
    </article>
  );
}

function DisabledBox({ title, text, badge }) {
  return (
    <div style={sideCard}>
      <h3 style={sideTitle}>{title}</h3>
      <p style={sideText}>{text}</p>
      <span style={disabledBadge}>{badge}</span>
    </div>
  );
}

const page = {
  background: "#56677F",
  minHeight: "100vh",
  padding: "32px 16px",
};

const wrap = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const title = {
  color: "#FFFFFF",
  fontSize: "34px",
  fontWeight: 800,
  margin: "0 0 20px",
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 280px",
  gap: "18px",
};

const main = {
  display: "grid",
  gap: "18px",
};

const side = {
  display: "grid",
  gap: "18px",
  alignContent: "start",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
  padding: "24px",
};

const sectionHead = {
  marginBottom: "16px",
};

const h2 = {
  margin: 0,
  color: "#101828",
  fontSize: "18px",
  fontWeight: 800,
};

const message = {
  color: "#344054",
  fontSize: "14px",
  fontWeight: 600,
};

const coursesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
};

const courseCard = {
  border: "1px solid #E3E7EE",
  borderRadius: "16px",
  overflow: "hidden",
  background: "#F8FAFC",
};

const courseImage = {
  height: "135px",
  background: "#DCE4EE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imageText = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#082947",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: 800,
};

const courseBody = {
  padding: "14px",
};

const badge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "22px",
  padding: "0 9px",
  borderRadius: "999px",
  background: "#E3E9F2",
  color: "#2E5D8C",
  fontSize: "11px",
  fontWeight: 800,
  marginBottom: "10px",
};

const courseTitle = {
  margin: "0 0 8px",
  color: "#101828",
  fontSize: "15px",
  fontWeight: 800,
};

const courseText = {
  margin: 0,
  color: "#344054",
  fontSize: "12px",
  lineHeight: 1.5,
  minHeight: "54px",
};

const meta = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  color: "#667085",
  fontSize: "12px",
  marginTop: "12px",
};

const openBtn = {
  marginTop: "14px",
  height: "34px",
  borderRadius: "8px",
  background: "#2E5D8C",
  color: "#FFFFFF",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 14px",
  fontSize: "13px",
  fontWeight: 800,
};

const recentList = {
  display: "grid",
  gap: "10px",
};

const recentItem = {
  minHeight: "42px",
  borderRadius: "10px",
  border: "1px solid #E3E7EE",
  background: "#F8FAFC",
  color: "#101828",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "0 14px",
  fontSize: "13px",
  fontWeight: 700,
};

const recentOpen = {
  color: "#2E5D8C",
  fontSize: "12px",
  fontWeight: 800,
};

const sideCard = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
};

const sideTitle = {
  margin: "0 0 8px",
  color: "#101828",
  fontSize: "16px",
  fontWeight: 800,
};

const sideText = {
  color: "#344054",
  fontSize: "12px",
  lineHeight: 1.5,
  margin: "0 0 12px",
};

const disabledBadge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "24px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "#E3E9F2",
  color: "#2E5D8C",
  fontSize: "11px",
  fontWeight: 800,
};