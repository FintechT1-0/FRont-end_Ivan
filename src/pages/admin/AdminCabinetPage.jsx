import { useMemo } from "react";
import { useLang } from "../../context/LanguageContext";

function StatCard({ title, value = "—", hint }) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function Panel({ title, right, children, footer }) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xl font-semibold text-slate-900">{title}</div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
      {footer ? <div className="mt-3 text-sm text-slate-600">{footer}</div> : null}
    </div>
  );
}

export default function AdminCabinetPage() {
  const { lang } = useLang();

  const t = useMemo(() => {
    const ua = lang === "ua";
    return {
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
    };
  }, [lang]);

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl md:text-5xl font-medium">{t.title}</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t.totalUsers} hint={t.placeholder} />
        <StatCard title={t.activeUsers} hint={t.placeholder} />
        <StatCard title={t.totalCourses} hint={t.placeholder} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title={t.userActivity}
          right={
            <select className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
              <option>{t.day}</option>
              <option>{t.week}</option>
              <option>{t.month}</option>
            </select>
          }
          footer={t.placeholder}
        >
          <div className="h-[220px] rounded-lg bg-slate-100" />
        </Panel>

        <Panel title={t.recent} footer={t.placeholder}>
          <div className="space-y-3">
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
          </div>
        </Panel>
      </div>
    </div>
  );
}