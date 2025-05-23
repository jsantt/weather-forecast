import { ForecastDay } from './forecast-data.ts';

function rainStartTime(dayData: ForecastDay) {
  const rainStartItem = dayData.hours.find((item) => item.rain > 0);

  return rainStartItem === undefined ? undefined : rainStartItem.hour;
}

function dayRainProbability(dayData: ForecastDay) {
  if (!dayData) {
    return 0;
  }

  // given h = hour
  // probability that it does not rain for the whole day is 1 - (not raining for hour 1 * not raining for hour 2*...)
  // 1 - (1-h1)*(1-h2)*...(1-h24)
  const total = dayData.hours.reduce((previousHour, currentHour) => {
    const probability = currentHour.rainProbability
      ? currentHour.rainProbability / 100
      : 0;

    return previousHour * (1 - probability || 0);
  }, 1);

  return Math.round((1 - total) * 100);
}

/**
 * Sleet is counted as rain
 */
function totalRain(dayData: ForecastDay) {
  if (dayData === undefined) {
    return 0;
  }

  let rain: number;

  const total = dayData.hours.reduce((previous, item) => {
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

function totalSnow(weatherDay: ForecastDay) {
  let snow: number;

  const total = weatherDay.hours.reduce((previous, item) => {
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

export { totalRain, totalSnow, rainStartTime, snowAmount, dayRainProbability };
