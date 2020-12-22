/**
 * Feels like calculation. See
 * https://tietopyynto.fi/tietopyynto/ilmatieteen-laitoksen-kayttama-tuntuu-kuin-laskentakaava/
 */

/**
 * Calculate feels like value
 * @param {Number} temperature
 * @param {Number} wind
 * @param {Number} humidity
 * @param {Number} [radiation]
 */
function feelsLike(temperature, wind, humidity, radiation) {
  if (
    temperature === undefined ||
    wind === undefined ||
    humidity === undefined
  ) {
    return undefined;
  }

  const chill = chillCorrection(temperature, wind);
  const heat = heatCorrection(temperature, humidity);

  let feels = temperature + (chill - temperature) + (heat - temperature);

  if (radiation !== undefined) {
    feels = radiationCorrection(feels, wind, radiation);
  }

  return Math.round(feels);
}

/**
 *
 * Calculate adjusted wind chill portion. Note that even though
 * the Canadien formula uses km/h, we use m/s and have fitted
 * the coefficients accordingly. Note that (a*w)^0.16 = c*w^16,
 * i.e. just get another coefficient c for the wind reduced to 1.5 meters.
 */
function chillCorrection(temperature, wind) {
  const a = 15.0;
  const t0 = 37.0; // limit, where wind stops cooling

  return (
    a +
    (1 - a / t0) * temperature +
    (a / t0) * (wind + 1) ** 0.16 * (temperature - t0)
  );
}

/**
 *
 * When in Finland and when > 14.5 degrees, 60% is approximately
 * the minimum mean monthly humidity. However, Google wisdom
 * claims most humans feel most comfortable either at 45%, or
 * alternatively somewhere between 50-60%. Hence we choose
 * the middle ground 50%
 *
 * @param {Number} temperature
 * @param {Number} humidity - humidity [0-1]
 */
function heatCorrection(temperature, humidity) {
  const simmerLimit = 14.5;

  // The chart is vertical at this temperature by 0.1 degree accuracy
  if (temperature <= simmerLimit) {
    return temperature;
  }

  // Missing doesn't matter until now that temp > simmer_limit
  if (humidity === undefined || temperature === undefined) {
    return temperature;
  }

  const humidityRef = 50.0 / 100.0;

  const r = humidity / 100.0;

  return (
    (1.8 * temperature -
      0.55 * (1 - r) * (1.8 * temperature - 26) -
      0.55 * (1 - humidityRef) * 26) /
    (1.8 * (1 - 0.55 * (1 - humidityRef)))
  );
}

/**
 * Radiation correction done only when radiation is available
 * Based on the Steadman formula for Apparent temperature,
 * we just inore the water vapour pressure adjustment
 */
function radiationCorrection(feels, wind, radiation) {
  if (feels === undefined || wind === undefined || radiation === undefined) {
    return feels;
  }

  // Chosen so that at wind=0 and rad=800 the effect is 4 degrees
  // At rad=50 the effect is then zero degrees
  const absorption = 0.07;

  return feels + (0.7 * absorption * radiation) / (wind + 10) - 0.25;
}

export { feelsLike };
