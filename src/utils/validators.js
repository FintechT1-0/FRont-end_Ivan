// Ім'я/Прізвище: латиниця/українська, апостроф, дефіс, пробіл; довжина 2..50 і так далі
export const NAME_RE = /^[A-Za-zА-Яа-я'’\- ]{2,50}$/;

export function validateName(value) {
  const v = String(value || '').trim();
  if (!v) return "Обов'язкове поле";
  if (v.length < 2) return "Мінімум 2 символи";
  if (v.length > 50) return "Максимум 50 символів";
  if (!NAME_RE.test(v)) return "Дозволені літери, пробіли, апостроф, дефіс";
  return null;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export function validateEmail(value) {
  const v = String(value || '').trim();
  if (!v) return "Вкажіть email";
  if (!EMAIL_RE.test(v)) return "Некоректний email";
  return null;
}

export function validatePassword(value) {
  const v = String(value || '');
  if (!v) return "Вкажіть пароль";
  if (v.length < 8) return "Мінімум 8 символів";
  // (за потреби додай складність: цифра/літера/спецсимвол)
  return null;
}
