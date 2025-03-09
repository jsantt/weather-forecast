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

/*
const wawa = {
    00 Ei merkittäviä sääilmiöitä (minkään alla olevan WaWa-koodin ehdot eivät täyty)
    04 Auerta, savua tai ilmassa leijuvaa pölyä ja näkyvyys vähintään 1 km
    05 Auerta, savua tai ilmassa leijuvaa pölyä ja näkyvyys alle 1 km
    
    10 Utua
    
    Koodeja 20-25 käytetään, kun on ollut sadetta tai sumua edellisen tunnin aikana mutta ei enää havaintohetkellä.
    
    20 Sumua
    21 Sadetta (olomuoto on määrittelemätön)
    22 Tihkusadetta (ei jäätävää) tai lumijyväsiä
    23 Vesisadetta (ei jäätävää)
    24 Lumisadetta
    25 Jäätävää vesisadetta tai jäätävää tihkua
    
    Seuraavia koodeja käytetään, kun sadetta tai sumua on havaittu havaintohetkellä.
    
    30 – SUMUA
    31 Sumua tai jääsumua erillisinä hattaroina
    32 Sumua tai jääsumua, joka on ohentunut edellisen tunnin aikana
    33 Sumua tai jääsumua, jonka tiheydessä ei ole tapahtunut merkittäviä muutoksia edellisen tunnin aikana
    34 Sumua tai jääsumua, joka on muodostunut tai tullut sakeammaksi edellisen tunnin aikana
    40 SADETTA (olomuoto on määrittelemätön)
    41 Heikkoa tai kohtalaista sadetta (olomuoto on määrittelemätön)
    42 Kovaa sadetta (olomuoto on määrittelemätön)
    50 TIHKUSADETTA (heikkoa, ei jäätävää)
    51 Heikkoa tihkua, joka ei ole jäätävää
    52 Kohtalaista tihkua, joka ei ole jäätävää
    53 Kovaa tihkua, joka ei ole jäätävää
    54 Jäätävää heikkoa tihkua
    55 Jäätävää kohtalaista tihkua
    56 Jäätävää kovaa tihkua
    60 VESISADETTA (heikkoa, ei jäätävää)
    61 Heikkoa vesisadetta, joka ei ole jäätävää
    62 Kohtalaista vesisadetta, joka ei ole jäätävää
    63 Kovaa vesisadetta, joka ei ole jäätävää
    64 Jäätävää heikkoa vesisadetta
    65 Jäätävää kohtalaista vesisadetta
    66 Jäätävää kovaa vesisadetta
    67 Heikkoa lumensekaista vesisadetta tai tihkua (räntää)
    68 Kohtalaista tai kovaa lumensekaista vesisadetta tai tihkua (räntää)
    70 LUMISADETTA
    71 Heikkoa lumisadetta
    72 Kohtalaista lumisadetta
    73 Tiheää lumisadetta
    74 Heikkoa jääjyvässadetta
    75 Kohtalaista jääjyväsadetta
    76 Kovaa jääjyväsadetta
    77 Lumijyväsiä
    78 Jääkiteitä
    80 KUUROJA TAI AJOITTAISTA SADETTA (heikkoja)
    81 Heikkoja vesikuuroja
    82 Kohtalaisia vesikuuroja
    83 Kovia vesikuuroja
    84 Ankaria vesikuuroja (>32 mm/h)
    85 Heikkoja lumikuuroja
    86 Kohtalaisia lumikuuroja
    87 Kovia lumikuuroja
    89 Raekuuroja mahdollisesti yhdessä vesi- tai räntäsateen kanssa

}

/*


/*
const smartSymbols = {
1 = clear  
2 = mostly clear  
4 = partly cloudy  
6 = mostly cloudy  
7* = overcast  
9* = fog  
71 = isolated thundershowers  
74 = scattered thundershowers  
77 = thundershowers  
21 = isolated showers  
24 = scattered showers  
27* = showers  
11* = drizzle  
14* = freezing drizzle  
17* = freezing rain  
31 = periods of light rain  
34 = periods of light rain  
37* = light rain  
32 = periods of moderate rain  
35 = periods of moderate rain  
38* = moderate rain  
33 = periods of heavy rain  
36 = periods of heavy rain  
39* = heavy rain  
41 = isolated light sleet showers  
44 = scattered light sleet showers  
47* = light sleet  
42 = isolated moderate sleet showers  
45 = scattered moderate sleet showers  
48 = moderate sleet  
43 = isolated heavy sleet showers  
46 = scattered heavy sleet showers  
49* = heavy sleet  
51 = isolated light snow showers  
54 = scattered light snow showers  
57* = light snowfall  
52 = isolated moderate snow showers  
55 = scattered moderate snow showers  
58* = moderate snowfall  
53 = isolated heavy snow showers  
56 = scattered heavy snow showers  
59* = heavy snowfall  
61 = isolated hail showers  
64 = scattered hail showers  
67* = hail showers  
}

*/

export { wawaToSmartSymbol };
