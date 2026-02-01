import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

function Tile({ label, children, className = "" }) {
  return (
    <div className={`rounded-[48px] bg-white/10 overflow-hidden ${className}`}>
      <div className="px-7 pt-6">
        <span className="inline-block bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {label}
        </span>
      </div>
      <div className="p-7 text-white">{children}</div>
    </div>
  );
}

function pickImage(item) {
  return item?.image || item?.thumbnail || null;
}

export default function UserCabinetPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { lang } = useLang();

  const [latestCourse, setLatestCourse] = useState(null);
  const [latestInsight, setLatestInsight] = useState(null);
  const [lastVisitedCourse, setLastVisitedCourse] = useState(null);

  const t = useMemo(() => {
    const ua = lang !== "en";
    return {
      progress: ua ? "Прогрес навчання" : "Learning progress",
      recommended: ua ? "Рекомендований курс" : "Recommended course",
      lastVisited: ua ? "Останній відвідуваний курс" : "Last visited course",
      latestInsight: ua ? "Найновіший інсайт" : "Latest insight",
      emptyCourse: ua ? "Поки що немає курсів" : "No courses yet",
      emptyInsight: ua ? "Поки що немає інсайтів" : "No insights yet",
      view: ua ? "Переглянути" : "View",
      read: ua ? "Читати" : "Read",
      progressText: ua
        ? "Прогрес буде доступний у фінальній версії продукту."
        : "Progress will be available in the final version of the product.",
    };
  }, [lang]);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    async function load() {
      try {
        const res = await client.get("/courses/", {
          headers,
          params: { page: 1, page_size: 20, isPublished: true },
        });
        const list = res?.data?.courses || [];
        const newest = list[0] || null;
        setLatestCourse(newest);

        const lastId = Number(localStorage.getItem("lastCourseId") || "");
        if (lastId) {
          try {
            const one = await client.get(`/courses/${lastId}`, { headers });
            setLastVisitedCourse(one?.data || null);
          } catch {
            setLastVisitedCourse(null);
          }
        } else {
          setLastVisitedCourse(null);
        }
      } catch {
        setLatestCourse(null);
        setLastVisitedCourse(null);
      }

      try {
        const endpoint = lang === "en" ? "/insights/en" : "/insights/ua";
        const res = await client.get(endpoint, { headers });
        const list = res?.data || [];
        setLatestInsight(list?.[0] || null);
      } catch {
        setLatestInsight(null);
      }
    }

    load();
  }, [token, lang]);

  const courseTitle = (c) => (lang === "en" ? c?.title_en : c?.title_ua);
  const courseDesc = (c) => (lang === "en" ? c?.description_en : c?.description_ua);

  const openCourse = (c) => {
    if (!c?.id) return;
    localStorage.setItem("lastCourseId", String(c.id));
    navigate(`/courses/${c.id}`);
  };

  const openInsight = (item) => {
    if (!item) return;
    navigate("/insights/view", { state: { item } });
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Tile label={t.progress} className="lg:col-span-4 min-h-[520px]">
          <div className="text-lg font-medium">0%</div>
          <div className="mt-3 text-white/80 text-sm leading-relaxed">
            {t.progressText}
          </div>
        </Tile>

        <Tile label={t.recommended} className="lg:col-span-5 min-h-[520px]">
          {latestCourse ? (
            <div className="h-full flex flex-col">
              <div className="text-xl font-semibold line-clamp-2">
                {courseTitle(latestCourse)}
              </div>
              <div className="mt-3 text-white/80 text-sm leading-relaxed line-clamp-4">
                {courseDesc(latestCourse)}
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  {latestCourse.durationText || ""}
                </div>
                <button
                  type="button"
                  onClick={() => openCourse(latestCourse)}
                  className="bg-[#A94F5E] px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
                >
                  {t.view}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white/70">{t.emptyCourse}</div>
          )}
        </Tile>

        <div className="lg:col-span-3 flex flex-col gap-8">
          <Tile label={t.lastVisited} className="min-h-[248px]">
            {lastVisitedCourse ? (
              <div className="h-full flex flex-col">
                <div className="text-lg font-semibold line-clamp-2">
                  {courseTitle(lastVisitedCourse)}
                </div>
                <div className="mt-3 text-white/80 text-sm line-clamp-3">
                  {courseDesc(lastVisitedCourse)}
                </div>
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => openCourse(lastVisitedCourse)}
                    className="bg-white/15 px-5 py-2 rounded-full text-sm hover:bg-white/20 transition"
                  >
                    {t.view}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-white/70">{t.emptyCourse}</div>
            )}
          </Tile>

          <Tile label={t.latestInsight} className="min-h-[248px]">
            {latestInsight ? (
              <div className="h-full flex flex-col">
                {pickImage(latestInsight) ? (
                  <div className="bg-white rounded-[24px] h-[120px] overflow-hidden">
                    <img
                      src={pickImage(latestInsight)}
                      alt={latestInsight.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : null}

                <div className="mt-4 text-base font-semibold line-clamp-2">
                  {latestInsight.title}
                </div>

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => openInsight(latestInsight)}
                    className="bg-white/15 px-5 py-2 rounded-full text-sm hover:bg-white/20 transition"
                  >
                    {t.read}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-white/70">{t.emptyInsight}</div>
            )}
          </Tile>
        </div>
      </div>
    </div>
  );
}