import { distanceBetween, extendVector, checkCollision } from './vector-math';

function addCoordinatesForMap(observations) {
  const moved = moveIntoRightDistance(observations);

  return moved;
}

function resolveCollisions(observations: any[]) {
  const stationRadius = 0.099;

  const adjustedObs: any[] = [];
  observations.map((observation) => {
    const copy = { ...observation };
    // console.log('OUTER', observation.name);

    let collision = false;
    adjustedObs.some((adjustedOb) => {
      // console.log('inner', adjustedOb.name);
      if (collision === true) {
        return false;
      }
      collision = checkCollision(
        observation.lonForMap,
        observation.latForMap,
        stationRadius,
        adjustedOb.lonForMap,
        adjustedOb.latForMap,
        stationRadius
      );

      if (collision) {
        const corner = resolveCorner(
          observations.at(0).lon,
          observations.at(0).lat,
          adjustedOb.lonForMap,
          adjustedOb.latForMap
        );

        const nearbySlots = getAllSlots(
          adjustedOb.lonForMap,
          adjustedOb.latForMap,
          corner
        );

        const coordinates = findFreeSlot(
          adjustedOb.lonForMap,
          adjustedOb.latForMap,
          nearbySlots,
          adjustedObs
        );
        if (coordinates.x === 99) {
          console.log("couldn't find slot for ', adjustedOb.name");
        } else {
          // console.log('adjusted ', adjustedOb.name);
          copy.lonForMap = coordinates.x;
          copy.latForMap = coordinates.y;
        }
        return true;
      }
      return false;
    });

    adjustedObs.push(copy);

    return copy;
  });
  return adjustedObs;
}

function resolveCorner(centerX, centerY, x, y) {
  if (x > centerX && y > centerY) {
    return 'top-right';
  }
  if (x > centerX && y < centerY) {
    return 'bottom-right';
  }
  if (x < centerX && y > centerY) {
    return 'top-left';
  }
  if (x < centerX && y < centerY) {
    return 'bottom-left';
  }

  return undefined;
}

function moveIntoRightDistance(obs) {
  const stationRadius = 0.099;
  const calculatedStationRadius = 0.3;

  const adjustedObs: any[] = [];

  const result2 = obs.map((station) => {
    if (station.calculated) {
      return station;
    }

    // min = calculatedStationRadius + stationRadius
    // max = 0.4
    let distance = calculatedStationRadius + stationRadius;
    if (station.distance < 5) {
      distance += 0;
    } else if (station.distance < 10) {
      distance += 0.05;
    } else if (station.distance < 15) {
      distance += 0.1;
    } else if (station.distance < 20) {
      distance += 0.15;
    } else if (station.distance < 25) {
      distance += 0.2;
    } else if (station.distance < 30) {
      distance += 0.25;
    } else if (station.distance < 35) {
      distance += 0.3;
    } else if (station.distance < 40) {
      distance += 0.35;
    } else {
      distance += 0.4;
    }

    const distanceForMap = distance;

    const dist = distanceBetween(
      obs.at(0).lon,
      obs.at(0).lat,
      station.lonForMap,
      station.latForMap
    );

    const extendedLine = extendVector(
      obs.at(0).lon,
      obs.at(0).lat,
      station.lonForMap,
      station.latForMap,
      distanceForMap - dist
    );

    const stationCopy = { ...station };
    stationCopy.lonForMap = extendedLine.x2Ext;
    stationCopy.latForMap = extendedLine.y2Ext;
    stationCopy.lonMoved = extendedLine.x2Ext;
    stationCopy.latMoved = extendedLine.y2Ext;

    const collision = adjustedObs.some((adjustedOb) => {
      return checkCollision(
        stationCopy.lonForMap,
        stationCopy.latForMap,
        stationCopy.calculated ? calculatedStationRadius : stationRadius,
        adjustedOb.lonForMap,
        adjustedOb.latForMap,
        adjustedOb.calculated ? calculatedStationRadius : stationRadius
      );
    });
    stationCopy.collision = collision;

    adjustedObs.push(stationCopy);
    return stationCopy;
  });
  return result2;
}
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} allSlots e.g. [{24.3, 60.4}, {24.1, 60.1},..]
 */
function findFreeSlot(x, y, allSlots, adjustedObs) {
  let minDistance = 999;
  const initValueForNearest = { x: 99, y: 99 };

  const stationRadius = 0.11;
  const newSlot = allSlots.reduce((nearest, current) => {
    const distance2 = distanceBetween(x, y, current.x, current.y);
    if (distance2 < minDistance) {
      const collision = adjustedObs.some((adjustedOb) => {
        return checkCollision(
          current.x,
          current.y,
          stationRadius,
          adjustedOb.lonForMap,
          adjustedOb.latForMap,
          stationRadius
        );
      });

      if (collision) {
        return nearest;
      }

      minDistance = distance2;
      return current;
    }

    return nearest;
  }, initValueForNearest);
  return newSlot;
}

/**
 *
 * @param {*} params
 * @returns
 */
function getAllSlots(centerX, centerY, corner) {
  let x = 1;
  if (corner === 'top-left' || corner === 'bottom-left') {
    x = -1;
  }

  const stationRadius = 0.11;

  const circleRadius = 2 * stationRadius + 0.02;

  const innerDistance1 = 0.5 * circleRadius;
  const innerDistance2 = stationRadius + 0.1;

  // slots for right
  return [
    // on the right
    {
      x: centerX + circleRadius * x,
      y: centerY,
    },
    // on top of previous
    {
      x: centerX + innerDistance1 * x,
      y: centerY + innerDistance2,
    },

    // further
    {
      x: centerX + (3 * stationRadius + 0.03) * x,
      y: centerY + circleRadius,
    },
    {
      x: centerX + innerDistance1 * x,
      y: centerY - innerDistance2,
    },
  ];
}

export { addCoordinatesForMap, resolveCollisions };
