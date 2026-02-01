import { useLang } from "../../context/LanguageContext";

export default function AdminActivityPage() {
  const { lang } = useLang();
  const text =
    lang === "en"
      ? "Activity / logs will appear in the final version of the product."
      : "Активність / логи з’являться у фінальній версії продукту.";

  return (
    <div>
      <h1 className="text-5xl font-medium">Activity / Logs</h1>
      <div className="mt-6 bg-white rounded-md border border-black/10 p-6 text-black/70">
        {text}
      </div>
    </div>
  );
}