import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourse, updateCourse } from "../../api/adminCourses";
import { useLang } from "../../context/LanguageContext";

/* ---------------- helpers ---------------- */

function normalizeCourse(data = {}) {
  return {
    title_ua: data.title_ua ?? "",
    title_en: data.title_en ?? "",
    description_ua: data.description_ua ?? "",
    description_en: data.description_en ?? "",
    category: data.category ?? "",
    durationText: data.durationText ?? "",
    price: data.price ?? 0,
    image: data.image ?? "",
    link: data.link ?? data.url ?? "",
    isPublished: Boolean(data.isPublished),
    isArchived: Boolean(data.isArchived),
  };
}

/* ---------------- page ---------------- */

export default function AdminCourseEditorPage() {
  const { lang } = useLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(normalizeCourse());

  const t = useMemo(
    () => ({
      title: isEdit ? "Edit course" : "Create course",
      save: lang === "ua" ? "Зберегти" : "Save",
      back: lang === "ua" ? "Назад" : "Back",
      required: lang === "ua" ? "Обовʼязково" : "Required",
      placeholder:
        lang === "ua"
          ? "Деякі поля можна заповнити пізніше у фінальній версії."
          : "Some fields can be filled later in the final version.",
    }),
    [lang, isEdit]
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCourse(id);
        if (alive) setForm(normalizeCourse(data));
      } catch {
        alert("Failed to load course");
        navigate("/admin/courses", { replace: true });
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, isEdit, navigate]);

  const set = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSave = async (e) => {
    e.preventDefault();

    if (!form.title_ua && !form.title_en) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) || 0 };
      isEdit
        ? await updateCourse(id, payload)
        : await createCourse(payload);

      navigate("/admin/courses", { replace: true });
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-black/60">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-medium">{t.title}</h1>
        <button
          onClick={() => navigate("/admin/courses")}
          className="h-10 px-4 rounded-md border hover:bg-black/5"
        >
          {t.back}
        </button>
      </div>

      <div className="mt-3 text-sm text-black/60">{t.placeholder}</div>

      <form
        onSubmit={onSave}
        className="mt-6 bg-white rounded-md border p-6 space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Title (UA)"
            value={form.title_ua}
            onChange={(v) => set("title_ua", v)}
          />
          <InputField
            label={`Title (EN) (${t.required})`}
            value={form.title_en}
            onChange={(v) => set("title_en", v)}
          />
          <InputField
            label="Category"
            value={form.category}
            onChange={(v) => set("category", v)}
          />
          <InputField
            label="Duration"
            value={form.durationText}
            onChange={(v) => set("durationText", v)}
          />
          <InputField
            type="number"
            label="Price"
            value={form.price}
            onChange={(v) => set("price", v)}
          />
          <InputField
            label="Image URL"
            value={form.image}
            onChange={(v) => set("image", v)}
          />
          <InputField
            colSpan
            label="Original link"
            value={form.link}
            onChange={(v) => set("link", v)}
          />
          <TextareaField
            label="Description (UA)"
            value={form.description_ua}
            onChange={(v) => set("description_ua", v)}
          />
          <TextareaField
            label="Description (EN)"
            value={form.description_en}
            onChange={(v) => set("description_en", v)}
          />
        </div>

        <div className="flex gap-6">
          <Checkbox
            label="Published"
            checked={form.isPublished}
            onChange={(v) => set("isPublished", v)}
          />
          <Checkbox
            label="Archived"
            checked={form.isArchived}
            onChange={(v) => set("isArchived", v)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-md bg-[#2E5D8C] text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}
/* ---------------- UI components ---------------- */
function InputField({ label, value, onChange, type = "text", colSpan }) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <div className="text-sm font-medium">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-10 rounded-md border px-3"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }) {
  return (
    <div className="col-span-2">
      <div className="text-sm font-medium">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full min-h-[120px] rounded-md border px-3 py-2"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}