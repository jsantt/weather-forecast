import { SunCalc } from './suncalc-es6-fork.js';

function isNight(time, location) {
  const dateTime = new Date(time);
  const times = SunCalc.getTimes(dateTime, location.lat, location.lon);

  if (times.sunrise <= dateTime && dateTime <= times.sunset) {
    return false;
  }

  return true;
}

export { isNight };
