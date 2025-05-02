import { Station } from '../../backend-calls/observation-data/observation-data.ts';

function updateJsonLdObservations(observation: Station[]): void {
  const weatherJsonLd = {
    ...getJsonLd(),
    '@type': 'WeatherMeasurement',
    location: {
      '@type': 'Place',
      name: observation.at(0)?.region,
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
    temperature: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.temperature,
      unitCode: 'CEL',
    },
    visibility: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.visibility,
      unitCode: 'KM',
    },
    dewPoint: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.dewPoint,
      unitCode: 'CEL',
    },
    snowDepth: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.snow,
      unitCode: 'CM',
    },
    humidity: {
      '@type': 'QuantitativeValue',
      value: observation.at(0)?.humidity,
      unitCode: 'P1',
    },
  };

  updateJsonLd(weatherJsonLd);
}

function getJsonLd(): Object {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) {
    return {};
  }

  const jsonLd = JSON.parse(script.textContent);
  return jsonLd;
}

function updateJsonLd(value: Object) {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    return;
  }
  script.textContent = JSON.stringify(value, null, 2);
}

export { updateJsonLdObservations };
