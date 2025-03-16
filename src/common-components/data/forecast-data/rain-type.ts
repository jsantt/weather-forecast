const icons = [
  { min: 10, max: 40, symbolName: 'rain' },
  { min: 40, max: 50, symbolName: 'slush' },
  { min: 50, max: 70, symbolName: 'snow' },
  { min: 70, max: 80, symbolName: 'thunder' },
];

/**
 * Resolves rain type
 */
function rainType(smartSymbol?: number): string | undefined {
  if (smartSymbol == undefined) {
    return undefined;
  }

  const symbol = smartSymbol % 100;

  for (const item of icons) {
    if (item.min < symbol && symbol < item.max) {
      return item.symbolName;
    }
  }
  return undefined;
}

export { rainType };
