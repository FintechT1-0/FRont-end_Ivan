const KEY_TOKEN = "finu.access";
const KEY_EXP   = "finu.exp"; // ms timestamp

export function setToken(token, ttlSeconds = 24 * 60 * 60) {
  const expMs = Date.now() + ttlSeconds * 1000;
  localStorage.setItem(KEY_TOKEN, token);
  localStorage.setItem(KEY_EXP, String(expMs));
}

export function getToken() {
  const t = localStorage.getItem(KEY_TOKEN);
  const exp = Number(localStorage.getItem(KEY_EXP) || 0);
  if (!t || !exp) return null;
  if (Date.now() >= exp) return null;
  return t;
}

export function isExpired() {
  const exp = Number(localStorage.getItem(KEY_EXP) || 0);
  return !exp || Date.now() >= exp;
}

export function clearToken() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_EXP);
  localStorage.removeItem("finu_user");
}
