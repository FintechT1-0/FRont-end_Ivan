import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import SafeImage from "../SafeImage";

export default function CourseCard({ course, className = "" }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { user } = useAuth();

  const title = lang === "ua" ? course?.title_ua : course?.title_en;
  const description = lang === "ua" ? course?.description_ua : course?.description_en;

  const t = useMemo(() => {
    const en = lang === "en";
    return {
      view: en ? "View" : "Переглянути",
      free: en ? "Free" : "Безкоштовно",
      noTitle: en ? "Untitled course" : "Курс без назви",
      noDesc: en ? "No description yet" : "Опис зʼявиться пізніше",
      noCategory: en ? "No category" : "Без категорії",
      noDuration: en ? "No duration" : "Без тривалості",
    };
  }, [lang]);

  function handleView() {
    const next = encodeURIComponent(`/courses/${course?.id}`);
    if (!user) {
      navigate(`/login?next=${next}`);
      return;
    }
    navigate(`/courses/${course?.id}`);
  }

  const priceNumber = Number(course?.price);
  const priceLabel =
    Number.isFinite(priceNumber) && priceNumber === 0
      ? t.free
      : Number.isFinite(priceNumber)
      ? `$${priceNumber}`
      : "—";

  const categoryLabel = course?.category || t.noCategory;
  const durationLabel = course?.durationText || t.noDuration;

  return (
    <div
      className={[
        "bg-[#2E5D8C] rounded-[32px] p-4 w-[320px] shrink-0 text-white",
        "flex flex-col h-[540px] overflow-hidden", // однакова висота + нічого не вилазить
        className,
      ].join(" ")}
    >
      {/* IMAGE */}
      <div className="bg-white rounded-[24px] h-[180px] overflow-hidden">
        {course?.image ? (
          <SafeImage
            src={course.image}
            fallbackSrc={null}
            alt={title || t.noTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black/5" />
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        {/* TITLE */}
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {title || t.noTitle}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 text-sm opacity-85 leading-relaxed line-clamp-3">
          {description || t.noDesc}
        </p>

        {/* META: category + duration (duration now wraps nicely) */}
        <div className="mt-3 text-sm opacity-85 space-y-2">
          <div className="text-white/80 text-xs uppercase tracking-wide">
            {lang === "en" ? "Category" : "Категорія"}
          </div>
          <div className="text-sm break-words line-clamp-2" title={categoryLabel}>
            {categoryLabel}
          </div>

          <div className="pt-1 text-white/80 text-xs uppercase tracking-wide">
            {lang === "en" ? "Duration" : "Тривалість"}
          </div>
          {/* ВАЖЛИВО: duration не в один рядок, а переноситься */}
          <div
            className="text-sm break-words whitespace-normal leading-snug line-clamp-2"
            title={durationLabel}
          >
            {durationLabel}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold whitespace-nowrap">
            {priceLabel}
          </span>

          <button
            type="button"
            onClick={handleView}
            className="bg-[#A94F5E] px-5 py-2 rounded-full text-sm hover:opacity-90 transition whitespace-nowrap"
          >
            {t.view}
          </button>
        </div>
      </div>
    </div>
  );
}