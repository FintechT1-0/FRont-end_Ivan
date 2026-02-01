import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import SafeImage from "../SafeImage";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { user } = useAuth();

  const title = lang === "ua" ? course.title_ua : course.title_en;
  const description = lang === "ua" ? course.description_ua : course.description_en;

  const viewLabel = lang === "en" ? "View" : "Переглянути";
  const freeLabel = lang === "en" ? "Free" : "Безкоштовно";

  function handleView() {
    const next = encodeURIComponent(`/courses/${course.id}`);
    if (!user) {
      navigate(`/login?next=${next}`);
      return;
    }
    navigate(`/courses/${course.id}`);
  }

  return (
    <div className="bg-[#2E5D8C] rounded-[32px] p-4 w-[320px] shrink-0 text-white">
      <div className="bg-white rounded-[24px] h-[180px] mb-4 overflow-hidden">
        {course.image ? (
          <SafeImage
            src={course.image}
            fallbackSrc={null}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      <h3 className="text-lg mb-2 line-clamp-2">{title}</h3>

      <p className="text-sm opacity-80 mb-3 line-clamp-2">{description}</p>

      <div className="flex justify-between text-sm opacity-70 mb-3">
        <span className="truncate max-w-[60%]">{course.category}</span>
        <span className="shrink-0">{course.durationText}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg">
          {Number(course.price) === 0 ? freeLabel : `$${course.price}`}
        </span>

        <button
          onClick={handleView}
          className="bg-[#A94F5E] px-5 py-1 rounded-full text-sm hover:opacity-90"
        >
          {viewLabel}
        </button>
      </div>
    </div>
  );
}