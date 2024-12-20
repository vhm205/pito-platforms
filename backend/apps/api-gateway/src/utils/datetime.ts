export function getBoundaryIsoStringForDay(
  dateString: string,
  boundary: 'start' | 'end' = 'start',
) {
  const date = new Date(dateString);
  if (boundary === 'start') date.setUTCHours(0, 0, 0, 0);
  else if (boundary === 'end') date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
}
