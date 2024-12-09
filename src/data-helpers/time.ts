function getTime(dateTime: Date) {
  const minutes = dateTime.getMinutes();

  const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${dateTime.getHours()}.${fullMinutes}`;
}

function getDay() {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  const locale = 'fi-FI';

  return now.toLocaleDateString(locale, options);
}

function getWeek(): number {
  const now: Date = new Date();

  const copy: Date = new Date(now.valueOf());
  const dayn: number = (now.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - dayn + 3);
  const firstThursday: number = copy.valueOf();
  copy.setMonth(0, 1);
  if (copy.getDay() !== 4) {
    copy.setMonth(0, 1 + ((4 - copy.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - copy.valueOf()) / 604800000);
}

export { getDay, getWeek, getTime };
