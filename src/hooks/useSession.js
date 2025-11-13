import { useEffect, useState } from "react";
import { me } from "../service/auth";

export default function useSession() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) { setChecking(false); return; }

    me()
      .then((u) => {
        setUser(u);
        if (u) localStorage.setItem("finu_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("finu_user");
      })
      .finally(() => setChecking(false));
  }, []);

  return { user, checking };
}
