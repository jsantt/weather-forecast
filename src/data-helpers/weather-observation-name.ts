const weatherObservationName = {
  weatherCodes: [
    {
      code: 0,
      description: 'Ei merkittäviä sääilmiöitä',
    },
    {
      code: 4,
      description: 'Auerta, savua tai pölyä, näkyvyys yli 1 km',
    },
    {
      code: 5,
      description: 'Auerta, savua tai pölyä, näkyvyys alle 1 km',
    },
    {
      code: 10,
      description: 'Utua',
    },
    {
      code: 20,
      description: 'Sumua',
    },
    {
      code: 21,
      description: 'Sadetta',
    },
    {
      code: 22,
      description: 'Tihkusadetta tai lumijyväsiä',
    },
    {
      code: 23,
      description: 'Vesisadetta',
    },
    {
      code: 24,
      description: 'Lumisadetta',
    },
    {
      code: 25,
      description: 'Jäätävää vesisadetta tai tihkua',
    },
    {
      code: 30,
      description: 'Sumua',
    },
    {
      code: 31,
      description: 'Sumua tai jääsumua erillisinä hattaroina',
    },
    {
      code: 32,
      description: 'Sumua tai jääsumua (ohentumassa)',
    },
    {
      code: 33,
      description: 'Sumua tai jääsumua (kestänyt yli tunnin)',
    },
    {
      code: 34,
      description: 'Sumua tai jääsumua (sakenemassa)',
    },
    {
      code: 40,
      description: 'Sadetta',
    },
    {
      code: 41,
      description: 'Heikkoa tai kohtalaista sadetta',
    },
    {
      code: 42,
      description: 'Kovaa sadetta',
    },
    {
      code: 50,
      description: 'Tihkusadetta',
    },
    {
      code: 51,
      description: 'Heikkoa tihkua',
    },
    {
      code: 52,
      description: 'Kohtalaista tihkua',
    },
    {
      code: 53,
      description: 'Kovaa tihkua',
    },
    {
      code: 54,
      description: 'Jäätävää heikkoa tihkua',
    },
    {
      code: 55,
      description: 'Jäätävää kohtalaista tihkua',
    },
    {
      code: 56,
      description: 'Jäätävää kovaa tihkua',
    },
    {
      code: 60,
      description: 'Heikkoa vesisadetta',
    },
    {
      code: 61,
      description: 'Heikkoa vesisadetta',
    },
    {
      code: 62,
      description: 'Kohtalaista vesisadetta',
    },
    {
      code: 63,
      description: 'Kovaa vesisadetta',
    },
    {
      code: 64,
      description: 'Jäätävää heikkoa vesisadetta',
    },
    {
      code: 65,
      description: 'Jäätävää kohtalaista vesisadetta',
    },
    {
      code: 66,
      description: 'Jäätävää kovaa vesisadetta',
    },
    {
      code: 67,
      description: 'Heikkoa räntäsadetta',
    },
    {
      code: 68,
      description: 'Kohtalaista tai kovaa räntäsadetta',
    },
    {
      code: 70,
      description: 'Lumisadetta',
    },
    {
      code: 71,
      description: 'Heikkoa lumisadetta',
    },
    {
      code: 72,
      description: 'Kohtalaista lumisadetta',
    },
    {
      code: 73,
      description: 'Tiheää lumisadetta',
    },
    {
      code: 74,
      description: 'Heikkoa jääjyvässadetta',
    },
    {
      code: 75,
      description: 'Kohtalaista jääjyväsadetta',
    },
    {
      code: 76,
      description: 'Kovaa jääjyväsadetta',
    },
    {
      code: 77,
      description: 'Lumijyväsiä',
    },
    {
      code: 78,
      description: 'Jääkiteitä',
    },
    {
      code: 80,
      description: 'Heikkoja kuuroja tai ajoittaista sadetta',
    },
    {
      code: 81,
      description: 'Heikkoja vesikuuroja',
    },
    {
      code: 82,
      description: 'Kohtalaisia vesikuuroja',
    },
    {
      code: 83,
      description: 'Kovia vesikuuroja',
    },
    {
      code: 84,
      description: 'Ankaria vesikuuroja (>32 mm/h)',
    },
    {
      code: 85,
      description: 'Heikkoja lumikuuroja',
    },
    {
      code: 86,
      description: 'Kohtalaisia lumikuuroja',
    },
    {
      code: 87,
      description: 'Kovia lumikuuroja',
    },
    {
      code: 89,
      description:
        'Raekuuroja mahdollisesti yhdessä vesi- tai räntäsateen kanssa',
    },
  ],
};

const cloudinessArray = [
  { code: 0, fi: 'Selkeää' },
  { code: 1, fi: 'Selkeää' },
  { code: 2, fi: 'Melko selkeää' },
  { code: 3, fi: 'Puolipilvistä' },
  { code: 4, fi: 'Puolipilvistä' },
  { code: 5, fi: 'Puolipilvistä' },
  { code: 6, fi: 'Melko pilvistä' },
  { code: 7, fi: 'Pilvistä' },
  { code: 8, fi: 'Pilvistä' },
];

function getWeatherObservationName(code: number, cloudiness: number) {
  if (Number.isNaN(cloudiness)) {
    return 'Pilvisyys- ja sadetiedot eivät saatavilla';
  }

  if (code === 0) {
    const translation = cloudinessArray.find(
      (cloud) => cloud.code === cloudiness
    );
    return translation?.fi;
  }

  const weatherObservation = weatherObservationName.weatherCodes.find(
    (weatherObservation) => weatherObservation.code === code
  );
  return weatherObservation?.description;
}

export { getWeatherObservationName };
