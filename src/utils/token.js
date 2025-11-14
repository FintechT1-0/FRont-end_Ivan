// src/utils/token.js

const KEY_ACCESS = 'finu.access';
const KEY_EXP    = 'finu.exp';

/** Зберегти токен і час життя (у секундах) */
export function setToken(token, expSeconds = 24 * 60 * 60) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + Number(expSeconds || 0);
    localStorage.setItem(KEY_ACCESS, token);
    localStorage.setItem(KEY_EXP, String(exp));
  } catch {}
}

/** true, якщо токен прострочений (або немає exp) */
export function isExpired() {
  try {
    const exp = Number(localStorage.getItem(KEY_EXP) || 0);
    if (!exp) return false; // якщо бек не дав exp — вважаємо дійсним до явного logout
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return false;
  }
}

/** Отримати токен; якщо прострочений — очистити й повернути null */
export function getToken() {
  try {
    const token = localStorage.getItem(KEY_ACCESS);
    if (!token) return null;
    if (isExpired()) {
      clearToken();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

/** Очистити токен */
export function clearToken() {
  try {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_EXP);
  } catch {}
}
