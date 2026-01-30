export default function AuthCard({
  title,
  children,
  primaryText,
  secondaryText,
  onSecondary,
  footerLinkText,
  onFooter,
  onClose,
}) {
  return (
    <div className="mx-auto w-full max-w-[520px] rounded-2xl bg-white/14 backdrop-blur-md px-10 py-9 text-white shadow-xl outline outline-1 outline-white/15">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">{title}</div>
        <button
          className="text-white/80 hover:text-white text-xl leading-none"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="mt-7 space-y-5">{children}</div>

      {secondaryText ? (
        <div className="mt-3 text-right text-xs text-white/80">
          <button type="button" onClick={onSecondary} className="hover:text-white">
            {secondaryText}
          </button>
        </div>
      ) : null}

      <button
        type="submit"
        className="mt-7 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#0E3B72] hover:bg-white/95"
      >
        {primaryText}
      </button>

      {footerLinkText ? (
        <div className="mt-4 text-center text-xs text-white/80">
          <button type="button" onClick={onFooter} className="underline hover:text-white">
            {footerLinkText}
          </button>
        </div>
      ) : null}
    </div>
  );
}