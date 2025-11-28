import React, { useEffect, useRef, useState } from "react";
import { me } from "../service/auth";

export default function Cabinet() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(localStorage.getItem("finu.avatar") || "");
  const fileRef = useRef(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await me();
        const u = res?.user ?? res;
        const nm = [u?.name, u?.surname].filter(Boolean).join(" ").trim();
        if (ok) setFullName(nm || "User");
      } catch {
        if (ok) setFullName("User");
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  function openFile() {
    fileRef.current?.click();
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result || "");
      setAvatar(url);
      localStorage.setItem("finu.avatar", url);
    };
    r.readAsDataURL(f);
  }

  return (
    <div className="min-h-screen w-screen bg-[#e4e1dc] overflow-x-hidden">
      <aside
        className={`fixed top-0 left-0 h-full w-[240px] bg-[#d9d9d9] p-6 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="absolute right-5 top-4 text-black/70 text-xl" aria-label="close">×</button>
        <div className="w-12 h-12 rounded-[14px] bg-[#eceae6]" />
        <div className="mt-8 space-y-5">
          <div className="h-[4px] w-24 rounded-full bg-white" />
          <div className="h-[4px] w-28 rounded-full bg-white" />
          <div className="h-[4px] w-20 rounded-full bg-white" />
          <div className="h-[4px] w-24 rounded-full bg-white" />
        </div>
        <div className="absolute left-6 bottom-24 space-y-4">
          <div className="h-[4px] w-24 rounded-full bg-white" />
          <div className="h-[4px] w-20 rounded-full bg-white" />
          <div className="h-[4px] w-28 rounded-full bg-white" />
        </div>
        <button onClick={openFile} className="absolute left-6 bottom-6 flex items-center gap-3" aria-label="profile">
          <span
            className="inline-block w-7 h-7 rounded-full bg-[#a6a3a3] ring-1 ring-white/60 overflow-hidden"
            style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          />
          <span className="inline-block h-[4px] w-24 rounded-full bg-[#d0ceca]" />
        </button>
      </aside>

      {!open && (
        <button onClick={() => setOpen(true)} className="fixed left-5 top-5 z-10 rounded-full bg-[#d9d9d9] px-3 py-1 text-sm">Меню</button>
      )}

      <input ref={fileRef} onChange={onFile} type="file" accept="image/*" className="hidden" />

      <main className={`min-h-screen transition-all ${open ? "pl-[260px]" : "pl-6"}`}>
        <div className="mx-auto max-w-[1080px] px-4 pt-6">
          <div className="flex items-center gap-5">
            <button
              onClick={openFile}
              className="w-24 h-24 rounded-full bg-[#a6a3a3] overflow-hidden ring-4 ring-white/70"
              aria-label="avatar"
              style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            />
            <div>
              <div className="inline-block rounded-md bg-black/90 px-4 py-1 text-white text-base">{fullName || "User"}</div>
              <div className="mt-2 h-[4px] w-48 rounded-full bg-white" />
            </div>
          </div>

          <section className="mt-6 grid grid-cols-12 gap-x-6 gap-y-3">
            <div className="relative col-span-3 rounded-[22px] bg-[#e6e8ec] h-[440px]">
              <div className="absolute -top-3 left-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">Прогрес навчання</div>
            </div>

            <div className="relative col-span-6 rounded-[22px] bg-[#e6e8ec] h-[200px]">
              <div className="absolute -top-3 left-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">Рекомендовані курси</div>
            </div>

            <div className="relative col-span-3 rounded-[22px] bg-[#e6e8ec] h-[200px]">
              <div className="absolute -top-3 right-4 rounded-md bg-black/90 px-3 py-1 text-white text-xs">Остання активність</div>
            </div>

            <div className="relative col-span-3 col-start-10 row-start-2 rounded-[22px] bg-[#e6e8ec] h-[180px]" />

            <div className="col-span-12 row-start-3">
              <div className="w-full rounded-[22px] bg-[#e6e8ec] h-12" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
