import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0D3C6A] text-white">
      <Header />
      <main className="overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}