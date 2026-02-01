import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";

export default function CoursesCarousel({ courses }) {
  const { lang } = useLang();
  const navigate = useNavigate();

  if (!courses.length) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold mb-6">
        {lang === "en" ? "Featured courses" : "Рекомендовані курси"}
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="min-w-[260px] bg-[#3F5F8C] rounded-2xl p-5 cursor-pointer"
            onClick={() => navigate(`/courses/${c.id}`)}
          >
            <div className="h-32 bg-white rounded-xl mb-4" />

            <div className="font-semibold line-clamp-2">
              {lang === "ua" ? c.title_ua : c.title_en}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}