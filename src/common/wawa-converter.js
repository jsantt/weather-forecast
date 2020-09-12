function wawaToSymbol3(wawa, cloudiness) {
  if (wawa === undefined || cloudiness === undefined) {
    return undefined;
  }
  const cloudinessTable = {
    0: 1, //'selkeää',
    1: 1, //'selkeää',
    2: 1, //'melko selkeää',
    3: 2, //'puolipilvistä',
    4: 2, //'puolipilvistä',
    5: 2, //'puolipilvistä',
    6: 3, //'melko pilvistä',
    7: 3, //'pilvistä',
    8: 3, //'pilvistä',
  };

  const wawaTable = {
    4: 91, //'Auerta, savua tai pölyä',
    5: 91, //'Auerta, savua tai pölyä, näkyvyys alle 1km',

    10: 91, //'utua',
    20: 92, //'sumua',
    21: 32, //'sadetta',
    22: 31, //'tihkusadetta',
    23: 32, //'vesisadetta',
    24: 52, //'lumisadetta',
    25: 82, //'jäätävää vesisadetta',

    30: 92, //'sumua',
    31: 92, //'sumua',
    32: 92, //'sumua',
    33: 92, //'sumua',
    34: 92, //'sumua',

    40: 32, //'sadetta',
    41: 31, //'heikkoa sadetta',
    42: 33, //'voimakasta sadetta',

    50: 31, //'tihkusadetta',
    51: 31, //'heikkoa tihkusadetta',
    52: 31, //'kohtalaista tihkusadetta',
    53: 32, //'voimakasta tihkusadetta',
    54: 81, //'jäätävää heikkoa tihkusadetta',
    55: 81, //'jäätävää kohtalaista tihkusadetta',
    56: 82, //'jäätävää kovaa tihkusadetta',

    61: 31, //'heikkoa vesisadetta',
    62: 32, //'vesisadetta',
    63: 33, //'voimakasta vesisadetta',

    64: 81, //'jäätävää heikkoa vesisadetta',
    65: 82, //'jäätävää vesisadetta',
    66: 83, //'jäätävää voimakasta vesisadetta',

    67: 82, //'räntäsadetta',
    68: 83, //'voimakasta räntäsadetta',

    70: 52, //'lumisadetta',
    71: 51, //'heikkoa lumisadetta',
    72: 52, //'lumisadetta',
    73: 53, //'voimakasta lumisadetta',

    74: 51, //'heikkoa lumisadetta',
    75: 52, //'lumisadetta',
    76: 53, //'voimakasta lumisadetta',

    77: 52, //'lumisadetta',
    78: 52, //'lumisadetta',

    80: 21, //'heikkoja sadekuuroja',
    81: 21, //'heikkoja sadekuuroja',
    82: 22, //'sadekuuroja',
    83: 23, //'voimakkaita sadekuuroja',
    84: 23, //voimakkaita sadekuuroja',
    85: 41, //'heikkoja lumikuuroja',
    86: 42, //'lumikuuroja',
    87: 43, //'voimakkaita lumikuuroja',
    89: 72, //'raekuuroja',
  };

  if (wawa === 0) {
    // 'ei merkittäviä sääilmiöitä',
    return cloudinessTable[cloudiness];
  }

  return wawaTable[wawa];
}

export { wawaToSymbol3 };
