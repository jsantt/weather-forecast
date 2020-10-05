/**
 * Calculates "feels like" estimate based on wind and temperature.
 * Formula by Ilmatieteen laitos: https://fi.wikipedia.org/wiki/Pakkasen_purevuus
 *
 * TODO: check formula from: https://tietopyynto.fi/tietopyynto/ilmatieteen-laitoksen-kayttama-tuntuu-kuin-laskentakaava/
 * of assets/feels_like-1.pdf
 *
 * @param {Number} temperature - in celcius
 * @param {Number} wind - metres per second
 */
function feelsLike(temperature, wind) {
  const result =
    13.12 +
    0.6215 * temperature -
    13.956 * wind ** 0.16 +
    0.4867 * temperature * wind ** 0.16;
  return Math.round(result);
}

export { feelsLike };
