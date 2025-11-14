import { useEffect, useState } from "react";
import { me } from "../service/auth";
import { isExpired, clearToken } from "../utils/token";

export default function useSession() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isExpired()) {
      clearToken();
      setChecking(false);
      return;
    }
    me()
      .then((u) => {
        setUser(u);
        if (u) localStorage.setItem("finu_user", JSON.stringify(u));
      })
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  return { user, checking };
}
