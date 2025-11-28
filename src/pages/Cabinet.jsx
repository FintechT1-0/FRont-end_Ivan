import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "../service/auth";

export default function Cabinet() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(localStorage.getItem("finu.avatar") || "");
  const fileRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await me();
        const u = res?.user ?? res;
        const nm = [u?.name, u?.surname].filter(Boolean).join(" ").trim();
        if (alive) setFullName(nm || "Ім'я");
      } catch {
        if (alive) setFullName("Ім'я");
      }
    })();
    return () => { alive = false; };
  }, []);

  const openFile = () => fileRef.current?.click();
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result || "");
      setAvatar(url);
      localStorage.setItem("finu.avatar", url);
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen w-screen bg-[#e4e1dc] relative overflow-x-hidden">
      <aside
        className={`fixed left-0 top-0 h-full w-[240px] bg-[#d9d9d9] p-5 transition-transform duration-200 z-20 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute right-4 top-4 text-black/70"
          aria-label="collapse"
          title="Згорнути меню"
        >
          ×
        </button>

        <div className="w-9 h-9 rounded-[12px] bg-[#eceae6]" />

        <div className="mt-6 space-y-5">
          <div className="h-[3px] w-14 rounded-full bg-white" />
          {/* 2-га смужка = кнопка Перейти на головну */}
          <button
            onClick={() => navigate("/")}
            className="block h-[3px] w-16 rounded-full bg-white hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer -my-1 py-2"
            aria-label="На головну"
            title="Головна сторінка"
          />
          <div className="h-[3px] w-12 rounded-full bg-white" />
          <div className="h-[3px] w-14 rounded-full bg-white" />
        </div>

        <div className="absolute left-5 bottom-16 space-y-4">
          <div className="h-[3px] w-14 rounded-full bg-white" />
          <div className="h-[3px] w-12 rounded-full bg-white" />
          <div className="h-[3px] w-16 rounded-full bg-white" />
        </div>

        <button
          onClick={openFile}
          className="absolute left-5 bottom-5 flex items-center gap-3"
          aria-label="open profile"
          title="Відкрити профіль / змінити аватар"
        >
          <span
            className="inline-block w-7 h-7 rounded-full bg-[#a6a3a3] ring-1 ring-white/60 overflow-hidden"
            style={
              avatar
                ? {
                    backgroundImage: `url(${avatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
          <span className="inline-block h-[3px] w-16 rounded-full bg-[#d0ceca]" />
        </button>
      </aside>

      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed left-5 bottom-6 z-10 flex items-center gap-3"
          aria-label="expand"
          title="Розгорнути меню"
        >
          <span
            className="inline-block w-6 h-6 rounded-full bg-[#a6a3a3]"
            style={
              avatar
                ? {
                    backgroundImage: `url(${avatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
          <span className="inline-block h-[3px] w-16 rounded-full bg-[#d0ceca]" />
        </button>
      )}

      <input ref={fileRef} onChange={onFile} type="file" accept="image/*" className="hidden" />

      <main
        className={`min-h-screen w-full p-8 transition-all duration-200 ${
          menuOpen ? "pl-[260px]" : "pl-12"
        }`}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center gap-6">
            <button
              onClick={openFile}
              className="relative w-16 h-16 rounded-full bg-[#a6a3a3] overflow-hidden ring-2 ring-white/60"
              aria-label="change avatar"
              title="Змінити фото"
              style={
                avatar
                  ? {
                      backgroundImage: `url(${avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
            <div className="flex flex-col">
              <span className="inline-block rounded-md bg-black/90 px-3 py-1 text-white text-sm">
                {fullName || "Ім'я"}
              </span>
              <span className="mt-2 h-[3px] w-48 rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[1.05fr,1.25fr,0.9fr] gap-8">
            <div className="relative rounded-[28px] bg-[#dcdcdc] h-[340px]">
              <div className="absolute -top-3 left-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">
                Прогрес навчання
              </div>
            </div>

            <div className="relative rounded-[28px] bg-[#dcdcdc] h-[250px]">
              <div className="absolute -top-3 left-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">
                Рекомендовані курси
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="relative rounded-[28px] bg-[#dcdcdc] h-[120px]">
                <div className="absolute -top-3 right-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">
                  Остання активність
                </div>
              </div>
              <div className="rounded-[28px] bg-[#dcdcdc] h-[120px]" />
            </div>
          </div>

          <div className="mt-8 w-[72%] rounded-[28px] bg-[#dcdcdc] h-[82px]" />
        </div>
      </main>
    </div>
  );
}
