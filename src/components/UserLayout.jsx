import Header from "./Header";
import Footer from "./Footer";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-[900px]">
        <div className="grid grid-cols-[72px_1fr]">
          <aside className="bg-[#2E5D8C] text-white">
            <div className="flex h-full flex-col items-center justify-between py-6">
              <div className="space-y-5">
                <div className="h-6 w-6 rounded bg-white/20" />
                <div className="h-6 w-6 rounded bg-white/15" />
                <div className="h-6 w-6 rounded bg-white/10" />
              </div>
              <div className="space-y-2">
                <div className="h-1 w-8 rounded bg-white/30" />
                <div className="h-1 w-8 rounded bg-white/20" />
              </div>
            </div>
          </aside>

          <main className="bg-[#2E5D8C] p-6">
            <div className="rounded bg-[#2E5D8C]">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}