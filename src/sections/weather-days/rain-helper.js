const SNOW_SYMBOLS = [41, 42, 43, 51, 52, 53];
const RAIN_SYMBOLS = [22, 23, 31, 32, 33, 63, 64, 72, 73, 81, 82, 83];

function roundRain(total) {
  let roundedTotal;
  if (total > 0 && total < 0.5) {
    roundedTotal = 0;
  } else {
    roundedTotal = total === 0 ? 0 : Math.round(total);
  }

  return roundedTotal;
}

function rainStartTime(dayData) {
  const rainStartItem = dayData.find(item => item.rain > 0);

  return rainStartItem === undefined ? undefined : rainStartItem.hour;
}

/**
 * Sleet is counted as rain
 */
function totalRain(dayData) {
  if (dayData === undefined) {
    return 0;
  }

  let rain;

  const total = dayData.reduce((previous, item) => {
    rain = 0;

    if (item.rain > 0.0 && RAIN_SYMBOLS.includes(item.symbol)) {
      rain = item.rain || 0;
    }

    return previous + rain;
  }, 0.0);

  return total;
}

function totalSnow(weatherDay) {
  let snow;

  const total = weatherDay.reduce((previous, item) => {
    snow = snowAmount(item.temperature, item.rain, item.symbol);

    return previous + snow;
  }, 0.0);

  return total;
}

function snowAmount(temperature, rain, symbol) {
  if (!SNOW_SYMBOLS.includes(symbol)) {
    return 0;
  }
  // eslint-disable-next-line no-restricted-properties
  return (0.016 * Math.pow(temperature, 2) + 1) * rain;
}

export { totalRain, totalSnow, rainStartTime, roundRain, snowAmount };
