export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND') {
  if (amount <= 0) return '0';
  return amount.toLocaleString(locale, { style: 'currency', currency });
}
