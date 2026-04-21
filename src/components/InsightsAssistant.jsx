import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { promptAssistant } from "../api/assistant";
import { useLang } from "../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

function normalizeAssistantText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$2")
    .replace(/\[(https?:\/\/[^\]]+)\]/g, "$1")
    .trim();
}

function splitIntoBlocks(text) {
  return normalizeAssistantText(text)
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderTextWithLinks(text) {
  const normalized = normalizeAssistantText(text);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = normalized.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#FFFFFF",
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {part}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function InsightsAssistant({ open, onClose }) {
  const { lang } = useLang();
  const isAuthorized = Boolean(localStorage.getItem("token"));

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "AI-АСИСТЕНТ ІНСАЙТІВ" : "AI INSIGHTS ASSISTANT",
      subtitle:
        lang === "ua"
          ? "Опиши тему або запит. Асистент підбере 3 найбільш змістовні інсайти."
          : "Describe a topic or query. The assistant will select 3 most meaningful insights.",
      placeholder:
        lang === "ua"
          ? "Наприклад: криптовалюта, цифрові активи, регулювання, штучний інтелект у фінансах..."
          : "For example: cryptocurrency, digital assets, regulation, AI in finance...",
      send: lang === "ua" ? "Отримати підбірку" : "Get recommendations",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      close: lang === "ua" ? "Закрити" : "Close",
      guestTitle:
        lang === "ua"
          ? "Функція доступна лише зареєстрованим користувачам"
          : "This feature is available only for registered users",
      guestText:
        lang === "ua"
          ? "Увійди або зареєструйся, щоб користуватись AI-асистентом, отримувати персональні підбірки та зберігати історію."
          : "Sign in or register to use the AI assistant, get personalized recommendations, and save your history.",
      login: lang === "ua" ? "Увійти" : "Sign in",
      register: lang === "ua" ? "Зареєструватися" : "Sign up",
      error:
        lang === "ua"
          ? "Не вдалося отримати відповідь асистента"
          : "Failed to get assistant response",
      emptyPrompt:
        lang === "ua"
          ? "Введи запит для асистента"
          : "Enter a prompt for the assistant",
      resultTitle: lang === "ua" ? "Рекомендація" : "Recommendation",
    };
  }, [lang]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setErrorText(t.emptyPrompt);
      setResponseText("");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");
      setResponseText("");

      const data = await promptAssistant({
        prompt: cleanPrompt,
        lang,
      });

      setResponseText(data?.response || "");
    } catch (error) {
      setErrorText(getBackendError(error, t.error));
    } finally {
      setLoading(false);
    }
  }

  const responseBlocks = splitIntoBlocks(responseText);

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-[28px] overflow-hidden bg-[#082947] text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] border border-white/10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <div className="text-lg md:text-xl font-semibold">{t.title}</div>
            <div className="text-sm text-white/70 mt-1">{t.subtitle}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!isAuthorized ? (
            <div
              className="rounded-[22px] p-6"
              style={{
                background:
                  "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              <div className="text-lg font-semibold">{t.guestTitle}</div>
              <p className="mt-3 text-white/85 leading-7">{t.guestText}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white"
                  style={{
                    background: "#B3131A",
                    boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                  }}
                >
                  {t.login}
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/15"
                >
                  {t.register}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={t.placeholder}
                  className="w-full min-h-[140px] rounded-[22px] bg-white/10 text-white placeholder:text-white/55 outline-none p-5 border border-white/10 resize-none"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-full text-sm font-medium text-white"
                    style={{
                      background: "#B3131A",
                      boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                      opacity: loading ? 0.75 : 1,
                    }}
                  >
                    {loading ? t.loading : t.send}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/15"
                  >
                    {t.close}
                  </button>
                </div>
              </form>

              {errorText ? (
                <div className="rounded-[18px] bg-[#B3131A]/20 border border-[#B3131A]/40 p-4 text-sm text-white">
                  {errorText}
                </div>
              ) : null}

              {responseText ? (
                <div
                  className="rounded-[22px] p-5"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                  }}
                >
                  <div className="text-base font-semibold mb-3">{t.resultTitle}</div>

                  <div className="grid gap-4 text-sm leading-7 text-white/90">
                    {responseBlocks.map((block, index) => (
                      <div
                        key={`${block}-${index}`}
                        className="rounded-[16px] bg-white/5 p-4 border border-white/8"
                      >
                        {renderTextWithLinks(block)}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}