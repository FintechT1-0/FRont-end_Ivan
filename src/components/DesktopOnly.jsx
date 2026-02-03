import { useEffect, useMemo, useState } from "react";
import { useLang } from "../context/LanguageContext";

export default function DesktopOnly({ children, minWidth = 1024 }) {
  const { lang } = useLang();
  const ua = lang === "ua";

  const t = useMemo(
    () => ({
      title: ua ? "Мобільна версія недоступна" : "Mobile version is not available",
      text: ua
        ? "Ця версія сайту буде доступна в подальших оновленнях. Перейдіть на десктоп-версію."
        : "This version will be available in future updates. Please use the desktop version.",
      hint: ua
        ? "Порада: відкрий сайт на комп’ютері або збільши ширину вікна браузера."
        : "Tip: open the website on a computer or increase the browser window width.",
    }),
    [ua]
  );

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= minWidth;
  });

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= minWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [minWidth]);

  if (isDesktop) return children;

  return (
    <div className="min-h-screen w-full bg-[#0D3C6A] flex items-center justify-center px-6">
      <div className="max-w-[520px] w-full bg-white/10 border border-white/15 rounded-2xl p-8 text-white">
        <div className="text-2xl font-semibold">{t.title}</div>
        <div className="mt-4 text-white/85 leading-relaxed">{t.text}</div>
        <div className="mt-6 text-sm text-white/70">{t.hint}</div>

        <div className="mt-8 pt-6 border-t border-white/15 text-xs text-white/60">
          FinTech UniVerse 1.0
        </div>
      </div>
    </div>
  );
}