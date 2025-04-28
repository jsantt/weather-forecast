import { Station } from '../../backend-calls/observation-data/observation-data.ts';

function updateJsonLdObservations(observation: Station[]) {
  const json = {
    '@type': 'WeatherMeasurement',
    location: {
      '@type': 'Place',
      name: observation.at(0)?.selectedStation,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: observation.at(0)?.lat,
        longitude: observation.at(0)?.lon,
      },
    },
    airPressure: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.pressure,
      unitCode: 'hPa',
    },
  };
  return { weather: json };
}

function updateJsonLd(value: JSON): void {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) {
    return;
  }

  const jsonLd = JSON.parse(script.textContent);
  jsonLd.push(value);
  script.textContent = JSON.stringify(jsonLd, null, 2);
}

export { updateJsonLd, updateJsonLdObservations };
