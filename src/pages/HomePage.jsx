// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-screen bg-[#e4e1dc] overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-[12px] bg-[#eceae6]" />
          <div className="hidden sm:flex items-center gap-6">
            <span className="block h-[6px] w-24 rounded-full bg-white" />
            <span className="block h-[6px] w-20 rounded-full bg-white" />
            <span className="block h-[6px] w-20 rounded-full bg-white" />
            <span className="block h-[6px] w-16 rounded-full bg-white" />
          </div>
        </div>
        <Link
          to="/login"
          className="rounded-full bg-black/90 px-4 py-2 text-white text-sm shadow-lg hover:bg-black"
        >
          Увійти / Зареєструватись
        </Link>
      </header>

      <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-5 px-6">
        <div className="h-[8px] w-[60%] max-w-[900px] rounded-full bg-white" />
        <div className="h-[8px] w-[40%] max-w-[600px] rounded-full bg-white" />
      </div>
    </div>
  );
}
