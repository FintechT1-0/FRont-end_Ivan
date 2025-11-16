export function cleanEmail(raw) {
  return String(raw || "")
    .replace(/\u00A0|\u200B|\u200C|\u200D|\uFEFF/g, "")
    .trim()
    .toLowerCase();
}
// the rest is clean. 