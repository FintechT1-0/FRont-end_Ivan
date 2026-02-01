import { useMemo, useState } from "react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";

function normalizeErr(e) {
  const status = e?.response?.status;
  const msg =
    e?.response?.data?.detail ||
    e?.response?.data?.message ||
    e?.message ||
    "Request failed";
  return { status, msg };
}

export default function AdminSettingsPage() {
  const { lang } = useLang();
  const { user, refreshMe } = useAuth();

  const t = useMemo(() => {
    return {
      title: "Settings",
      profile: lang === "en" ? "Profile" : "Профіль",
      security: lang === "en" ? "Security" : "Безпека",
      name: lang === "en" ? "Name" : "Імʼя",
      surname: lang === "en" ? "Surname" : "Прізвище",
      email: lang === "en" ? "Email" : "Пошта",
      save: lang === "en" ? "Save changes" : "Зберегти зміни",
      curPass: lang === "en" ? "Current password" : "Поточний пароль",
      newPass: lang === "en" ? "New password" : "Новий пароль",
      repeat: lang === "en" ? "Repeat new password" : "Повторіть новий пароль",
      change: lang === "en" ? "Change password" : "Змінити пароль",
      finalMsg:
        lang === "en"
          ? "This section will be available in the final version of the product."
          : "Цей розділ буде доступний у фінальній версії продукту.",
    };
  }, [lang]);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
  });

  const [pass, setPass] = useState({
    currentPassword: "",
    newPassword: "",
    newPassword2: "",
  });

  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setInfo("");
    setErr("");
    setLoadingProfile(true);

    try {
      await client.patch("/auth/me", {
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
      });
      await refreshMe();
      setInfo("OK");
    } catch (e2) {
      const { status, msg } = normalizeErr(e2);
      if ([404, 405, 501].includes(status)) setErr(t.finalMsg);
      else setErr(msg);
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setInfo("");
    setErr("");

    if (!pass.newPassword || pass.newPassword !== pass.newPassword2) {
      setErr(lang === "en" ? "Passwords do not match" : "Паролі не співпадають");
      return;
    }

    setLoadingPass(true);
    try {
      await client.patch("/auth/password", {
        current_password: pass.currentPassword,
        new_password: pass.newPassword,
      });
      setInfo("OK");
      setPass({ currentPassword: "", newPassword: "", newPassword2: "" });
    } catch (e2) {
      const { status, msg } = normalizeErr(e2);
      if ([404, 405, 501].includes(status)) setErr(t.finalMsg);
      else setErr(msg);
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div>
      <h1 className="text-5xl font-medium">{t.title}</h1>

      {(info || err) && (
        <div className="mt-4">
          {info ? (
            <div className="text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
              Saved
            </div>
          ) : null}
          {err ? (
            <div className="mt-2 text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              {err}
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-6">
        <form onSubmit={saveProfile} className="bg-white rounded-md border border-black/10 p-6">
          <div className="text-2xl font-medium">{t.profile}</div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">{t.name}</div>
              <input
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <div className="text-sm font-medium">{t.surname}</div>
              <input
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={profile.surname}
                onChange={(e) => setProfile((p) => ({ ...p, surname: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium">{t.email}</div>
              <input
                type="email"
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingProfile}
            className="mt-6 h-11 px-6 rounded-md bg-[#2E5D8C] text-white font-medium hover:opacity-95 transition disabled:opacity-60"
          >
            {loadingProfile ? "Saving..." : t.save}
          </button>
        </form>

        <form onSubmit={changePassword} className="bg-white rounded-md border border-black/10 p-6">
          <div className="text-2xl font-medium">{t.security}</div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="text-sm font-medium">{t.curPass}</div>
              <input
                type="password"
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={pass.currentPassword}
                onChange={(e) => setPass((p) => ({ ...p, currentPassword: e.target.value }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium">{t.newPass}</div>
              <input
                type="password"
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={pass.newPassword}
                onChange={(e) => setPass((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium">{t.repeat}</div>
              <input
                type="password"
                className="mt-2 w-full h-10 rounded-md border border-black/20 px-3 outline-none"
                value={pass.newPassword2}
                onChange={(e) => setPass((p) => ({ ...p, newPassword2: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingPass}
            className="mt-6 h-11 px-6 rounded-md bg-[#2E5D8C] text-white font-medium hover:opacity-95 transition disabled:opacity-60"
          >
            {loadingPass ? "Saving..." : t.change}
          </button>
        </form>
      </div>

      <div className="mt-6 text-xs text-black/50">
        admin_password не змінюється. Це фіксований ключ, який використовується лише при /auth/register.
      </div>
    </div>
  );
}