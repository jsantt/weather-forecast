const icons = [
  { min: 20, max: 40, symbolName: 'rain' },
  { min: 40, max: 60, symbolName: 'snow' },
  { min: 60, max: 70, symbolName: 'thunder' },
  { min: 70, max: 90, symbolName: 'slush' },
];

/**
 * Resolves rain type
 *
 * @param {Number} symbol - weather symbol
 * @returns {'rain'|'snow'|'thunder'|'slush'} rain type
 */
function rainType(symbol) {
  for (const item of icons) {
    if (item.min < symbol && symbol < item.max) {
      return item.symbolName;
    }
  }
  return undefined;
}

export { rainType };
