export function capitalizeFirstLetter(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function capitalize(s: string): string {
  if (!s.trim()) return s;
  return s.split(/\s+/).map(capitalizeFirstLetter).join(' ');
}
