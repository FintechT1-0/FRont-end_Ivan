const KEY_ACCESS = "finu.access"
const KEY_EXP = "finu.exp"
const TTL_MS = 24 * 60 * 60 * 1000

export function setToken(token, ttlMs = TTL_MS) {
  localStorage.setItem(KEY_ACCESS, token || "")
  const exp = Date.now() + ttlMs
  localStorage.setItem(KEY_EXP, String(exp))
}

export function getToken() {
  return localStorage.getItem(KEY_ACCESS) || ""
}

export function tokenExpiry() {
  const v = localStorage.getItem(KEY_EXP)
  return v ? Number(v) : 0
}

export function isExpired() {
  const exp = tokenExpiry()
  if (!exp) return true
  return Date.now() >= exp
}

export function clearToken() {
  localStorage.removeItem(KEY_ACCESS)
  localStorage.removeItem(KEY_EXP)
}
