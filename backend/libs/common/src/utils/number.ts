export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND') {
  return amount.toLocaleString(locale, { style: 'currency', currency });
}
