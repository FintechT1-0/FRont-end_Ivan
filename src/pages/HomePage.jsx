import heroVideo from "../assets/hero-bg.mp4";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[80vh]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#0D3C6A]/70 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-center max-w-3xl">
            FinTech UniVerse — your gateway to financial knowledge
          </h1>
        </div>
      </section>

      {/* ТЕКСТОВИЙ БЛОК */}
      <section className="bg-[#B05A6A] py-20 text-center px-6">
        <p className="max-w-4xl mx-auto text-2xl">
          We analyze the landscape of educational programs, track trends,
          and curate high-value fintech content in one place.
        </p>
      </section>

      {/* COURSES + INSIGHTS */}
      <section className="grid md:grid-cols-2">
        <div className="bg-[#B05A6A] p-20 text-center">
          <h2 className="text-3xl mb-6">Top FinTech Courses</h2>
          <p>Discover fintech courses in digital finance, blockchain, AI...</p>
        </div>

        <div className="bg-[#0D3C6A] p-20 text-center">
          <h2 className="text-3xl mb-6">Latest Insights</h2>
          <p>Global regulators announce new requirements for digital assets</p>
        </div>
      </section>
    </>
  );
}