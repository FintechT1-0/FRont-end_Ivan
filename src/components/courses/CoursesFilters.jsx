import { useMemo } from "react";
import { useLang } from "../../context/LanguageContext";

const FIELD =
  "h-12 w-full rounded-xl bg-[#A35C6A] text-white placeholder:text-white/75 px-5 outline-none";
const LABEL = "text-sm text-white/85";
const WRAP = "mt-10 bg-white/5 rounded-2xl p-5";

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none"
    >
      <path
        d="M5 8l5 5 5-5"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M9 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
      />
      <path
        d="M14.5 14.5 18 18"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 px-4 rounded-full text-sm transition",
        active
          ? "bg-white text-[#0E3A73]"
          : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function CoursesFilters({ filters, onChange, categoryOptions = [] }) {
  const { lang } = useLang();
  const ua = lang !== "en";

  const t = useMemo(
    () => ({
      search: ua ? "Пошук" : "Search",
      category: ua ? "Категорія" : "Category",
      allCategories: ua ? "Всі категорії" : "All categories",
      duration: ua ? "Тривалість (текст)" : "Duration (text)",
      durationPh: ua ? "Напр: 6 weeks, 10 год" : "e.g. 6 weeks, 10 hours",
      tags: ua ? "Теги (через кому)" : "Tags (comma-separated)",
      tagsPh: ua ? "AI, fintech, blockchain" : "AI, fintech, blockchain",
      price: ua ? "Ціна" : "Price",
      min: ua ? "Мін" : "Min",
      max: ua ? "Макс" : "Max",
      free: ua ? "Безкоштовно" : "Free",
      paid: ua ? "Платні" : "Paid",
      any: ua ? "Будь-які" : "Any",
      applyHint: ua
        ? "Пошук запускається автоматично після паузи в наборі."
        : "Search runs automatically after you stop typing.",
    }),
    [ua]
  );

  const set = (patch) => onChange({ ...filters, ...patch });

  const priceMin = filters.priceMin ?? "";
  const priceMax = filters.priceMax ?? "";

  const setFree = () => set({ priceMin: "0", priceMax: "0" });
  const setPaid = () => set({ priceMin: "1", priceMax: "" });
  const setAnyPrice = () => set({ priceMin: "", priceMax: "" });

  const isFree = String(priceMin) === "0" && String(priceMax) === "0";
  const isPaid = String(priceMin) === "1" && String(priceMax || "") === "";

  return (
    <div className={WRAP}>
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SEARCH */}
        <div className="relative">
          <div className={LABEL}>{t.search}</div>
          <input
            value={filters.q || ""}
            onChange={(e) => set({ q: e.target.value })}
            placeholder={t.search}
            className={[FIELD, "pr-12 mt-2"].join(" ")}
          />
          <div className="absolute right-4 top-[44px] -translate-y-1/2 opacity-90">
            <IconSearch />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="relative">
          <div className={LABEL}>{t.category}</div>
          <select
            value={filters.category || ""}
            onChange={(e) => set({ category: e.target.value })}
            className={[FIELD, "appearance-none mt-2 pr-12"].join(" ")}
          >
            <option value="">{t.allCategories}</option>
            {categoryOptions.map((c) => (
              <option key={c.value || "all"} value={c.value} className="text-black">
                {c.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-[44px] -translate-y-1/2 opacity-90">
            <Chevron />
          </div>
        </div>

        {/* DURATION */}
        <div>
          <div className={LABEL}>{t.duration}</div>
          <input
            value={filters.durationText || ""}
            onChange={(e) => set({ durationText: e.target.value })}
            placeholder={t.durationPh}
            className={[FIELD, "mt-2"].join(" ")}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PRICE */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className={LABEL}>{t.price}</div>
            <div className="text-xs text-white/60">{t.applyHint}</div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4">
            <input
              inputMode="numeric"
              value={priceMin}
              onChange={(e) => set({ priceMin: e.target.value })}
              placeholder={t.min}
              className={FIELD}
            />
            <input
              inputMode="numeric"
              value={priceMax}
              onChange={(e) => set({ priceMax: e.target.value })}
              placeholder={t.max}
              className={FIELD}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip active={!isFree && !isPaid && !priceMin && !priceMax} onClick={setAnyPrice}>
              {t.any}
            </Chip>
            <Chip active={isFree} onClick={setFree}>
              {t.free}
            </Chip>
            <Chip active={isPaid} onClick={setPaid}>
              {t.paid}
            </Chip>
          </div>
        </div>

        {/* TAGS */}
        <div>
          <div className={LABEL}>{t.tags}</div>
          <input
            value={filters.tagsText || ""}
            onChange={(e) => set({ tagsText: e.target.value })}
            placeholder={t.tagsPh}
            className={[FIELD, "mt-2"].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}