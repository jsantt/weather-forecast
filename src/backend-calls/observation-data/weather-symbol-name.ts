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
  { smartSymbol: 1, fi: 'Selkeää', cloudiness: [0, 1] },
  { smartSymbol: 2, fi: 'Enimmäkseen selkeää', cloudiness: [2] },
  { smartSymbol: 4, fi: 'Puolipilvistä', cloudiness: [3, 4, 5] },
  { smartSymbol: 6, fi: 'Enimmäkseen pilvistä', cloudiness: [6] },
  { smartSymbol: 7, fi: 'Pilvistä', cloudiness: [7, 8] },
  { smartSymbol: 9, fi: 'Sumua', wawa: [4, 5, 10, 30, 31, 32, 33, 34] },
  { smartSymbol: 11, fi: 'Tihkusadetta', wawa: [50, 51, 52, 53] },
  { smartSymbol: 14, fi: 'Jäätävää tihkua', wawa: [54, 55, 56] },
  { smartSymbol: 17, fi: 'Jäätävää sadetta', wawa: [64, 65, 66] },
  { smartSymbol: 21, fi: 'Yksittäisiä sadekuuroja', wawa: [80, 81, 82] },
  { smartSymbol: 24, fi: 'Paikoin sadekuuroja' },
  { smartSymbol: 27, fi: 'Sadekuuroja', wawa: [83, 84] },
  { smartSymbol: 31, fi: 'Puolipilvistä ja ajoittain heikkoa vesisadetta' },
  { smartSymbol: 32, fi: 'Puolipilvistä ja ajoittain kohtalaista vesisadetta' },
  { smartSymbol: 33, fi: 'Puolipilvistä ja ajoittain voimakasta vesisadetta' },
  {
    smartSymbol: 34,
    fi: 'Enimmäkseen pilvistä ja ajoittain heikkoa vesisadetta',
  },
  {
    smartSymbol: 35,
    fi: 'Enimmäkseen pilvistä ja ajoittain kohtalaista vesisadetta',
  },
  {
    smartSymbol: 36,
    fi: 'Enimmäkseen pilvistä ja ajoittain voimakasta vesisadetta',
  },
  { smartSymbol: 37, fi: 'Heikkoa vesisadetta', wawa: [41, 61] },
  { smartSymbol: 38, fi: 'Kohtalaista vesisadetta', wawa: [40, 62] },
  { smartSymbol: 39, fi: 'Voimakasta vesisadetta', wawa: [42, 63] },
  {
    smartSymbol: 41,
    fi: 'Puolipilvistä ja ajoittain heikkoa räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 42,
    fi: 'Puolipilvistä ja ajoittain kohtalaista räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 43,
    fi: 'Puolipilvistä ja ajoittain voimakasta räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 44,
    fi: 'Enimmäkseen pilvistä ja ajoittain heikkoa räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 45,
    fi: 'Enimmäkseen pilvistä ja ajoittain kohtalaista räntäsadetta tai räntäkuuroja',
  },
  {
    smartSymbol: 46,
    fi: 'Enimmäkseen pilvistä ja ajoittain voimakasta räntäsadetta tai räntäkuuroja',
  },
  { smartSymbol: 47, fi: 'Heikkoa räntäsadetta' },
  { smartSymbol: 48, fi: 'Kohtalaista räntäsadetta', wawa: [67] },
  { smartSymbol: 49, fi: 'Voimakasta räntäsadetta', wawa: [68] },
  {
    smartSymbol: 51,
    fi: 'Puolipilvistä ja ajoittain heikkoa lumisadetta tai lumikuuroja',
    wawa: [74],
  },
  {
    smartSymbol: 52,
    fi: 'Puolipilvistä ja ajoittain kohtalaista lumisadetta tai lumikuuroja',
    wawa: [75, 77, 78],
  },
  {
    smartSymbol: 53,
    fi: 'Puolipilvistä ja ajoittain sakeaa lumisadetta tai lumikuuroja',
    wawa: [76, 87],
  },
  {
    smartSymbol: 54,
    fi: 'Enimmäkseen pilvistä ja ajoittain heikkoa lumisadetta tai lumikuuroja',
  },
  {
    smartSymbol: 55,
    fi: 'Enimmäkseen pilvistä ja ajoittain kohtalaista lumisadetta tai lumikuuroja',
    wawa: [85, 86],
  },
  {
    smartSymbol: 56,
    fi: 'Enimmäkseen pilvistä ja ajoittain sakeaa lumisadetta tai lumikuuroja',
  },
  { smartSymbol: 57, fi: 'Heikkoa lumisadetta', wawa: [71] },
  { smartSymbol: 58, fi: 'Kohtalaista lumisadetta', wawa: [70, 72] },
  { smartSymbol: 59, fi: 'Runsasta lumisadetta', wawa: [73] },
  { smartSymbol: 61, fi: 'Yksittäisiä raekuuroja' },
  { smartSymbol: 64, fi: 'Paikoin raekuuroja', wawa: [89] },
  { smartSymbol: 67, fi: 'Raekuuroja' },
  { smartSymbol: 71, fi: 'Yksittäisiä ukkoskuuroja' },
  { smartSymbol: 74, fi: 'Paikoin ukkoskuuroja' },
  { smartSymbol: 77, fi: 'Ukkoskuuroja' },
];

/**
 * if !wawa --> undefined
 * if wawa === 0 --> symbol from cloudiness table
 * if 20 <= wawa <= 25 --> undefined (but description)
 * else return from symbol list
 */
function getSymbolName(smartSymbol: number | undefined): string | undefined {
  return weatherSymbols.find((symbol) => symbol.smartSymbol === smartSymbol)
    ?.fi;
}

function getWeatherObservation(wawaCode?: number, cloudiness?: number): string {
  if (wawaCode === undefined || isNaN(wawaCode)) {
    return 'Sääasemalta ei saada sadetietoja';
  }

  const lastHourDescription = lastHourWawa[wawaCode];
  if (lastHourDescription) {
    return lastHourDescription;
  }

  const weatherSymbol = resolveWawa(wawaCode);

  if (weatherSymbol !== undefined && weatherSymbol.smartSymbol !== 0) {
    return weatherSymbol.fi;
  }

  if (cloudiness === undefined) {
    return 'Sääasemalta ei saada pilvisyys- ja sadetietoja';
  }

  const description = resolveCloudiness(cloudiness)?.fi;

  if (!description) {
    return 'Sääasemalta ei saada pilvisyys- ja sadetietoja';
  }

  if (lastHourDescription) {
    return description;
  }

  return `Nyt ${description.toLocaleLowerCase()}`;
}

function getSmartSymbol(
  wawaCode: number,
  cloudiness: number
): number | undefined {
  if (isNaN(wawaCode)) {
    return undefined;
  }

  const lastHourDescription = lastHourWawa[wawaCode];

  const cloudinessSmartSymbol = resolveCloudiness(cloudiness);

  const smartSymbol = resolveWawa(wawaCode);

  if (lastHourDescription) {
    return cloudinessSmartSymbol?.smartSymbol;
  }

  if (smartSymbol !== undefined) {
    return smartSymbol.smartSymbol;
  }

  if (cloudiness !== undefined) {
    return cloudinessSmartSymbol?.smartSymbol;
  }

  return undefined;
}

function resolveWawa(wawaCode: number) {
  return weatherSymbols.find((weatherSymbol: WeatherSymbol) =>
    weatherSymbol.wawa?.includes(wawaCode)
  );
}

function resolveCloudiness(cloudiness: number) {
  return weatherSymbols.find((weatherSymbol: WeatherSymbol) =>
    weatherSymbol.cloudiness?.includes(cloudiness)
  );
}

export {
  weatherSymbols,
  getSmartSymbol,
  getSymbolName,
  getWeatherObservation,
  type WeatherSymbol,
};
