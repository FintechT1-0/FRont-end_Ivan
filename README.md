# FinTech UniVerse — Frontend

Frontend частина платформи **FinTech UniVerse** — агрегатора фінтех-курсів, інсайтів та партнерських програм.

🌐 Live site: https://www.fintecheducation.online/

---

## Stack
- React
- Vite
- React Router
- Axios
- TailwindCSS

---

## Структура

src/
api/
client.js        # axios instance
auth.js          # auth API (login / register / me)
components/
Header.jsx
Footer.jsx
Layout.jsx
ProtectedRoute.jsx
UnderDevelopment.jsx
context/
AuthContext.jsx
pages/
HomePage.jsx
CoursesPage.jsx
InsightsPage.jsx
PartnersPage.jsx
LoginPage.jsx
RegisterPage.jsx
UserCabinetPage.jsx
assets/
Logo.png
hero-bg.mp4

---

## Запуск

```bash
npm install
npm run dev

Frontend:

http://localhost:5173


⸻

Backend

API base URL задається через env:

.env.development

VITE_API_BASE_URL=http://127.0.0.1:8000

.env.production

VITE_API_BASE_URL=https://fintechbackend.online


⸻

Auth flow
	•	Login → отримуємо token
	•	token зберігається в localStorage
	•	/auth/me підтягуює користувача
	•	Після логіну → автоматичний перехід у /cabinet

⸻

Routes
	•	/ — Home (hero з відео)
	•	/courses — Courses (дані з бекенду + карусель)
	•	/insights — Under development
	•	/partners — Under development
	•	/login
	•	/register
	•	/cabinet — protected route

⸻

Layout
	•	Header + Footer глобальні
	•	Усі сторінки рендеряться через Layout.jsx

⸻

Notes
	•	BrowserRouter лише один (main.jsx)
	•	Insights / Partners — заглушки
	•	Курси — підтягування з бекенду
	•	Home — відео на фоні першого блоку

---

⸻