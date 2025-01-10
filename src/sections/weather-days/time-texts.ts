function getDayName(number: number): string {
  const dayNames = ['Tänään'];
  return dayNames[number - 1];
}

function getWeekday(number: number): string {
  const day = new Date();
  day.setDate(day.getDate() + (number - 1));

  return `${day.toLocaleString('fi-FI', { weekday: 'long' })}na`;
}

function getWeekdayShort(number: number): string {
  return getWeekday(number).substring(0, 2);
}

function getDayNumber(number: number): string {
  const now = new Date();
  now.setDate(now.getDate() + number - 1);

  return `${now.getDate()}.${now.getMonth() + 1}.`;
}

export { getDayName, getWeekday, getWeekdayShort, getDayNumber };
