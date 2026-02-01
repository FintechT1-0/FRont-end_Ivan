import { useLang } from "../../context/LanguageContext";

export default function AdminUsersPage() {
  const { lang } = useLang();
  const text =
    lang === "en"
      ? "Users management will appear in the final version of the product."
      : "Керування користувачами з’явиться у фінальній версії продукту.";

  return (
    <div>
      <h1 className="text-5xl font-medium">Users</h1>
      <div className="mt-6 bg-white rounded-md border border-black/10 p-6 text-black/70">
        {text}
      </div>
    </div>
  );
}