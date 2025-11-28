const ACCESS_KEY = "finu.access";
const EXP_KEY = "finu.exp";

export function setToken(token, expMs) {
  const exp = expMs ? expMs : Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem(ACCESS_KEY, token);
  localStorage.setItem(EXP_KEY, String(exp));
}

export function getToken() {
  const t = localStorage.getItem(ACCESS_KEY);
  const exp = Number(localStorage.getItem(EXP_KEY) || 0);
  if (!t) return null;
  if (!exp || Date.now() > exp) {
    clearToken();
    return null;
  }
  return t;
}

export function isExpired() {
  const exp = Number(localStorage.getItem(EXP_KEY) || 0);
  return !exp || Date.now() > exp;
}

export function clearToken() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(EXP_KEY);
}
