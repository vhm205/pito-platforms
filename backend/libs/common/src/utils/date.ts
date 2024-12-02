export function getCurrentDateTime(offset = 7) {
  const currentTime = new Date();

  const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + 3600000 * offset);

  const isoString = localTime.toISOString();
  return isoString;
}

export function getDateTimeWithOffset(datetime: string | Date, offset = 7) {
  const utcDate = new Date(datetime);

  // Calculate the offset in minutes (e.g., UTC+7 is 7 * 60 = 420 minutes)
  const offsetInMinutes = offset * 60;

  // Convert the UTC date to local date with the specified offset
  const localDateWithOffset = new Date(utcDate.getTime() + offsetInMinutes * 60 * 1000);

  // Format the date as ISO string to get the desired output
  const formattedDate = localDateWithOffset.toISOString();

  return formattedDate;
}
