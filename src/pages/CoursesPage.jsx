import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../api/courses";
import SafeImage from "../components/SafeImage";
import { useLang } from "../context/LanguageContext";

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
};

export default function CoursesPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    return {
      title:
        lang === "en"
          ? "DISCOVER COURSES THAT GROW YOUR FINTECH CAREER"
          : "ЗНАЙДИ КУРСИ ДЛЯ РОЗВИТКУ У FINTECH",
      btn: lang === "en" ? "View course" : "Переглянути",
      loading: lang === "en" ? "Loading..." : "Завантаження...",
      empty: lang === "en" ? "No courses yet" : "Курсів поки немає",
    };
  }, [lang]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#082947] text-white px-6 py-10">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold">
          {t.title}
        </h1>
      </div>

      {/* COURSES GRID */}
      {courses.length === 0 ? (
        <div className="text-center text-white/70">{t.empty}</div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {courses.map((course) => (
            <div
              key={course.id}
              style={glassCard}
              className="rounded-[28px] p-5 flex flex-col"
            >
              {/* IMAGE */}
              <div className="h-[180px] bg-[#6F86A4]/60 rounded-[18px] overflow-hidden">
                <SafeImage
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-lg font-semibold">
                {course.title}
              </h3>

              {/* DESC */}
              <p className="mt-2 text-sm text-white/80 line-clamp-3">
                {course.description}
              </p>

              {/* BUTTON CENTER */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => window.open(course.link, "_blank")}
                  className="px-6 py-2 rounded-full text-sm font-medium text-white"
                  style={{
                    background: "#B3131A",
                    boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                  }}
                >
                  {t.btn}
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}