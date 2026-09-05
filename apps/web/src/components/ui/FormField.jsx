export function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[13px] text-accent-2-700">{error}</p>
      ) : hint ? (
        <p className="text-[13px] text-neutral-700">{hint}</p>
      ) : null}
    </div>
  );
}
