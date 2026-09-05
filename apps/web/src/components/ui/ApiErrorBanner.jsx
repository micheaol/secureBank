export function ApiErrorBanner({ error }) {
  if (!error) return null;

  const message = error?.data?.message || "Something went wrong. Please try again.";

  return (
    <div className="rounded-md border border-accent-2-500 bg-accent-2-100 px-4 py-3 text-[14px] text-accent-2-700">
      {message}
    </div>
  );
}
