import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourse, updateCourse } from "../../api/adminCourses";
import { useLang } from "../../context/LanguageContext";

function tagsToString(tags) {
  if (!Array.isArray(tags)) return "";
  return tags.filter(Boolean).join(", ");
}

function stringToTags(str) {
  const tags = (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return tags.length ? tags : [];
}

function normalizeCourse(data = {}) {
  return {
    title_ua: data.title_ua ?? "",
    title_en: data.title_en ?? "",
    description_ua: data.description_ua ?? "",
    description_en: data.description_en ?? "",
    category: data.category ?? "",
    durationText: data.durationText ?? "",
    price:
      typeof data.price === "number" ? data.price : Number(data.price) || 0,
    image: data.image ?? "",
    link: data.link ?? data.url ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    isPublished: Boolean(data.isPublished),
    isArchived: Boolean(data.isArchived),
  };
}

function validateCourse(form, lang) {
  const ua = lang === "ua";
  const errors = [];

  if (!form.title_ua?.trim())
    errors.push(ua ? "Заповни Title (UA)." : "Fill Title (UA).");
  if (!form.title_en?.trim())
    errors.push(ua ? "Заповни Title (EN)." : "Fill Title (EN).");
  if (!form.description_ua?.trim())
    errors.push(ua ? "Заповни Description (UA)." : "Fill Description (UA).");
  if (!form.description_en?.trim())
    errors.push(ua ? "Заповни Description (EN)." : "Fill Description (EN).");
  if (!form.category?.trim())
    errors.push(ua ? "Заповни Category." : "Fill Category.");
  if (!form.durationText?.trim())
    errors.push(ua ? "Заповни Duration." : "Fill Duration.");

  if (!Array.isArray(form.tags) || form.tags.length < 1)
    errors.push(ua ? "Додай хоча б один tag." : "Add at least one tag.");

  const price = Number(form.price);
  if (Number.isNaN(price) || price < 0)
    errors.push(ua ? "Price має бути >= 0." : "Price must be >= 0.");

  if (!form.isPublished && !form.isArchived)
    errors.push(
      ua
        ? "Обери статус: Опубліковано або В архіві."
        : "Choose status: Published or Archived."
    );

  if (form.isPublished && form.isArchived)
    errors.push(
      ua
        ? "Не можна вибрати два статуси одночасно."
        : "You can't select both statuses."
    );

  return errors;
}

function toNullIfEmpty(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function sanitizePayload(form, tagsText) {
  const tags = stringToTags(tagsText);

  const payload = {
    title_ua: toNullIfEmpty(form.title_ua),
    title_en: toNullIfEmpty(form.title_en),
    description_ua: toNullIfEmpty(form.description_ua),
    description_en: toNullIfEmpty(form.description_en),
    category: toNullIfEmpty(form.category),
    durationText: toNullIfEmpty(form.durationText),
    price: Number(form.price) || 0,
    image: toNullIfEmpty(form.image),
    link: toNullIfEmpty(form.link),
    speaker: null,
    tags,
    isPublished: Boolean(form.isPublished),
    isArchived: Boolean(form.isArchived),
  };

  return payload;
}

export default function AdminCourseEditorPage() {
  const { lang } = useLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(normalizeCourse());
  const [tagsText, setTagsText] = useState("");

  const t = useMemo(() => {
    const ua = lang === "ua";
    return {
      title: isEdit ? (ua ? "Редагувати курс" : "Edit course") : ua ? "Створити курс" : "Create course",
      save: ua ? "Зберегти" : "Save",
      back: ua ? "Назад" : "Back",
      placeholder: ua
        ? "Поля відповідають API бекенду. Мінімум: назви, описи, категорія, duration, tags, price."
        : "Fields match backend API. Minimum: titles, descriptions, category, duration, tags, price.",
      required: ua ? "Обов’язково" : "Required",
      tagsHint: ua ? "Введи теги через кому. Напр: fintech, ai, regtech" : "Enter tags separated by commas. Ex: fintech, ai, regtech",
      publish: ua ? "Опубліковано" : "Published",
      archived: ua ? "В архіві" : "Archived",
      saveFailed: ua ? "Не вдалося зберегти курс." : "Save failed.",
      loadFailed: ua ? "Не вдалося завантажити курс." : "Failed to load course.",
    };
  }, [lang, isEdit]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCourse(id);
        if (!alive) return;
        const normalized = normalizeCourse(data);
        setForm(normalized);
        setTagsText(tagsToString(normalized.tags));
      } catch (e) {
        console.error(e);
        alert(t.loadFailed);
        navigate("/admin/courses", { replace: true });
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, isEdit, navigate, t.loadFailed]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onTogglePublished = (v) => {
    setForm((prev) => ({
      ...prev,
      isPublished: v,
      isArchived: v ? false : prev.isArchived,
    }));
  };

  const onToggleArchived = (v) => {
    setForm((prev) => ({
      ...prev,
      isArchived: v,
      isPublished: v ? false : prev.isPublished,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    const payload = sanitizePayload(form, tagsText);
    const errors = validateCourse({ ...form, tags: stringToTags(tagsText) }, lang);

    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    setSaving(true);
    try {
      if (isEdit) await updateCourse(id, payload);
      else await createCourse(payload);
      navigate("/admin/courses", { replace: true });
    } catch (e2) {
      console.error(e2);
      alert(t.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-600">Loading…</div>;

  return (
    <div className="text-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">{t.title}</h1>
          <div className="mt-2 text-sm text-slate-500">{t.placeholder}</div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
        >
          {t.back}
        </button>
      </div>

      <form
        onSubmit={onSave}
        className="mt-6 bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={`Title (UA) (${t.required})`}
            value={form.title_ua}
            onChange={(v) => set("title_ua", v)}
            placeholder="Назва курсу українською"
          />
          <InputField
            label={`Title (EN) (${t.required})`}
            value={form.title_en}
            onChange={(v) => set("title_en", v)}
            placeholder="Course title in English"
          />
          <InputField
            label={`Category (${t.required})`}
            value={form.category}
            onChange={(v) => set("category", v)}
            placeholder="regtech_suptech / ai_finance / ..."
          />
          <InputField
            label={`Duration (${t.required})`}
            value={form.durationText}
            onChange={(v) => set("durationText", v)}
            placeholder='Напр. "20 годин (3 лекції, 2 практичні)"'
          />
          <InputField
            type="number"
            label={`Price (${t.required})`}
            value={String(form.price ?? 0)}
            onChange={(v) => set("price", v)}
            placeholder="0"
          />
          <InputField
            label="Image URL"
            value={form.image}
            onChange={(v) => set("image", v)}
            placeholder="https://..."
          />
          <InputField
            colSpan
            label="Original link"
            value={form.link}
            onChange={(v) => set("link", v)}
            placeholder="https://..."
          />
          <InputField
            colSpan
            label={`Tags (${t.required})`}
            value={tagsText}
            onChange={(v) => setTagsText(v)}
            placeholder={t.tagsHint}
          />
          <TextareaField
            label={`Description (UA) (${t.required})`}
            value={form.description_ua}
            onChange={(v) => set("description_ua", v)}
            placeholder="Опис українською"
          />
          <TextareaField
            label={`Description (EN) (${t.required})`}
            value={form.description_en}
            onChange={(v) => set("description_en", v)}
            placeholder="Description in English"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <Checkbox
            label={t.publish}
            checked={form.isPublished}
            onChange={onTogglePublished}
          />
          <Checkbox
            label={t.archived}
            checked={form.isArchived}
            onChange={onToggleArchived}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-lg bg-[#2E5D8C] text-white font-medium hover:opacity-95 disabled:opacity-60"
          >
            {saving ? "Saving…" : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", colSpan, placeholder }) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <div className="text-sm font-medium text-slate-900">{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#2E5D8C]/20"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div className="md:col-span-2">
      <div className="text-sm font-medium text-slate-900">{label}</div>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full min-h-[140px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#2E5D8C]/20"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-800">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}