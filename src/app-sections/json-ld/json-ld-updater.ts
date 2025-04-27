import { Station } from '../../backend-calls/observation-data/observation-data.ts';

function updateJsonLdObservations(observation: Station[]) {
  const json = {
    '@type': 'WeatherMeasurement',
    location: {
      '@type': 'Place',
      name: 'Helsinki',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 60.1699,
        longitude: 24.9384,
      },
    },
    airPressure: {
      '@type': 'QuantitativeValue',
      value: 1015,
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
