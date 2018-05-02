// @flow
export interface Timestamp {
  date: string;
  datetime: string;
  time: string;
  time_ago: string;
  unix: number;
}

export default (date: Date | number | string): Timestamp => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return {
    date: date.toLocaleDateString(),
    datetime: date.toLocaleString(),
    time: date.toLocaleTimeString(),
    time_ago: time_ago(date),
    unix: date.valueOf()
  };
};

const seconds_per_minute = 60;
const seconds_per_hour = 60 * seconds_per_minute;
const seconds_per_day = 24 * seconds_per_hour;
const seconds_per_week = 7 * seconds_per_day;
const seconds_per_month = 30 * seconds_per_day;
const seconds_per_year = 365 * seconds_per_day;
const time_ago = (date: Date): string => {
  const seconds_ago = Math.floor((Date.now() - date.getTime()) / 1000);
  const years_ago = Math.floor(seconds_ago / seconds_per_year);
  const months_ago = Math.floor(seconds_ago / seconds_per_month);
  const weeks_ago = Math.floor(seconds_ago / seconds_per_week);
  const days_ago = Math.floor(seconds_ago / seconds_per_day);
  const hours_ago = Math.floor(seconds_ago / seconds_per_hour);
  const minutes_ago = Math.floor(seconds_ago / seconds_per_minute);

  if (years_ago >= 1) {
    return years_ago === 1 ? `a year ago` : `${years_ago} years ago`;
  }

  if (months_ago >= 1) {
    return months_ago === 1 ? `a month ago` : `${months_ago} months ago`;
  }

  if (weeks_ago >= 1) {
    return weeks_ago === 1 ? `a week ago` : `${weeks_ago} weeks ago`;
  }

  if (days_ago >= 1) {
    return days_ago === 1 ? `a day ago` : `${days_ago} days ago`;
  }

  if (hours_ago >= 1) {
    return hours_ago === 1 ? `an hour ago` : `${hours_ago} hours ago`;
  }

  if (minutes_ago >= 1) {
    return minutes_ago === 1
      ? 'a minute ago'
      : minutes_ago < 5
        ? 'a few minutes ago'
        : `${minutes_ago} minutes ago`;
  }

  if (seconds_ago < 15) {
    return 'just now';
  }

  if (seconds_ago < 30) {
    return 'a few seconds ago';
  }

  return `${seconds_ago} seconds ago`;
};
