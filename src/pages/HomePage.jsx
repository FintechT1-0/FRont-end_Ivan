import heroVideo from "../assets/hero-bg.mp4";

export default function HomePage() {
  return (
    <div className="w-full">
      <section className="relative w-full h-[760px] overflow-hidden bg-[#0D3C6A]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[#0D3C6A]/55" />

        <div className="relative mx-auto max-w-[1400px] px-6 h-full flex items-end pb-20">
          <h1 className="text-[44px] md:text-[56px] font-light text-white">
            FinTech UniVerse — your gateway to financial knowledge
          </h1>
        </div>
      </section>

      <section className="w-full bg-[#9C5B66]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 text-center">
          <p className="text-[28px] md:text-[40px] font-light leading-snug text-white">
            We analyze the landscape of educational programs, track trends,
            and curate high-value fintech content in one place.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-[1400px] px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-[#9C5B66] p-16 flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="text-[44px] font-light mb-10 text-white">
                Top FinTech Courses
              </div>

              <div className="text-white/90 text-[18px] leading-relaxed max-w-[460px]">
                Discover fintech courses in digital finance, blockchain, AI, RegTech, SupTech,
                and fintech product development.
                <div className="mt-6">
                  FinTech UniVerse bridges the gap between the course market and your professional growth.
                </div>
              </div>
            </div>

            <div className="text-center underline text-white">View all courses</div>
          </div>

          <div className="bg-[#0B3F7A] p-16 flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="text-[44px] font-light mb-10 text-right text-white">
                Latest Insights
              </div>

              <div className="text-white/90 text-[18px] leading-relaxed max-w-[520px] ml-auto text-right">
                Global regulators announce new requirements for digital assets:
                a brief overview of key updates.
              </div>
            </div>

            <div className="text-center underline text-white">View insights</div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#3E658F]">
        <div className="mx-auto max-w-[1400px] px-6 py-24">
          <div className="text-center text-[44px] font-light mb-12 text-white">
            Our partners and content providers
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="bg-white rounded-[44px] h-[420px]" />
            <div className="bg-white rounded-[44px] h-[520px]" />
            <div className="bg-white rounded-[44px] h-[420px]" />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#BC0109]">
        <div className="mx-auto max-w-[1400px] px-6 py-28">
          <p className="text-[28px] md:text-[40px] font-light leading-snug max-w-[920px] text-white">
            We collaborate with educational platforms and fintech companies to monitor
            the most relevant opportunities for our users.
          </p>
        </div>
      </section>
    </div>
  );
}