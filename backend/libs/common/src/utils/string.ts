export function capitalizeFirstLetter(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function capitalize(s: string): string {
  if (!s.trim()) return s;
  return s.split(/\s+/).map(capitalizeFirstLetter).join(' ');
}

export function generateRandomString(chars?: string, length: number = 10): string {
  const characters = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
