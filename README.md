# FinTech UniVerse — Frontend

Frontend частина платформи **FinTech UniVerse** — фінтех-освітнього агрегатора курсів, інсайтів та партнерського контенту.

🌐 **Live:** https://www.fintecheducation.online/

---

## Tech Stack

- **React** (Vite)
- **React Router v6**
- **Axios**
- **Tailwind CSS**

---

## Project Overview

**FinTech UniVerse** — SPA-платформа, яка:
- агрегує фінтех-курси з ринку;
- показує найновіші інсайди та новини;
- має користувацький кабінет;
- містить окрему admin-панель для керування контентом.

Проєкт розробляється як **MVP з можливістю масштабування**.

---

## Project Structure

```text
src/
├── api/
│   ├── client.js
│   ├── publicClient.js
│   ├── auth.js
│   ├── courses.js
│   └── adminCourses.js
│
├── components/
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   └── DesktopOnly.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── CoursesPage.jsx
│   ├── InsightsPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── UserCabinetPage.jsx
│   └── admin/
│
├── assets/
│   ├── Logo.png
│   └── hero-bg.mp4
│
├── App.jsx
└── main.jsx


⸻

Environment

API base URL налаштовується через env-файли.

Development

VITE_API_BASE_URL=http://127.0.0.1:8000

Production

VITE_API_BASE_URL=https://fintechbackend.online


⸻

Getting Started

npm install
npm run dev

Local app:
http://localhost:5173

⸻

Routing
	•	/ — Home (hero section з відео)
	•	/courses — Курси (дані з backend)
	•	/insights — Інсайди (latest only)
	•	/partners — Партнери
	•	/login
	•	/register
	•	/cabinet/* — User area (protected)
	•	/admin/* — Admin panel (protected)

⸻

Auth Flow
	•	Login → отримання JWT
	•	Token зберігається в localStorage
	•	/auth/me → ініціалізація користувача
	•	Автоматичний redirect у /cabinet
	•	Role-based access: user / admin

⸻

Layout & UX Notes
	•	Один BrowserRouter (main.jsx)
	•	Global layout: Header + Footer
	•	User та Admin мають окремі layouts
	•	Mobile версія тимчасово не підтримується
	•	Для mobile / tablet показується DesktopOnly заглушка

Courses
	•	Public: тільки published
	•	Admin: повний CRUD

Insights
	•	На Home — тільки найновіші
	•	Персоналізація — у наступних ітераціях

⸻

Status

Проєкт знаходиться у стадії активної розробки (MVP).
Архітектура підготовлена до подальшого розвитку та масштабування.

