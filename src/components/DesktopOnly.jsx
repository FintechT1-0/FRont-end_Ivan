import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";

const DEFAULT_MIN_WIDTH = 768; // телефони < 768px

const TEXT = {
  ua: {
    title: "Мобільна версія недоступна",
    text: "Ця версія сайту буде доступна в подальших оновленнях. Перейдіть на десктоп-версію.",
    hint: "Порада: відкрий сайт на комп’ютері або збільши ширину вікна браузера.",
  },
  en: {
    title: "Mobile version is not available, yet",
    text: "This version will be available in future updates. Please use the desktop version.",
    hint: "Tip: open the website on a computer or increase the browser window width.",
  },
};

export default function DesktopOnly({ children, minWidth = DEFAULT_MIN_WIDTH }) {
  const { lang } = useLang();
  const t = lang === "ua" ? TEXT.ua : TEXT.en;

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= minWidth;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= minWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minWidth]);

  if (isDesktop) return children;

  return (
    <div className="min-h-screen w-full bg-[#0D3C6A] flex items-center justify-center px-6">
      <div className="max-w-[520px] w-full bg-white/10 border border-white/15 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-semibold">{t.title}</h1>

        <p className="mt-4 text-white/85 leading-relaxed">{t.text}</p>
        <p className="mt-6 text-sm text-white/70">{t.hint}</p>

        <div className="mt-8 pt-6 border-t border-white/15 text-xs text-white/60">
          FinTech UniVerse 1.0
        </div>
      </div>
    </div>
  );
}
