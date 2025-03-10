type WeatherSymbol = {
  smartSymbol: number;
  fi: string;
  cloudiness?: number[];
  wawa?: number[];
};

/**
 * wawa codes:
 * Koodeja 20-25 käytetään, kun on ollut sadetta tai sumua edellisen tunnin aikana mutta ei enää havaintohetkellä.
 * See https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje
 */
const lastHourWawa = {
  20: 'Sumua edellisen tunnin aikana',
  21: 'Sadetta edellisen tunnin aikana',
  22: 'Tihkusadetta edellisen tunnin aikana',
  23: 'Vesisadetta edellisen tunnin aikana',
  24: 'Lumisadetta edellisen tunnin aikana',
  25: 'Jäätävää vesisadetta edellisen tunnin aikana',
};

const weatherSymbols: WeatherSymbol[] = [
  { smartSymbol: 1, fi: 'selkeää', cloudiness: [0, 1] },
  { smartSymbol: 2, fi: 'enimmäkseen selkeää', cloudiness: [2] },
  { smartSymbol: 4, fi: 'puolipilvistä', cloudiness: [3, 4, 5] },
  { smartSymbol: 6, fi: 'enimmäkseen pilvistä', cloudiness: [6] },
  { smartSymbol: 7, fi: 'pilvistä', cloudiness: [7, 8] },
  { smartSymbol: 9, fi: 'sumua', wawa: [4, 5, 10, 30, 31, 32, 33, 34] },
  { smartSymbol: 11, fi: 'tihkusadetta', wawa: [50, 51, 52, 53] },
  { smartSymbol: 14, fi: 'jäätävää tihkua', wawa: [54, 55, 56] },
  { smartSymbol: 17, fi: 'jäätävää sadetta', wawa: [64, 65, 66] },
  { smartSymbol: 21, fi: 'yksittäisiä sadekuuroja', wawa: [80, 81, 82] },
  { smartSymbol: 24, fi: 'paikoin sadekuuroja' },
  { smartSymbol: 27, fi: 'sadekuuroja', wawa: [83, 84] },
  { smartSymbol: 31, fi: 'puolipilvistä ja ajoittain heikkoa vesisadetta' },
  { smartSymbol: 32, fi: 'puolipilvistä ja ajoittain kohtalaista vesisadetta' },
  { smartSymbol: 33, fi: 'puolipilvistä ja ajoittain voimakasta vesisadetta' },
  {
    smartSymbol: 34,
    fi: 'enimmäkseen pilvistä ja ajoittain heikkoa vesisadetta',
  },
  {
    smartSymbol: 35,
    fi: 'enimmäkseen pilvistä ja ajoittain kohtalaista vesisadetta',
  },
  {
    smartSymbol: 36,
    fi: 'enimmäkseen pilvistä ja ajoittain voimakasta vesisadetta',
  },
  { smartSymbol: 37, fi: 'heikkoa vesisadetta', wawa: [41, 61] },
  { smartSymbol: 38, fi: 'kohtalaista vesisadetta', wawa: [40, 62] },
  { smartSymbol: 39, fi: 'voimakasta vesisadetta', wawa: [42, 63] },
  {
    smartSymbol: 41,
    fi: 'puolipilvistä ja ajoittain heikkoa räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 42,
    fi: 'puolipilvistä ja ajoittain kohtalaista räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 43,
    fi: 'puolipilvistä ja ajoittain voimakasta räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 44,
    fi: 'enimmäkseen pilvistä ja ajoittain heikkoa räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 45,
    fi: 'enimmäkseen pilvistä ja ajoittain kohtalaista räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 46,
    fi: 'enimmäkseen pilvistä ja ajoittain voimakasta räntäsadetta tai räntäkuuroja',
  },
  { smartSymbol: 47, fi: 'heikkoa räntäsadetta' },
  { smartSymbol: 48, fi: 'kohtalaista räntäsadetta', wawa: [67] },
  { smartSymbol: 49, fi: 'voimakasta räntäsadetta', wawa: [68] },
  {
    smartSymbol: 51,
    fi: 'puolipilvistä ja ajoittain heikkoa lumisadetta tai lumikuuroja',
    wawa: [74],
  },
  {
    smartSymbol: 52,
    fi: 'puolipilvistä ja ajoittain kohtalaista lumisadetta tai lumikuuroja',
    wawa: [75, 77, 78],
  },
  {
    smartSymbol: 53,
    fi: 'puolipilvistä ja ajoittain sakeaa lumisadetta tai lumikuuroja',
    wawa: [76, 87],
  },
  {
    smartSymbol: 54,
    fi: 'enimmäkseen pilvistä ja ajoittain heikkoa lumisadetta tai lumikuuroja',
  },
  {
    smartSymbol: 55,
    fi: 'enimmäkseen pilvistä ja ajoittain kohtalaista lumisadetta tai lumikuuroja',
    wawa: [85, 86],
  },
  {
    smartSymbol: 56,
    fi: 'enimmäkseen pilvistä ja ajoittain sakeaa lumisadetta tai lumikuuroja',
  },
  { smartSymbol: 57, fi: 'heikkoa lumisadetta', wawa: [71] },
  { smartSymbol: 58, fi: 'kohtalaista lumisadetta', wawa: [70, 72] },
  { smartSymbol: 59, fi: 'runsasta lumisadetta', wawa: [73] },
  { smartSymbol: 61, fi: 'yksittäisiä raekuuroja' },
  { smartSymbol: 64, fi: 'paikoin raekuuroja', wawa: [89] },
  { smartSymbol: 67, fi: 'raekuuroja' },
  { smartSymbol: 71, fi: 'yksittäisiä ukkoskuuroja' },
  { smartSymbol: 74, fi: 'paikoin ukkoskuuroja' },
  { smartSymbol: 77, fi: 'ukkoskuuroja' },
];

function getSymbolName(smartSymbol: number | undefined): string | undefined {
  return weatherSymbols.find((symbol) => symbol.smartSymbol === smartSymbol)
    ?.fi;
}

function getWeatherObservation(wawaCode: number, cloudiness: number): string {
  const notAvailable = 'Sääasemalta ei saada pilvisyys- ja sadetietoja';

  if (isNaN(cloudiness) || isNaN(wawaCode)) {
    return notAvailable;
  }

  const lastHourDescription = lastHourWawa[wawaCode];
  if (lastHourDescription) {
    return lastHourDescription;
  }

  const weatherSymbol = weatherSymbols.find((weatherSymbol: WeatherSymbol) =>
    weatherSymbol.wawa?.includes(wawaCode)
  );

  if (weatherSymbol !== undefined && weatherSymbol.smartSymbol !== 0) {
    return weatherSymbol.fi;
  }

  const description = weatherSymbols.find((weatherSymbol: WeatherSymbol) =>
    weatherSymbol.cloudiness?.includes(cloudiness)
  )?.fi;

  return description ?? notAvailable;
}

function getSmartSymbol(
  wawaCode: number,
  cloudiness: number
): number | undefined {
  if (isNaN(cloudiness) || isNaN(wawaCode)) {
    return undefined;
  }

  const lastHourDescription = lastHourWawa[wawaCode];

  const cloudinessSmartSymbol = weatherSymbols.find(
    (weatherSymbol: WeatherSymbol) =>
      weatherSymbol.cloudiness?.includes(cloudiness)
  )?.smartSymbol;

  const smartSymbol = weatherSymbols.find((weatherSymbol: WeatherSymbol) =>
    weatherSymbol.wawa?.includes(wawaCode)
  )?.smartSymbol;

  if (lastHourDescription) {
    return cloudinessSmartSymbol;
  }

  if (smartSymbol !== undefined) {
    return smartSymbol;
  }

  if (cloudiness !== undefined) {
    return cloudinessSmartSymbol;
  }

  return undefined;
}

export {
  weatherSymbols,
  getSmartSymbol,
  getSymbolName,
  getWeatherObservation,
  type WeatherSymbol,
};
