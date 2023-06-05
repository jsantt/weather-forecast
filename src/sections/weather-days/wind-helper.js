/**
 * 8–13 m/s	navakkaa tuulta
 * 14–20 m/s	kovaa tuulta
 * 21–32 m/s	myrskyä
 * yli 32 m/s	hirmumyrskyä
 */
const _WIND_TABLE = [
  { min: 8, max: 14, rate: 1, description: 'tuulista' },
  { min: 14, max: 21, rate: 2, description: 'kovaa tuulta' },
  { min: 21, max: 32, rate: 3, description: 'myrskyä' },
  { min: 32, max: 99, rate: 4, description: 'hirmumyrskyä' },
];

function windGustWarning(forecastData) {
  if (forecastData === undefined || forecastData.length < 1) {
    return '';
  }

  const maxGustWind = _max(forecastData, 'roundWindGust');
  const gustRating = windClassification(maxGustWind);

  return { gustRating, maxGustWind };
}

function windWarning(forecastData) {
  if (forecastData === undefined || forecastData.length < 1) {
    return '';
  }

  const maxWind = _max(forecastData, 'roundWind');
  const rating = windClassification(maxWind);

  return { rating, maxWind };
}

function windClassification(windSpeed) {
  if (Number.isNaN(windSpeed) || windSpeed < 8) {
    return 0;
  }

  const rows = _WIND_TABLE.filter(
    item => item.min <= windSpeed && windSpeed < item.max
  );

  return rows[0].rate;
}

function _max(forecastData, property) {
  if (forecastData === undefined || forecastData.length < 1) {
    return undefined;
  }

  let maxWind = 0;

  forecastData.map(item => {
    maxWind = item[property] > maxWind ? item[property] : maxWind;
    return undefined;
  });

  return maxWind;
}

function _maxIndex(forecastData, property) {
  if (forecastData === undefined || forecastData.length < 1) {
    return undefined;
  }

  let maxWind = 0;

  forecastData.map(item => {
    maxWind = item[property] > maxWind ? item[property] : maxWind;
    return undefined;
  });

  let maxIndex = 0;
  forecastData.map((item, index) => {
    if (item[property] === maxWind) {
      maxIndex = index;
    }
    return undefined;
  });

  return maxIndex;
}

function isDayHighest(dayData, currentIndex) {
  const maxWindGustIndex = Math.round(_maxIndex(dayData, 'windGust'));

  return Math.abs(currentIndex - maxWindGustIndex) <= 1;
}

export { isDayHighest, windClassification, windGustWarning, windWarning };
