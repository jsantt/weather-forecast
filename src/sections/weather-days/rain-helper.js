function _round(total) {
  let roundedTotal;
  if (total > 0 && total < 0.5) {
    roundedTotal = '<1';
  } else {
    roundedTotal = total === 0 ? '' : Math.round(total);
  }

  return roundedTotal;
}

/**
 * Sleet is counted as rain
 */
function totalRain(dayData) {
  if (dayData === undefined) {
    return 0;
  }

  const RAIN_SYMBOLS = [22, 23, 31, 32, 33, 63, 64, 72, 73, 81, 82, 83];

  let rain;

  const total = dayData.reduce((previous, item) => {
    rain = 0;

    if (item.rain > 0.0 && RAIN_SYMBOLS.includes(item.symbol)) {
      rain = item.rain || 0;
    }

    return previous + rain;
  }, 0.0);

  return _round(total);
}

function totalSnow(weatherDay) {
  const SNOW_SYMBOLS = [41, 42, 43, 51, 52, 53];

  let snow;

  const total = weatherDay.reduce((previous, item) => {
    snow = 0;

    if (SNOW_SYMBOLS.includes(item.symbol)) {
      // eslint-disable-next-line no-restricted-properties
      snow = (0.016 * Math.pow(item.temperature, 2) + 1) * item.rain;
    }

    return previous + snow;
  }, 0.0);

  return _round(total);
}

export { totalRain, totalSnow };
