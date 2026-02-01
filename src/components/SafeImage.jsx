import { useMemo, useState } from "react";

export default function SafeImage({
  src,
  fallbackSrc,
  alt = "",
  className = "",
}) {
  const candidates = useMemo(() => {
    return [src, fallbackSrc].filter(Boolean);
  }, [src, fallbackSrc]);

  const [idx, setIdx] = useState(0);

  const current = candidates[idx] || "";

  if (!current) return null;

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}