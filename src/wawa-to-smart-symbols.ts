const cloudinessTable = {
  0: 1,
  1: 1,

  2: 2,
  3: 4,
  4: 4,

  5: 4,
  6: 6,
  7: 7,
  8: 7,
};

const wawaTable = {
  4: 9, // 'Auerta, savua tai pölyä  -> sumua',
  5: 9, // 'Auerta, savua tai pölyä, näkyvyys alle 1km -> sumua',

  10: 9, // 'utua -> sumua',

  // näytä käytetään, kun sadetta tai sumua havaittu edellisen tunnin aikana
  // näytä opacity 50 ja < 1h teksti
  20: 9, // 'sumua -> sumua',

  21: 21, // 'sadetta --> yksittäisiä sadekuuroja',
  22: 11, // 'tihkusadetta --> tihkusadetta',

  23: 38, // 'vesisadetta --> yksittäisiä sadekuuroja',
  24: 58, // 'lumisadetta --> heikkoa lumisadetta',
  25: 17, // 'jäätävää vesisadetta',

  // sadetta tai sumua nyt

  30: 9, // 'sumua',
  31: 9, // 'sumua',
  32: 9, // 'sumua',
  33: 9, // 'sumua',
  34: 9, // 'sumua',

  40: 38, // 'sadetta',
  41: 37, // 'heikkoa sadetta',
  42: 39, // 'voimakasta sadetta',

  50: 11, // 'tihkusadetta',
  51: 11, // 'heikkoa tihkusadetta',
  52: 11, // 'kohtalaista tihkusadetta',
  53: 11, // 'voimakasta tihkusadetta',
  54: 14, // 'jäätävää heikkoa tihkusadetta',
  55: 14, // 'jäätävää kohtalaista tihkusadetta',
  56: 14, // 'jäätävää kovaa tihkusadetta',

  61: 37, // 'heikkoa vesisadetta',
  62: 38, // 'vesisadetta',
  63: 39, // 'voimakasta vesisadetta',

  64: 17, // 'jäätävää heikkoa vesisadetta',
  65: 17, // 'jäätävää vesisadetta',
  66: 17, // 'jäätävää voimakasta vesisadetta',

  67: 48, // 'räntäsadetta',
  68: 49, // 'voimakasta räntäsadetta',

  70: 58, // 'lumisadetta',
  71: 57, // 'heikkoa lumisadetta',
  72: 58, // 'kohtalaista lumisadetta',
  73: 59, // 'voimakasta lumisadetta',

  74: 51, // 'heikkoa jääjyväsadetta',
  75: 52, // 'kohtalaista',
  76: 53, // 'kovaa',

  77: 52, // 'lumijyväsiä',
  78: 52, // 'jääkiteitä',

  80: 21, // 'heikkoja sadekuuroja',
  81: 21, // 'heikkoja sadekuuroja',
  82: 21, // 'sadekuuroja',
  83: 27, // 'voimakkaita sadekuuroja',
  84: 27, // voimakkaita sadekuuroja',
  85: 55, // 'heikkoja lumikuuroja',
  86: 55, // 'lumikuuroja',
  87: 53, // 'voimakkaita lumikuuroja',
  89: 64, // 'raekuuroja',
};

function wawaToSmartSymbol(wawaSymbol: number, cloudiness: number): number {
  let wawa = wawaSymbol;

  if (wawa === 0 && Number.isFinite(cloudiness)) {
    // 'ei merkittäviä sääilmiöitä',
    return cloudinessTable[cloudiness];
  } else if (wawa === 0) {
    return 0;
  } else if (wawa <= 20 && wawa <= 25) {
    wawa = 0;
  }

  return wawaTable[wawa];
}

export { wawaToSmartSymbol };
