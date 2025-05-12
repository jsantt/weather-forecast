import { Station } from '../../backend-calls/observation-data/observation-data.ts';

function updateJsonSiteInfo() {
  const weatherJsonLd = {
    '@context': 'https://schema.org/',
    '@type': ['WebSite'],
    inLanguage: 'fi',
    image: 'https://saaennuste.fi/ios/512.png',
    name: 'Saaennuste.fi',
    sameAs: ['https://www.facebook.com/saaennuste.fi'],
    headline: 'Sää nyt ja 10 päivän ennuste',
    description:
      'Nopein tapa tarkastaa Ilmatieteen laitoksen sääennuste. Palvelu tarjoaa ajantasaisen säätiedon ja 10 päivän ennusteen.',
    url: 'https://saaennuste.fi',
    keywords: [
      'sääennuste',
      'sää',
      'luotettavin sääennuste',
      'ilmatieteen sää',
      'ilmanpaine',
      'ilmankosteus',
      'lumitilanne',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Saaennuste.fi',
    },
  };

  setJsonLd('website-ld', weatherJsonLd);
}

function updateJsonLdObservations(observation: Station[]): void {
  const about = {
    '@type': 'Place',
    name: observation.at(0)?.region,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: observation.at(0)?.lat,
      longitude: observation.at(0)?.lon,
    },
  };

  const observationsJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Lämpötila',
      value: observation.at(0)?.temperature,
      unitCode: 'CEL',
      observationAbout: about,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Ilmanpaine',
      value: observation.at(0)?.pressure,
      unitCode: 'hPa',
      observationAbout: about,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Näkyvyys',
      value: observation.at(0)?.visibility,
      unitCode: 'KM',
      observationAbout: about,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Kastepiste',
      value: observation.at(0)?.dewPoint,
      unitCode: 'CEL',
      observationAbout: about,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Lumen syvyys',
      value: observation.at(0)?.snow,
      unitCode: 'CM',
      observationAbout: about,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Observation',
      name: 'Ilmankosteus',
      value: observation.at(0)?.humidity,
      unitCode: 'PI',
      observationAbout: about,
    },
  ];
  setJsonLd('observations-ld', observationsJsonLd);
}

function setJsonLd(elementId: string, value: Object) {
  const script = document.getElementById(elementId);
  if (!script) {
    return;
  }
  script.textContent = JSON.stringify(value, null, 2);
}

export { updateJsonSiteInfo, updateJsonLdObservations };
