import { useEffect, useState } from "react";
import { me } from "../service/auth";  // ← правильний шлях

export default function useSession() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) { setChecking(false); return; }

    me()
      .then((u) => {
        const resolved = u?.user ?? u ?? null;
        setUser(resolved);
        if (resolved) localStorage.setItem("finu_user", JSON.stringify(resolved));
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("finu_user");
      })
      .finally(() => setChecking(false));
  }, []);

  return { user, checking };
}
