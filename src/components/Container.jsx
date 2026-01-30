export default function Container({ children, variant = "page", className = "" }) {
  const max =
    variant === "landing"
      ? "max-w-[520px]"
      : variant === "wide"
      ? "max-w-[1100px]"
      : "max-w-[980px]";

  return <div className={`mx-auto w-full ${max} px-5 sm:px-6 ${className}`}>{children}</div>;
}