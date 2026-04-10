import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

const topButtonStyle = {
  minWidth: "78px",
  height: "28px",
  borderRadius: "999px",
  border: "none",
  fontSize: "11px",
  fontWeight: 600,
  cursor: "pointer",
};

function getLocalizedCourseTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Course"
    : course.title_en || course.title_ua || "Course";
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
      search: lang === "ua" ? "Пошук" : "Search",
      category: lang === "ua" ? "Категорія" : "Category",
      status: lang === "ua" ? "Статус" : "Status",
      create: lang === "ua" ? "+ Створити курс" : "+ Create course",
      saveDraft: lang === "ua" ? "ЧЕРНЕТКА" : "SAVE DRAFT",
      preview: lang === "ua" ? "ПЕРЕГЛЯД" : "PREVIEW",
      publish: lang === "ua" ? "ПУБЛІКАЦІЯ" : "PUBLISH",
      reset: lang === "ua" ? "СКИДАННЯ" : "RESET",
      courseName: lang === "ua" ? "Назва курсу" : "Course name",
      sections: lang === "ua" ? "Секції" : "Sections",
      students: lang === "ua" ? "Студенти" : "Students",
      published: lang === "ua" ? "Опубліковано" : "Published",
      unpublished: lang === "ua" ? "Неопубліковано" : "Unpublished",
      noCourses: lang === "ua" ? "Курсів не знайдено" : "No courses found",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      all: lang === "ua" ? "Усі" : "All",
      edit: lang === "ua" ? "Редагувати" : "Edit",
      delete: lang === "ua" ? "Видалити" : "Delete",
      yes: lang === "ua" ? "Так" : "Yes",
      no: lang === "ua" ? "Ні" : "No",
      prev: lang === "ua" ? "Назад" : "Prev",
      next: lang === "ua" ? "Далі" : "Next",
      deleteConfirm:
        lang === "ua"
          ? "Точно видалити цей курс?"
          : "Are you sure you want to delete this course?",
    };
  }, [lang]);

  async function loadCourses(nextPage = page) {
    try {
      setLoading(true);

      const params = {
        page: nextPage,
        page_size: 20,
      };

      if (search.trim()) params.title = search.trim();
      if (category.trim()) params.category = category.trim();
      if (status === "published") params.isPublished = true;
      if (status === "unpublished") params.isPublished = false;

      const { data } = await client.get("/courses/", { params });
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
      await client.delete(`/courses/${courseId}`);
      await loadCourses(page);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert(lang === "ua" ? "Не вдалося видалити курс" : "Failed to delete course");
    } finally {
      setBusyId(null);
    }
  }

  async function handleTogglePublish(course) {
    try {
      setBusyId(course.id);
      await client.patch(`/courses/${course.id}`, {
        isPublished: !course.isPublished,
      });
      await loadCourses(page);
    } catch (error) {
      console.error("Failed to update course:", error);
      alert(lang === "ua" ? "Не вдалося оновити курс" : "Failed to update course");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "18px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "36px",
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {t.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            color: "#FFFFFF",
          }}
        >
          <button style={{ ...topButtonStyle, background: "transparent", color: "#FFFFFF" }}>
            {t.saveDraft}
          </button>
          <button style={{ ...topButtonStyle, background: "transparent", color: "#FFFFFF" }}>
            {t.preview}
          </button>
          <button style={{ ...topButtonStyle, background: "transparent", color: "#FFFFFF" }}>
            {t.publish}
          </button>
          <button style={{ ...topButtonStyle, background: "transparent", color: "#FFFFFF" }}>
            {t.reset}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "12px",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          style={{
            height: "28px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            padding: "0 12px",
            fontSize: "11px",
            background: "#FFFFFF",
            color: "#20324A",
          }}
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t.category}
          style={{
            height: "28px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            padding: "0 12px",
            fontSize: "11px",
            background: "#FFFFFF",
            color: "#20324A",
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            height: "28px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            padding: "0 12px",
            fontSize: "11px",
            background: "#FFFFFF",
            color: "#20324A",
          }}
        >
          <option value="">{t.all}</option>
          <option value="published">{t.published}</option>
          <option value="unpublished">{t.unpublished}</option>
        </select>

        <button
          type="button"
          onClick={() => navigate("/admin/courses/create")}
          style={{
            minWidth: "120px",
            height: "32px",
            borderRadius: "999px",
            border: "none",
            background: "#B3131A",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
          }}
        >
          {t.create}
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gap: "8px",
        }}
      >
        {loading ? (
          <div
            style={{
              borderRadius: "10px",
              background: "rgba(255,255,255,0.85)",
              padding: "16px",
              color: "#20324A",
              fontSize: "13px",
            }}
          >
            {t.loading}
          </div>
        ) : courses.length === 0 ? (
          <div
            style={{
              borderRadius: "10px",
              background: "rgba(255,255,255,0.85)",
              padding: "16px",
              color: "#20324A",
              fontSize: "13px",
            }}
          >
            {t.noCourses}
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 0.8fr 0.8fr 1fr auto",
                gap: "12px",
                alignItems: "center",
                minHeight: "36px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.88)",
                padding: "0 14px",
                color: "#20324A",
                fontSize: "11px",
              }}
            >
              <div style={{ fontWeight: 500 }}>
                {getLocalizedCourseTitle(course, lang)}
              </div>

              <div>{course.tags?.length || 0} {t.sections}</div>

              <div>{course.price ?? 0} USD</div>

              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => handleTogglePublish(course)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#20324A",
                  justifySelf: "start",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "12px",
                    borderRadius: "999px",
                    background: course.isPublished ? "#73C16B" : "#C7CCD3",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: course.isPublished ? "14px" : "2px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      transition: "left 0.2s ease",
                    }}
                  />
                </span>

                <span>
                  {course.isPublished ? t.published : t.unpublished}
                </span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifySelf: "end",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  title={t.edit}
                >
                  ✎
                </button>

                <button
                  type="button"
                  disabled={busyId === course.id}
                  onClick={() => handleDelete(course.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#B3131A",
                  }}
                  title={t.delete}
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
          marginTop: "16px",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      >
        <div>
          {meta.total_courses}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadCourses(page - 1)}
            style={{
              minWidth: "76px",
              height: "30px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#FFFFFF",
              cursor: page <= 1 ? "default" : "pointer",
              opacity: page <= 1 ? 0.45 : 1,
            }}
          >
            {t.prev}
          </button>

          <button
            type="button"
            disabled={page >= meta.total_pages}
            onClick={() => loadCourses(page + 1)}
            style={{
              minWidth: "76px",
              height: "30px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#FFFFFF",
              cursor: page >= meta.total_pages ? "default" : "pointer",
              opacity: page >= meta.total_pages ? 0.45 : 1,
            }}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}