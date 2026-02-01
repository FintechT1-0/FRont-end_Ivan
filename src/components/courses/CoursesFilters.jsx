import { useLang } from "../../context/LanguageContext";

export default function CoursesFilters({
  filters,
  onChange,
  categoryOptions = [],
  priceOptions = [],
  durationOptions = [],
}) {
  const { lang } = useLang();

  const t = {
    search: lang === "en" ? "Search" : "Пошук",
    category: lang === "en" ? "Category" : "Категорія",
    allCategories: lang === "en" ? "All categories" : "Всі категорії",
    price: lang === "en" ? "Price" : "Ціна",
    anyPrice: lang === "en" ? "Any price" : "Будь-яка ціна",
    duration: lang === "en" ? "Duration" : "Тривалість",
    anyDuration: lang === "en" ? "Any duration" : "Будь-яка тривалість",
  };

  const safeDurationIndex =
    typeof filters.durationIndex === "number" ? filters.durationIndex : 0;

  const durationLabel =
    durationOptions?.length > 0
      ? durationOptions[Math.min(safeDurationIndex, durationOptions.length - 1)]
          ?.label
      : lang === "en"
        ? "Loading…"
        : "Завантаження…";

  return (
    <div className="mt-10">
      {/* top row like your design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH */}
        <div className="relative">
          <input
            value={filters.q || ""}
            onChange={(e) => onChange({ ...filters, q: e.target.value })}
            placeholder={t.search}
            className="h-12 w-full rounded-xl bg-[#A35C6A] text-white px-5 pr-12 outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80">
            🔍
          </span>
        </div>

        {/* CATEGORY */}
        <select
          value={filters.category || ""}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="h-12 w-full rounded-xl bg-[#A35C6A] text-white px-5 outline-none"
        >
          <option value="">{t.allCategories}</option>
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value} className="text-black">
              {c.label}
            </option>
          ))}
        </select>

        {/* PRICE */}
        <select
          value={filters.priceKey || ""}
          onChange={(e) => onChange({ ...filters, priceKey: e.target.value })}
          className="h-12 w-full rounded-xl bg-[#A35C6A] text-white px-5 outline-none"
        >
          <option value="">{t.anyPrice}</option>
          {priceOptions.map((p) => (
            <option key={p.key} value={p.key} className="text-black">
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* DURATION SLIDER */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-white/85 mb-2">
          <span>{t.duration}</span>
          <span className="text-white/95">{durationLabel}</span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max((durationOptions?.length || 1) - 1, 0)}
          step={1}
          value={safeDurationIndex}
          onChange={(e) =>
            onChange({ ...filters, durationIndex: Number(e.target.value) })
          }
          className="w-full"
          disabled={!durationOptions?.length}
        />

        {durationOptions?.length > 1 ? (
          <div className="flex justify-between text-[11px] text-white/55 mt-1">
            <span>{durationOptions[0]?.label || t.anyDuration}</span>
            <span>{durationOptions[durationOptions.length - 1]?.label}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}