export function formatNairaAmount(amount) {
  const numericAmount = Number(amount);
  return `₦${numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
