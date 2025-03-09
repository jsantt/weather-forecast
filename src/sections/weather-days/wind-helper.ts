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

function windClassification(windSpeed) {
  if (Number.isNaN(windSpeed) || windSpeed < 8) {
    return 0;
  }

  const rows = _WIND_TABLE.filter(
    (item) => item.min <= windSpeed && windSpeed < item.max
  );

  return rows[0].rate;
}

function getHighestWindGustHour(dayData) {
  const dayHighest = dayData.reduce((prev, current) =>
    prev.windGust > current.windGust ? prev : current
  );
  return dayHighest.hour;
}

function isDayHighest(dayData, currentIndex) {
  const dayHighest = dayData.reduce((prev, current) =>
    prev.windGust > current.windGust ? prev : current
  );

  console.log(dayData);
  console.log(dayHighest.hour);

  if (Math.abs(dayData[currentIndex]?.hour - dayHighest.hour) <= 1) {
    /*console.log(
      'HIGHEST',
      dayData[currentIndex].time,
      dayHighest.windGust,
      dayData[currentIndex].windGust
    );*/
  } else {
    //console.log('NOT HIGHEST');
  }
  console.log(dayData[currentIndex]?.hour, dayHighest.hour);

  return Math.abs(dayData[currentIndex]?.hour - dayHighest.hour) <= 1;
}

export { getHighestWindGustHour, isDayHighest, windClassification };
