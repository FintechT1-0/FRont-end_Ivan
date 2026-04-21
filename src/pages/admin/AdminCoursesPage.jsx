import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse, getCourses, updateCourse } from "../../api/courses";
import { useLang } from "../../context/LanguageContext";

function getLocalizedCourseTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Course name"
    : course.title_en || course.title_ua || "Course name";
}

function normalizeCoursesResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      courses: payload,
      total_pages: 1,
      current_page: 1,
      total_courses: payload.length,
    };
  }

  return {
    courses: payload?.courses || [],
    total_pages: payload?.total_pages || 1,
    current_page: payload?.current_page || 1,
    total_courses: payload?.total_courses || 0,
  };
}

function formatSections(course) {
  if (typeof course?.sections_count === "number") {
    return `${course.sections_count} Sections`;
  }
  return `${course?.tags?.length || 0} Sections`;
}

function formatStudents(course) {
  if (typeof course?.students_count === "number") {
    return `${course.students_count} students`;
  }
  return "0 students";
}

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

export default function AdminCoursesPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total_pages: 1,
    current_page: 1,
    total_courses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "УСІ КУРСИ" : "ALL COURSES",
      search: lang === "ua" ? "ПОШУК" : "SEARCH",
      category: lang === "ua" ? "УСІ КАТЕГОРІЇ..." : "ALL CATEGORIES...",
      statusAll: lang === "ua" ? "УСІ СТАТУСИ..." : "ALL STATUSES...",
      published: lang === "ua" ? "Опубліковано" : "Published",
      unpublished: lang === "ua" ? "Неопубліковано" : "Unpublished",
      create: lang === "ua" ? "+ Створити курс" : "+ Create course",
      noCourses: lang === "ua" ? "Курсів не знайдено" : "No courses found",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      prev: lang === "ua" ? "Назад" : "Prev",
      next: lang === "ua" ? "Далі" : "Next",
      deleteConfirm:
        lang === "ua"
          ? "Точно видалити цей курс?"
          : "Are you sure you want to delete this course?",
      deleteFail:
        lang === "ua"
          ? "Не вдалося видалити курс"
          : "Failed to delete course",
      updateFail:
        lang === "ua"
          ? "Не вдалося оновити курс"
          : "Failed to update course",
    };
  }, [lang]);

  async function loadCourses(nextPage = page) {
    try {
      setLoading(true);

      const data = await getCourses({
        page: nextPage,
        page_size: 20,
        title: search.trim() || undefined,
        category: category.trim() || undefined,
        isPublished:
          status === "published" ? true : status === "unpublished" ? false : undefined,
      });

      const normalized = normalizeCoursesResponse(data);

      setCourses(normalized.courses);
      setMeta({
        total_pages: normalized.total_pages,
        current_page: normalized.current_page,
        total_courses: normalized.total_courses,
      });
      setPage(normalized.current_page);
    } catch (error) {
      console.error("Failed to load admin courses:", error);
      setCourses([]);
      setMeta({
        total_pages: 1,
        current_page: 1,
        total_courses: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses(1);
  }, []);

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await loadCourses(1);
  }

  async function handleDelete(courseId) {
    const ok = window.confirm(t.deleteConfirm);
    if (!ok) return;

    try {
      setBusyId(courseId);
      await deleteCourse(courseId);
      await loadCourses(page);
    } catch (error) {
      alert(getBackendError(error, t.deleteFail));
    } finally {
      setBusyId(null);
    }
  }

  async function handleTogglePublish(course) {
    try {
      setBusyId(course.id);
      await updateCourse(course.id, {
        isPublished: !course.isPublished,
      });
      await loadCourses(page);
    } catch (error) {
      alert(getBackendError(error, t.updateFail));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "930px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          marginBottom: "12px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "18px",
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {t.title}
        </h1>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 124px",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={searchWrapStyle}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            style={filterStyle}
          />
          <span style={searchIconStyle}>⌕</span>
        </div>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t.category}
          style={filterStyle}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={filterStyle}
        >
          <option value="">{t.statusAll}</option>
          <option value="published">{t.published}</option>
          <option value="unpublished">{t.unpublished}</option>
        </select>

        <button
          type="button"
          onClick={() => navigate("/admin/courses/create")}
          style={createButtonStyle}
        >
          {t.create}
        </button>
      </form>

      <div style={{ display: "grid", gap: "8px" }}>
        {loading ? (
          <div style={emptyRowStyle}>{t.loading}</div>
        ) : courses.length === 0 ? (
          <div style={emptyRowStyle}>{t.noCourses}</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.9fr 0.8fr 0.8fr 1fr 78px",
                gap: "10px",
                alignItems: "center",
                minHeight: "32px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.96)",
                padding: "0 12px",
                color: "#20324A",
                fontSize: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#D3D8E0",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {getLocalizedCourseTitle(course, lang)}
                </span>
              </div>

              <div style={{ color: "#7A7F87" }}>{formatSections(course)}</div>
              <div style={{ color: "#7A7F87" }}>{formatStudents(course)}</div>

              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => handleTogglePublish(course)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#6C7480",
                  justifySelf: "start",
                  padding: 0,
                  fontSize: "10px",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "8px",
                    borderRadius: "999px",
                    background: course.isPublished ? "#78B66A" : "#CFCFCF",
                    position: "relative",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "1px",
                      left: course.isPublished ? "10px" : "1px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      transition: "left 0.2s ease",
                    }}
                  />
                </span>

                <span style={{ color: "#7A7F87" }}>
                  {course.isPublished ? t.published : t.unpublished}
                </span>
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                  style={iconButtonStyle}
                  title="Edit"
                >
                  ○
                </button>

                <button
                  type="button"
                  disabled={busyId === course.id}
                  onClick={() => handleDelete(course.id)}
                  style={{ ...iconButtonStyle, color: "#B3131A" }}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "14px",
          color: "#FFFFFF",
          fontSize: "10px",
        }}
      >
        <div>{meta.total_courses}</div>

        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadCourses(page - 1)}
            style={pageButtonStyle(page <= 1)}
          >
            {t.prev}
          </button>

          <button
            type="button"
            disabled={page >= meta.total_pages}
            onClick={() => loadCourses(page + 1)}
            style={pageButtonStyle(page >= meta.total_pages)}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}

const searchWrapStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const searchIconStyle = {
  position: "absolute",
  right: "10px",
  fontSize: "9px",
  color: "#A0A7B2",
  pointerEvents: "none",
};

const filterStyle = {
  width: "100%",
  height: "26px",
  borderRadius: "999px",
  border: "none",
  outline: "none",
  padding: "0 10px",
  fontSize: "10px",
  background: "#FFFFFF",
  color: "#20324A",
};

const createButtonStyle = {
  height: "26px",
  minWidth: "124px",
  borderRadius: "999px",
  border: "none",
  background: "#B3131A",
  color: "#FFFFFF",
  fontSize: "10px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 18px rgba(179,19,26,0.22)",
};

const emptyRowStyle = {
  borderRadius: "8px",
  background: "rgba(255,255,255,0.94)",
  padding: "12px 14px",
  color: "#20324A",
  fontSize: "12px",
};

const iconButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "11px",
  lineHeight: 1,
  padding: 0,
  color: "#8B9199",
};

function pageButtonStyle(disabled) {
  return {
    minWidth: "58px",
    height: "24px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#FFFFFF",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontSize: "10px",
  };
}