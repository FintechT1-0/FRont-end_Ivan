// src/utils/token.js

const ACCESS_KEY = "finu.access";
const EXP_KEY    = "finu.exp"; // мітка часу закінчення (ms)

/**
 * Зберегти токен і час закінчення дії.
 * @param {string} token
 * @param {number} ttlSeconds - тривалість у секундах (за замовчуванням 24 год)
 */
export function setToken(token, ttlSeconds = 24 * 60 * 60) {
  try {
    localStorage.setItem(ACCESS_KEY, token);
    const exp = Date.now() + ttlSeconds * 1000;
    localStorage.setItem(EXP_KEY, String(exp));
  } catch (_) {
    // якщо localStorage недоступний (інкогніто/політика), просто ігноруємо
  }
}

/** Повертає токен або null, якщо його немає/прострочений. */
export function getToken() {
  try {
    const token = localStorage.getItem(ACCESS_KEY);
    const exp   = Number(localStorage.getItem(EXP_KEY) || 0);
    if (!token || !exp) return null;
    if (Date.now() >= exp) return null;
    return token;
  } catch (_) {
    return null;
  }
}

/** Чи прострочений токен. */
export function isExpired() {
  try {
    const exp = Number(localStorage.getItem(EXP_KEY) || 0);
    return !exp || Date.now() >= exp;
  } catch (_) {
    return true;
  }
}

/** Повністю почистити токен і пов’язані дані. */
export function clearToken() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXP_KEY);
    // опційно чистимо кеш користувача, якщо ти його зберігаєш
    localStorage.removeItem("finu_user");
    localStorage.removeItem("finu.user");
  } catch (_) {}
}
