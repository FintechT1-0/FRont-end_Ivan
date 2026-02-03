# FinTech UniVerse — Frontend

Frontend частина платформи **FinTech UniVerse** — фінтех-освітнього агрегатора курсів, інсайтів та партнерського контенту.

🌐 Live: https://www.fintecheducation.online/

---

## Tech Stack

- React (Vite)
- React Router v6
- Axios
- Tailwind CSS

---

## Project Structure

src/
├── api/                # API layer (axios clients, endpoints)
│   ├── client.js
│   ├── publicClient.js
│   ├── auth.js
│   ├── courses.js
│   └── adminCourses.js
├── components/         # Reusable UI & layouts
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   ├── DesktopOnly.jsx
│   └── …
├── context/            # Global state (auth, language)
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
├── pages/              # Route pages
│   ├── HomePage.jsx
│   ├── CoursesPage.jsx
│   ├── InsightsPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── UserCabinetPage.jsx
│   └── admin/
├── assets/             # Static assets
│   ├── Logo.png
│   └── hero-bg.mp4
├── App.jsx
└── main.jsx

---

## Environment

API base URL налаштовується через env:

**.env.development**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000

.env.production

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
	•	/courses — Courses (дані з backend)
	•	/insights — Insights (latest only)
	•	/partners — Partners
	•	/login
	•	/register
	•	/cabinet/* — User area (protected)
	•	/admin/* — Admin panel (protected)

⸻

Auth Flow
	•	Login → отримання JWT
	•	Token зберігається в localStorage
	•	/auth/me → ініціалізація користувача
	•	Автоматичний redirect у /cabinet після логіну
	•	Role-based access (user / admin)

⸻

Layout & UX Notes
	•	Єдиний BrowserRouter (main.jsx)
	•	Global layout: Header + Footer
	•	Admin / User areas мають власні layouts
	•	Mobile версія тимчасово не підтримується
	•	Для mobile / tablet показується DesktopOnly заглушка
	•	Courses:
	•	Public: тільки published
	•	Admin: повний CRUD
	•	Insights:
	•	На Home — latest only
	•	Повна персоналізація планується пізніше

⸻

Status

Проєкт у стадії активної розробки (MVP).
Архітектура підготовлена до масштабування.

⸻
