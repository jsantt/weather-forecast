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
  { min: 32, max: 99, rate: 3, description: 'hirmumyrskyä' },
];

function windWarning(forecastData) {
  if (forecastData === undefined || forecastData.length < 1) {
    return '';
  }

  const maxWind = _max(forecastData, 'wind');
  const windDescription = _windDescription(maxWind);
  const windRating = _windClassification(maxWind);

  return { rating: windRating, description: windDescription };
}

function _windClassification(windSpeed) {
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

  const upcomingHours = forecastData.filter(item => !item.past);

  upcomingHours.map(item => {
    maxWind = item[property] > maxWind ? item[property] : maxWind;
    return undefined;
  });

  return maxWind;
}

function _windDescription(maxWind) {
  let windDescription;

  _WIND_TABLE.map(item => {
    if (item.min <= maxWind && maxWind < item.max) {
      windDescription = item.description;
    }
    return undefined;
  });

  return windDescription;
}

export { windWarning };
