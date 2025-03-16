import { ForecastDay } from '../../backend-calls/forecast-data/forecast-data.ts';

function roundRain(total: number) {
  let roundedTotal: number;

  if (total > 0 && total < 0.5) {
    roundedTotal = 0;
  } else {
    roundedTotal = total === 0 ? 0 : Math.round(total);
  }

  return roundedTotal;
}

function rainStartTime(dayData: ForecastDay[]) {
  const rainStartItem = dayData.find((item) => item.rain > 0);

  return rainStartItem === undefined ? undefined : rainStartItem.hour;
}

/**
 * Sleet is counted as rain
 */
function totalRain(dayData: ForecastDay[]) {
  if (dayData === undefined) {
    return 0;
  }

  let rain: number;

  const total = dayData.reduce((previous, item) => {
    rain = 0;

    if (
      item.rain > 0.1 &&
      (item.smartSymbol === undefined || !isSnow(item.smartSymbol))
    ) {
      rain = item.rain || 0;
    }

    return previous + rain;
  }, 0.0);

  return total;
}

function totalSnow(weatherDay: ForecastDay[]) {
  let snow: number;

  const total = weatherDay.reduce((previous, item) => {
    if (item.smartSymbol === undefined) {
      return previous;
    }

    snow = snowAmount(item.temperature, item.rain, item.smartSymbol);

    return previous + snow;
  }, 0.0);

  return total;
}

function snowAmount(temperature: number, rain: number, symbol: number) {
  if (isSnow(symbol)) {
    return (0.016 * Math.pow(temperature, 2) + 1) * rain;
  }

  return 0;
}

function isSnow(symbol: number) {
  return (50 <= symbol && symbol <= 59) || (150 <= symbol && symbol <= 159);
}

export { totalRain, totalSnow, rainStartTime, roundRain, snowAmount };
