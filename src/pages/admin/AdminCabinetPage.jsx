import { useMemo } from "react";
import { useLang } from "../../context/LanguageContext";

function StatCard({ title, value = "—", hint }) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <div className="text-sm text-black/60">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-black">
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-black/45">{hint}</div>}
    </div>
  );
}

function Panel({ title, right, children, footer }) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-black">{title}</div>
        {right || null}
      </div>
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-3 text-sm text-black/60">{footer}</div>}
    </div>
  );
}

export default function AdminCabinetPage() {
  const { lang } = useLang();
  const ua = lang === "ua";

  const t = useMemo(
    () => ({
      title: ua ? "Панель адміністратора" : "Admin Dashboard",
      placeholder: ua
        ? "Дані з’являться у фінальній версії продукту."
        : "Data will appear in the final version of the product.",
      totalUsers: ua ? "Усього користувачів" : "Total users",
      activeUsers: ua ? "Активні користувачі" : "Active users",
      totalCourses: ua ? "Усього курсів" : "Total courses",
      userActivity: ua ? "Активність користувачів" : "User activity",
      recent: ua ? "Останні події" : "Recent activity",
      day: ua ? "День" : "Day",
      week: ua ? "Тиждень" : "Week",
      month: ua ? "Місяць" : "Month",
    }),
    [lang, ua]
  );

  return (
    <div>
      <h1 className="text-5xl font-medium text-black">{t.title}</h1>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <StatCard title={t.totalUsers} hint={t.placeholder} />
        <StatCard title={t.activeUsers} hint={t.placeholder} />
        <StatCard title={t.totalCourses} hint={t.placeholder} />
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <Panel
          title={t.userActivity}
          right={
            <select className="h-9 rounded-md border border-black/20 px-3 text-sm bg-white">
              <option>{t.day}</option>
              <option>{t.week}</option>
              <option>{t.month}</option>
            </select>
          }
          footer={t.placeholder}
        >
          <div className="h-[220px] rounded-lg bg-black/5" />
        </Panel>

        <Panel title={t.recent} footer={t.placeholder}>
          <div className="space-y-3">
            <div className="h-10 rounded bg-black/5" />
            <div className="h-10 rounded bg-black/5" />
            <div className="h-10 rounded bg-black/5" />
          </div>
        </Panel>
      </div>
    </div>
  );
}