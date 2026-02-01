import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { lang } = useLang();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const t = useMemo(() => {
    const ua = lang === "ua";
    return {
      title: ua ? "Курси" : "Courses",
      add: ua ? "+ Додати курс" : "+ Add course",
      empty: ua ? "Курсів ще немає" : "No courses yet",
      edit: ua ? "Редагувати" : "Edit",
      reload: ua ? "Оновити" : "Reload",
      hint: ua
        ? "Тут відображаються курси з бекенду. Можна створювати та редагувати."
        : "Courses are loaded from backend. You can create and edit them.",
      loadFail: ua
        ? "Не вдалося завантажити курси з бекенду."
        : "Failed to load courses from backend.",
      id: "ID",
      titleCol: ua ? "Назва" : "Title",
      status: ua ? "Статус" : "Status",
      action: ua ? "Дія" : "Action",
      published: ua ? "опубліковано" : "published",
      draft: ua ? "чернетка" : "draft",
      archived: ua ? "архів" : "archived",
    };
  }, [lang]);

  const titleOf = useCallback(
    (c) => {
      if (!c) return "";
      return lang === "ua"
        ? c.title_ua || c.title || ""
        : c.title_en || c.title || "";
    },
    [lang]
  );

  const statusOf = useCallback(
    (c) => {
      if (c?.isArchived) return t.archived;
      if (c?.isPublished) return t.published;
      return t.draft;
    },
    [t.archived, t.published, t.draft]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await client.get("/courses/", {
        params: { page: 1, page_size: 50 },
      });

      const list = res?.data?.courses || res?.data?.items || res?.data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setItems([]);
      setErr(t.loadFail);
    } finally {
      setLoading(false);
    }
  }, [t.loadFail]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.hint}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          >
            {t.reload}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/courses/create")}
            className="h-10 px-4 rounded-lg bg-[#2E5D8C] text-white hover:opacity-95"
          >
            {t.add}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-slate-600">Loading...</div>
        ) : err ? (
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-700">
            {err}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-slate-800">{t.empty}</div>
            <div className="mt-1 text-sm text-slate-500">
              Натисни “{t.add}”, щоб створити перший курс.
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <div className="col-span-1">{t.id}</div>
              <div className="col-span-7">{t.titleCol}</div>
              <div className="col-span-2">{t.status}</div>
              <div className="col-span-2 text-right">{t.action}</div>
            </div>

            {items.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 border-b last:border-b-0 border-slate-100"
              >
                <div className="col-span-1 text-sm text-slate-600">{c.id}</div>

                <div className="col-span-7">
                  <div className="text-sm font-medium text-slate-900">
                    {titleOf(c) || "—"}
                  </div>
                  <div className="text-xs text-slate-500">{c.category || ""}</div>
                </div>

                <div className="col-span-2 text-sm text-slate-700">
                  {statusOf(c)}
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/courses/${c.id}`)}
                    className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  >
                    {t.edit}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}