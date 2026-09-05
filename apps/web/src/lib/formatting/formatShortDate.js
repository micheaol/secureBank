export function formatShortDate(dateInput) {
  return new Date(dateInput).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
