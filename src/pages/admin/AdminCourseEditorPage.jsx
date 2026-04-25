import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourseById, updateCourse } from "../../api/courses";
import { useLang } from "../../context/LanguageContext";

function emptyChapter() {
  return {
    title_ua: "",
    title_en: "",
    description_ua: "",
    description_en: "",
    embeddings: [""],
  };
}

function tagsToText(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

function textToTags(value) {
  return String(value || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizeEmbeddings(value) {
  if (Array.isArray(value)) {
    return value.map((x) => String(x || "").trim()).filter(Boolean);
  }

  return [];
}

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((x) => x.msg).join(", ");
  return error?.response?.data?.message || error?.message || fallback;
}

export default function AdminCourseEditorPage() {
  const { lang } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    course_type: "external",
    title_ua: "",
    title_en: "",
    description_ua: "",
    description_en: "",
    category: "",
    tags: "",
    durationText: "",
    price: "",
    link: "",
    image: "",
    speaker: "",
    isPublished: false,
    chapters: [emptyChapter()],
  });

  const t = useMemo(() => {
    return {
      title: isEdit
        ? lang === "ua"
          ? "РЕДАГУВАТИ КУРС"
          : "EDIT COURSE"
        : lang === "ua"
        ? "СТВОРИТИ КУРС"
        : "CREATE COURSE",

      details: lang === "ua" ? "Деталі курсу" : "Course details",
      content: lang === "ua" ? "Контент і extra" : "Content and extra",

      save: lang === "ua" ? "Зберегти" : "Save",
      saving: lang === "ua" ? "Збереження..." : "Saving...",
      back: lang === "ua" ? "Назад" : "Back",

      courseType: lang === "ua" ? "Тип курсу" : "Course type",
      external: lang === "ua" ? "Зовнішній курс" : "External course",
      internal: lang === "ua" ? "Внутрішній курс" : "Internal course",

      category: lang === "ua" ? "Категорія" : "Category",
      titleUa: lang === "ua" ? "Назва UA" : "Title UA",
      titleEn: lang === "ua" ? "Назва EN" : "Title EN",
      descUa: lang === "ua" ? "Опис UA" : "Description UA",
      descEn: lang === "ua" ? "Опис EN" : "Description EN",
      tags: lang === "ua" ? "Теги через кому" : "Tags separated by comma",
      duration: lang === "ua" ? "Тривалість" : "Duration",
      price: lang === "ua" ? "Ціна" : "Price",
      speaker: lang === "ua" ? "Спікер" : "Speaker",
      image: lang === "ua" ? "URL зображення" : "Image URL",
      link: lang === "ua" ? "Зовнішнє посилання" : "External link",
      published: lang === "ua" ? "Опубліковано" : "Published",

      chapter: lang === "ua" ? "Глава" : "Chapter",
      chapterTitleUa: lang === "ua" ? "Назва глави UA" : "Chapter title UA",
      chapterTitleEn: lang === "ua" ? "Назва глави EN" : "Chapter title EN",
      chapterTextUa: lang === "ua" ? "Текст глави UA" : "Chapter text UA",
      chapterTextEn: lang === "ua" ? "Текст глави EN" : "Chapter text EN",

      extraLinks:
        lang === "ua"
          ? "Extra ресурси / YouTube / матеріали"
          : "Extra resources / YouTube / materials",
      extraPlaceholder:
        lang === "ua"
          ? "Встав URL ресурсу"
          : "Paste resource URL",
      addExtra:
        lang === "ua"
          ? "+ Додати extra посилання"
          : "+ Add extra link",
      removeExtra:
        lang === "ua"
          ? "Видалити посилання"
          : "Remove link",

      addChapter: lang === "ua" ? "+ Додати главу" : "+ Add chapter",
      remove: lang === "ua" ? "Видалити" : "Remove",

      externalInfo:
        lang === "ua"
          ? "Для зовнішнього курсу додай посилання на чужий ресурс у полі «Зовнішнє посилання». У вкладці «Контент і extra» можна додати extra посилання, YouTube або матеріали."
          : "For an external course, add the third-party course link in External link. In Content and extra, you can add extra links, YouTube or materials.",
      internalInfo:
        lang === "ua"
          ? "Для внутрішнього курсу додай глави, великий текст і extra посилання. Extra зберігається як embeddings у главі."
          : "For an internal course, add chapters, large text and extra links. Extra is stored as embeddings inside the chapter.",

      required:
        lang === "ua"
          ? "Заповни обов’язкові поля."
          : "Fill required fields.",
      needLink:
        lang === "ua"
          ? "Для зовнішнього курсу потрібне посилання."
          : "External course needs a link.",
      needChapter:
        lang === "ua"
          ? "Додай хоча б одну заповнену главу або extra блок."
          : "Add at least one completed chapter or extra block.",
      fail:
        lang === "ua"
          ? "Не вдалося зберегти курс."
          : "Failed to save course.",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
    };
  }, [lang, isEdit]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isEdit) return;

      try {
        setLoading(true);
        const data = await getCourseById(id);
        if (!active) return;

        setForm({
          course_type: data.course_type || "external",
          title_ua: data.title_ua || "",
          title_en: data.title_en || "",
          description_ua: data.description_ua || "",
          description_en: data.description_en || "",
          category: data.category || "",
          tags: tagsToText(data.tags),
          durationText: data.durationText || "",
          price: data.price ?? "",
          link: data.link || "",
          image: data.image || "",
          speaker: data.speaker || "",
          isPublished: Boolean(data.isPublished),
          chapters:
            Array.isArray(data.chapters) && data.chapters.length
              ? data.chapters.map((chapter) => ({
                  title_ua: chapter.title_ua || "",
                  title_en: chapter.title_en || "",
                  description_ua: chapter.description_ua || "",
                  description_en: chapter.description_en || "",
                  embeddings:
                    Array.isArray(chapter.embeddings) && chapter.embeddings.length
                      ? chapter.embeddings
                      : [""],
                }))
              : [emptyChapter()],
        });
      } catch (error) {
        alert(getBackendError(error, "Failed to load course"));
        navigate("/admin/courses");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id, isEdit, navigate]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function setChapter(index, name, value) {
    setForm((prev) => {
      const next = [...prev.chapters];
      next[index] = { ...next[index], [name]: value };
      return { ...prev, chapters: next };
    });
  }

  function addChapter() {
    setForm((prev) => ({
      ...prev,
      chapters: [...prev.chapters, emptyChapter()],
    }));
  }

  function removeChapter(index) {
    setForm((prev) => {
      const next = prev.chapters.filter((_, i) => i !== index);
      return { ...prev, chapters: next.length ? next : [emptyChapter()] };
    });
  }

  function addEmbedding(chapterIndex) {
    setForm((prev) => {
      const chapters = [...prev.chapters];
      const current = chapters[chapterIndex];

      chapters[chapterIndex] = {
        ...current,
        embeddings: [...(current.embeddings || []), ""],
      };

      return { ...prev, chapters };
    });
  }

  function setEmbedding(chapterIndex, embeddingIndex, value) {
    setForm((prev) => {
      const chapters = [...prev.chapters];
      const current = chapters[chapterIndex];
      const embeddings = [...(current.embeddings || [])];

      embeddings[embeddingIndex] = value;

      chapters[chapterIndex] = {
        ...current,
        embeddings,
      };

      return { ...prev, chapters };
    });
  }

  function removeEmbedding(chapterIndex, embeddingIndex) {
    setForm((prev) => {
      const chapters = [...prev.chapters];
      const current = chapters[chapterIndex];
      const embeddings = (current.embeddings || []).filter(
        (_, i) => i !== embeddingIndex
      );

      chapters[chapterIndex] = {
        ...current,
        embeddings: embeddings.length ? embeddings : [""],
      };

      return { ...prev, chapters };
    });
  }

  function cleanChapters() {
    return form.chapters
      .map((chapter) => ({
        title_ua: chapter.title_ua.trim() || form.title_ua.trim(),
        title_en: chapter.title_en.trim() || form.title_en.trim(),
        description_ua:
          chapter.description_ua.trim() || form.description_ua.trim(),
        description_en:
          chapter.description_en.trim() || form.description_en.trim(),
        embeddings: normalizeEmbeddings(chapter.embeddings),
      }))
      .filter(
        (chapter) =>
          chapter.title_ua &&
          chapter.title_en &&
          chapter.description_ua &&
          chapter.description_en
      );
  }

  function validate() {
    if (
      !form.title_ua.trim() ||
      !form.title_en.trim() ||
      !form.description_ua.trim() ||
      !form.description_en.trim() ||
      !form.category.trim() ||
      !form.durationText.trim() ||
      textToTags(form.tags).length === 0
    ) {
      return t.required;
    }

    if (form.course_type === "external" && !form.link.trim()) {
      return t.needLink;
    }

    if (cleanChapters().length === 0) {
      return t.needChapter;
    }

    return "";
  }

  async function submit(event) {
    event.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const payload = {
      title_ua: form.title_ua,
      title_en: form.title_en,
      description_ua: form.description_ua,
      description_en: form.description_en,
      category: form.category,
      tags: textToTags(form.tags),
      durationText: form.durationText,
      price: Number(form.price) || 0,
      link: form.link || null,
      image: form.image || null,
      speaker: form.speaker || null,
      isPublished: Boolean(form.isPublished),
      chapters: cleanChapters(),
    };

    if (!isEdit) {
      payload.course_type = form.course_type;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }

      navigate("/admin/courses");
    } catch (error) {
      alert(getBackendError(error, t.fail));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ color: "#fff", fontSize: 13 }}>{t.loading}</div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: 930 }}>
      <div style={topRow}>
        <h1 style={pageTitle}>{t.title}</h1>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          style={ghostBtn}
        >
          {t.back}
        </button>
      </div>

      <form onSubmit={submit} style={panel}>
        <div style={tabs}>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            style={tab(activeTab === "details")}
          >
            {t.details}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            style={tab(activeTab === "content")}
          >
            {t.content}
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            <div style={gridTwo}>
              <div>
                <Label>{t.courseType}</Label>
                <select
                  value={form.course_type}
                  disabled={isEdit}
                  onChange={(e) => setField("course_type", e.target.value)}
                  style={input}
                >
                  <option value="external">{t.external}</option>
                  <option value="internal">{t.internal}</option>
                </select>
              </div>

              <Field
                label={t.category}
                value={form.category}
                onChange={(v) => setField("category", v)}
              />

              <Field
                label={t.titleUa}
                value={form.title_ua}
                onChange={(v) => setField("title_ua", v)}
              />

              <Field
                label={t.titleEn}
                value={form.title_en}
                onChange={(v) => setField("title_en", v)}
              />

              <TextArea
                label={t.descUa}
                value={form.description_ua}
                onChange={(v) => setField("description_ua", v)}
              />

              <TextArea
                label={t.descEn}
                value={form.description_en}
                onChange={(v) => setField("description_en", v)}
              />

              <Field
                label={t.tags}
                value={form.tags}
                onChange={(v) => setField("tags", v)}
              />

              <Field
                label={t.duration}
                value={form.durationText}
                onChange={(v) => setField("durationText", v)}
              />

              <Field
                label={t.price}
                type="number"
                value={form.price}
                onChange={(v) => setField("price", v)}
              />

              <Field
                label={t.speaker}
                value={form.speaker}
                onChange={(v) => setField("speaker", v)}
              />

              <Field
                label={t.image}
                value={form.image}
                onChange={(v) => setField("image", v)}
              />

              <Field
                label={t.link}
                value={form.link}
                onChange={(v) => setField("link", v)}
              />
            </div>

            <label style={checkRow}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setField("isPublished", e.target.checked)}
              />
              {t.published}
            </label>
          </>
        ) : (
          <>
            <div style={note}>
              {form.course_type === "external" ? t.externalInfo : t.internalInfo}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {form.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} style={chapterBox}>
                  <div style={chapterTop}>
                    <strong>
                      {t.chapter} {chapterIndex + 1}
                    </strong>

                    <button
                      type="button"
                      onClick={() => removeChapter(chapterIndex)}
                      style={smallDanger}
                    >
                      {t.remove}
                    </button>
                  </div>

                  <div style={gridTwo}>
                    <Field
                      label={t.chapterTitleUa}
                      value={chapter.title_ua}
                      onChange={(v) =>
                        setChapter(chapterIndex, "title_ua", v)
                      }
                    />

                    <Field
                      label={t.chapterTitleEn}
                      value={chapter.title_en}
                      onChange={(v) =>
                        setChapter(chapterIndex, "title_en", v)
                      }
                    />

                    <TextArea
                      label={t.chapterTextUa}
                      value={chapter.description_ua}
                      onChange={(v) =>
                        setChapter(chapterIndex, "description_ua", v)
                      }
                    />

                    <TextArea
                      label={t.chapterTextEn}
                      value={chapter.description_en}
                      onChange={(v) =>
                        setChapter(chapterIndex, "description_en", v)
                      }
                    />

                    <div style={{ gridColumn: "1 / -1" }}>
                      <Label>{t.extraLinks}</Label>

                      <div style={{ display: "grid", gap: 8 }}>
                        {(chapter.embeddings || [""]).map((url, embeddingIndex) => (
                          <div key={embeddingIndex} style={extraRow}>
                            <input
                              value={url}
                              placeholder={t.extraPlaceholder}
                              onChange={(e) =>
                                setEmbedding(
                                  chapterIndex,
                                  embeddingIndex,
                                  e.target.value
                                )
                              }
                              style={input}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeEmbedding(chapterIndex, embeddingIndex)
                              }
                              style={smallDanger}
                              title={t.removeExtra}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addEmbedding(chapterIndex)}
                        style={addExtraBtn}
                      >
                        {t.addExtra}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addChapter} style={addBtn}>
                {t.addChapter}
              </button>
            </div>
          </>
        )}

        <div style={bottomRow}>
          <button type="submit" disabled={saving} style={saveBtn}>
            {saving ? t.saving : t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

function Label({ children }) {
  return <div style={label}>{children}</div>;
}

function Field({ label: text, value, onChange, type = "text" }) {
  return (
    <div>
      <Label>{text}</Label>
      <input
        value={value ?? ""}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function TextArea({ label: text, value, onChange }) {
  return (
    <div>
      <Label>{text}</Label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={textarea}
      />
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
};

const pageTitle = {
  margin: 0,
  color: "#fff",
  fontSize: 20,
  fontWeight: 800,
};

const panel = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: 20,
  padding: 22,
};

const tabs = {
  display: "flex",
  gap: 8,
  marginBottom: 18,
};

function tab(active) {
  return {
    height: 34,
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(8,41,71,0.18)",
    background: active ? "#082947" : "#EEF3F8",
    color: active ? "#fff" : "#20324A",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const label = {
  color: "#20324A",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
};

const input = {
  width: "100%",
  height: 38,
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.18)",
  padding: "0 14px",
  outline: "none",
  fontSize: 12,
  color: "#20324A",
  background: "#fff",
};

const textarea = {
  ...input,
  height: 120,
  borderRadius: 14,
  padding: 12,
  resize: "vertical",
};

const checkRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 18,
  color: "#20324A",
  fontSize: 13,
  fontWeight: 700,
};

const note = {
  background: "#EEF3F8",
  color: "#20324A",
  borderRadius: 14,
  padding: 14,
  fontSize: 12,
  lineHeight: 1.6,
  marginBottom: 16,
};

const chapterBox = {
  background: "#F7F9FC",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 18,
  padding: 16,
};

const chapterTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
  color: "#20324A",
  fontSize: 13,
};

const extraRow = {
  display: "grid",
  gridTemplateColumns: "1fr 34px",
  gap: 8,
  alignItems: "center",
};

const bottomRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 22,
};

const saveBtn = {
  minWidth: 140,
  height: 38,
  borderRadius: 999,
  border: "none",
  background: "#B3131A",
  color: "#fff",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const addBtn = {
  width: 150,
  height: 34,
  borderRadius: 999,
  border: "none",
  background: "#082947",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const addExtraBtn = {
  marginTop: 10,
  minWidth: 160,
  height: 32,
  borderRadius: 999,
  border: "none",
  background: "#082947",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};

const ghostBtn = {
  height: 32,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "transparent",
  color: "#fff",
  fontSize: 12,
  cursor: "pointer",
};

const smallDanger = {
  height: 28,
  minWidth: 28,
  borderRadius: 999,
  border: "none",
  background: "#B3131A",
  color: "#fff",
  fontSize: 14,
  padding: "0 10px",
  cursor: "pointer",
};