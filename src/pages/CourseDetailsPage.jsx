import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../api/courses";
import SafeImage from "../components/SafeImage";
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

function getLocalizedTitle(course, lang) {
  if (lang === "ua") {
    return course?.title_ua || course?.title_en || "Course";
  }

  return course?.title_en || course?.title_ua || "Course";
}

function getLocalizedDescription(course, lang) {
  if (lang === "ua") {
    return course?.description_ua || course?.description_en || "";
  }

  return course?.description_en || course?.description_ua || "";
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { lang } = useLang();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      loading: lang === "en" ? "Loading..." : "Завантаження...",
      back: lang === "en" ? "Back to courses" : "Назад до курсів",
      notFound: lang === "en" ? "Course not found" : "Курс не знайдено",
      category: lang === "en" ? "Category" : "Категорія",
      duration: lang === "en" ? "Duration" : "Тривалість",
      speaker: lang === "en" ? "Speaker" : "Спікер",
      price: lang === "en" ? "Price" : "Ціна",
      tags: lang === "en" ? "Tags" : "Теги",
      free: lang === "en" ? "Free" : "Безкоштовно",
      open: lang === "en" ? "Open course" : "Відкрити курс",
      noLink:
        lang === "en"
          ? "Course link unavailable"
          : "Посилання на курс недоступне",
      error:
        lang === "en"
          ? "Failed to load course"
          : "Не вдалося завантажити курс",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        setLoading(true);
        setErrorText("");

        const data = await getCourseById(id);
        if (!active) return;

        setCourse(data || null);
      } catch (error) {
        if (!active) return;

        console.error(error);
        setCourse(null);
        setErrorText(getBackendError(error, t.error));
      } finally {
        if (active) setLoading(false);
      }
    }

    if (!id) {
      setCourse(null);
      setLoading(false);
      return;
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [id, t.error]);

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div style={glassCard} className="rounded-[28px] p-8">
            <div className="text-xl font-semibold">
              {errorText || t.notFound}
            </div>

            <Link
              to="/courses"
              className="inline-flex mt-4 text-white/90 underline hover:text-white"
            >
              ← {t.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = getLocalizedTitle(course, lang);
  const description = getLocalizedDescription(course, lang);

  return (
    <div className="min-h-[90vh] bg-[#082947] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/courses"
          className="inline-flex mb-6 text-white/90 underline hover:text-white"
        >
          ← {t.back}
        </Link>

        <div style={glassCard} className="rounded-[28px] overflow-hidden">
          <div className="h-[320px] bg-[#6F86A4]/60 overflow-hidden">
            <SafeImage
              src={course.image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>

            <p className="mt-4 text-white/85 leading-7">
              {description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <span className="text-white/60">{t.category}: </span>
                <span>{course.category || "-"}</span>
              </div>

              <div>
                <span className="text-white/60">{t.duration}: </span>
                <span>{course.durationText || "-"}</span>
              </div>

              <div>
                <span className="text-white/60">{t.speaker}: </span>
                <span>{course.speaker || "-"}</span>
              </div>

              <div>
                <span className="text-white/60">{t.price}: </span>
                <span>
                  {Number(course.price) > 0 ? `${course.price} USD` : t.free}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-white/60 text-sm mb-2">{t.tags}:</div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(course.tags) && course.tags.length > 0 ? (
                  course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-white/10 text-white"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/75">-</span>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              <button
                onClick={() => {
                  if (course.link) {
                    window.open(course.link, "_blank", "noopener,noreferrer");
                    return;
                  }

                  alert(t.noLink);
                }}
                className="px-6 py-2 rounded-full text-sm font-medium text-white"
                style={{
                  background: "#B3131A",
                  boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                }}
              >
                {t.open}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}