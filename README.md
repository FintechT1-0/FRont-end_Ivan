# FinTech UniVerse 1.0 — Auth & Registration (MVP)

## Стек
- **React + Vite**
- **TailwindCSS**
- **Axios** (інтерсептори: Bearer, автологаут на 403)
- **react-router-dom**

---

## Швидкий старт
```bash
npm i
npm run dev
# http://localhost:5173
.env (приклад)
Створи файл .env у корені:

ini
Копіювати код
VITE_API_URL=http://localhost:3000
Скрипти
json
Копіювати код
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
Структура
bash
Копіювати код
src/
  api/
    client.js           # axios instance + interceptors (Bearer, 403 logout)
  service/
    auth.js             # login(), me()
  hooks/
    useSession.js       # перевірка активної сесії через /auth/me
  components/
    RegistrationForm.jsx# форма реєстрації (мокове підтвердження)
    LoginForm.jsx       # форма логіну (401-хендлінг)
    ProtectedRoute.jsx  # guard для приватних сторінок
  pages/
    Dashboard.jsx       # демо-дашборд з logout
  App.jsx
  main.jsx
  index.css
Маршрути
/register — форма реєстрації (MVP, мок-сабміт)

/login — логін (POST /auth/login)

/dashboard — захищена сторінка (GET /auth/me)

API-контракти (очікування)
yaml
Копіювати код
POST /auth/login
req: { email: string, password: string }
res 200: { token: string, user?: {...} }
res 401: { message?: "invalid credentials" }

GET /auth/me
headers: Authorization: Bearer <token>
res 200: { user: {...} } | {...user}
res 403: { message?: "forbidden" }
Якщо бек повертає інші поля (наприклад, access_token), адаптувати в src/service/auth.js.

Збереження сесії (localStorage)
jwt — токен із /auth/login

finu_user — JSON користувача (за наявності)

Інтерсептори (src/api/client.js)
request → додає Authorization: Bearer <jwt> якщо токен є

response → на 403: очищає jwt/finu_user та редіректить на /login

Acceptance Criteria (покрито)
Логін: запит на /auth/login, збереження JWT, редірект на /dashboard

401: показ повідомлення “Невірний email або пароль”

Перевірка активної сесії через /auth/me

Інтерсептори Axios: Bearer + автологаут на 403

Форма реєстрації: поля, базова валідація, мок-підтвердження

Як перевірити локально
npm run dev → http://localhost:5173

/register: валідні дані → зелений банер + finu_mock_token / finu_user

/login:

неправильні креденшіали → 401 + банер помилки

правильні → 200, збереження jwt, редірект на /dashboard

/dashboard (F5): у Network має бути GET /auth/me;
200 → лишає на сторінці; 403 → автологаут на /login

Очистити Local Storage → спробувати зайти на /dashboard → редірект на /login

Tailwind
tailwind.config.cjs:

js
Копіювати код
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
postcss.config.cjs: tailwindcss + autoprefixer

src/index.css:

css
Копіювати код
@tailwind base;
@tailwind components;
@tailwind utilities;
Траблшутінг
Failed to resolve import "axios" → npm i axios

React is not defined → додати import React from "react" або підключити @vitejs/plugin-react

Tailwind “content is missing” → перевірити content у tailwind.config.cjs

ESM/CommonJS конфіги → використовувати .cjs для tailwind.config/postcss.config

Push відхилено → git pull --rebase origin main → git push

TODO / Next
Реальна реєстрація: підключити POST /auth/register

Єдині повідомлення (тости)

Refresh-token (якщо підтримує бек)

e2e (Playwright) на /login → /dashboard

Валідація схемами (zod/yup) за потреби