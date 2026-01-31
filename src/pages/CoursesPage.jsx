import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courses";

export default function CoursesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCourses();
        const arr = Array.isArray(data) ? data : data?.items || data?.data || [];
        if (mounted) setItems(arr);
      } catch (e) {
        const msg =
          e?.response?.data?.detail || e?.response?.data?.message || e?.message || "Failed to load courses";
        if (mounted) setError(String(msg));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const s = new Set();
    items.forEach((x) => {
      if (x?.category) s.add(x.category);
    });
    return Array.from(s);
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((x) => {
      const title = (x?.title_en || x?.title_ua || "").toLowerCase();
      const desc = (x?.description_en || x?.description_ua || "").toLowerCase();

      const okQ = !query || title.includes(query) || desc.includes(query);
      const okCat = !category || x?.category === category;

      let okPrice = true;
      if (price === "free") okPrice = Number(x?.price || 0) === 0;
      if (price === "paid") okPrice = Number(x?.price || 0) > 0;

      return okQ && okCat && okPrice;
    });
  }, [items, q, category, price]);

  return (
    <div className="px-6 py-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="h-2 w-[520px] max-w-full rounded-full bg-white/80" />
          <div className="h-2 w-[420px] max-w-full rounded-full bg-white/80" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_220px] gap-6 items-center mb-10">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full bg-[#8A4E57] text-white placeholder-white/80 px-6 py-4 pr-14 outline-none"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.5 19C15.1944 19 19 15.1944 19 10.5C19 5.80558 15.1944 2 10.5 2C5.80558 2 2 5.80558 2 10.5C2 15.1944 5.80558 19 10.5 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5L22 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-[#8A4E57] text-white px-4 py-4 outline-none"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl bg-[#8A4E57] text-white px-4 py-4 outline-none"
          >
            <option value="">Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="rounded-3xl bg-white/10 p-10 min-h-[160px]">
          {loading ? (
            <div className="text-center text-white/80">Loading...</div>
          ) : error ? (
            <div className="text-center text-white/90">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-white/80">No courses found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filtered.slice(0, 6).map((x) => (
                <div key={x.id} className="rounded-[44px] bg-[#43658B] p-8">
                  <div className="rounded-[36px] bg-white h-[220px] mb-6 overflow-hidden">
                    {x?.image ? (
                      <img src={x.image} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 w-[80%] rounded-full bg-white/80" />
                    <div className="h-2 w-[70%] rounded-full bg-white/80" />
                    <div className="h-2 w-[90%] rounded-full bg-white/80" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-2 w-[50%] rounded-full bg-white/80" />
                    <div className="h-8 w-[120px] rounded bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          <span className="h-3 w-3 rounded-full bg-black" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}3