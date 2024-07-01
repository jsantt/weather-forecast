import { extendVector, checkCollision } from './vector-math.js';

/**
 * Adjusting coordinates iteratively. Places the stations on the map starting from
 * the nearest. If the placed stations collides with the previous stations, move
 * it by extendLength until it fits
 */
function addCoordinatesForMap(obs) {
  const observations = [...obs];
  const stationRadius = 0.165;
  const calculatedStationRadius = 0.35;
  const extendLength = 0.01; // how much station is moved per cycle

  // for some reason, algorithm performs better when applied 3 times in a row :)
  for (let i = 0; i <= 5; i += 1) {
    observations.forEach(o1 => {
      observations.forEach(o2 => {
        while (
          o2.calculated !== true &&
          o1.latForMap !== o2.latForMap &&
          o1.lonForMap !== o2.latForMap &&
          o1.collision !== true &&
          o2.collision !== true &&
          checkCollision(
            o1.lonForMap,
            o1.latForMap,
            o1.calculated ? calculatedStationRadius : stationRadius,
            o2.lonForMap,
            o2.latForMap,
            stationRadius
          ) === true
        ) {
          const extendedLine = extendVector(
            o1.lonForMap,
            o1.latForMap,
            o2.lonForMap,
            o2.latForMap,
            extendLength
          );

          // eslint-disable-next-line no-param-reassign
          o2.lonForMap = extendedLine.x2Ext;
          // eslint-disable-next-line no-param-reassign
          o2.latForMap = extendedLine.y2Ext;
        }
      });
    });
  }
  return observations;
}

export { addCoordinatesForMap };
