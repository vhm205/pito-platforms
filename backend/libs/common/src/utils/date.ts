import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

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

export function formatTimestamp(timestamp: Date | string) {
  try {
    if (typeof timestamp === 'string') timestamp = new Date(timestamp);
    return timestamp.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  } catch {
    return timestamp;
  }
}

export function getDateTime(date: string | Date = new Date()) {
  return dayjs(date);
}
