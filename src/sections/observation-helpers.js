import {
  distanceBetween,
  extendVector,
  checkCollision,
} from './vector-math.js';

/**
 * Adjusting coordinates iteratively. Places the stations on the map starting from
 * the nearest. If the placed stations collides with the previous stations, move
 * it by extendLength until it fits
 */
function addCoordinatesForMap(observations) {
  const calculatedStation = observations.at(0);

  const allPositions = getAllSlots(
    calculatedStation.lon,
    calculatedStation.lat
  );

  let availableSlots = [...allPositions];
  const fixedObservations = observations.map((observation) => {
    const copy = { ...observation };

    const coordinates = findFreeSlot(
      observation.lonForMap,
      observation.latForMap,
      availableSlots,
      observation.distance
    );

    copy.lonSlot = coordinates.x;
    copy.latSlot = coordinates.y;

    copy.lonForMap = coordinates.x;
    copy.latForMap = coordinates.y;

    availableSlots = availableSlots.map((slot) => {
      const slotCopy = { ...slot };
      if (slot.x === copy.lonForMap && slot.y === copy.latForMap) {
        slotCopy.free = false;
      }
      return slotCopy;
    });

    return copy;
  });

  const result = moveTowardsOrigin(fixedObservations);

  return result;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} allSlots e.g. [{24.3, 60.4}, {24.1, 60.1},..]
 */
function findFreeSlot(x, y, allSlots, distance) {
  let minDistance = 999;
  const initValueForNearest = { x: 99, y: 99 };

  return allSlots.reduce((nearest, current) => {
    if (distance > 20 && current.inner) {
      return nearest;
    }

    const distance2 = distanceBetween(x, y, current.x, current.y);
    if (current.free && distance2 < minDistance) {
      minDistance = distance2;
      return current;
    }

    return nearest;
  }, initValueForNearest);
}

function getAllSlots(centerX, centerY) {
  const slots = getSlots(centerX, centerY);

  return slots.map((item) => {
    return { ...item, free: true };
  });
}

/**
 *
 * @param {*} params
 * @returns
 */
function getSlots(centerX, centerY) {
  const stationRadius = 0.11;
  const calculatedStationRadius = 0.31;

  const innerCircleRadius = stationRadius + calculatedStationRadius + 0.09;

  const innerDistance1 = 0.5 * innerCircleRadius;
  const innerDistance2 = 0.866 * innerCircleRadius;
  const innerDistance3 = innerCircleRadius;

  const outerCircleRadius = 3 * stationRadius + calculatedStationRadius + 0.12;
  const outerDistance1 = 0.5 * outerCircleRadius;
  const outerDistance2 = 0.866 * outerCircleRadius;
  const outerDistance3 = outerCircleRadius;

  const centerSlot = { x: centerX, y: centerY, inner: true };

  const innerCircleSlots = getSlots2(
    centerX,
    centerY,
    innerDistance3,
    innerDistance1,
    innerDistance2,
    true
  );

  const outerCircleSlots = getSlots2(
    centerX,
    centerY,
    outerDistance3,
    outerDistance1,
    outerDistance2,
    false
  );

  return [centerSlot, ...innerCircleSlots, ...outerCircleSlots];
}

function getSlots2(
  centerX,
  centerY,
  innerDistance3,
  innerDistance1,
  innerDistance2,
  inner
) {
  return [
    {
      x: centerX,
      y: centerY + innerDistance3,
      inner,
    },
    {
      x: centerX + innerDistance1,
      y: centerY + innerDistance2,
      inner,
    },
    {
      x: centerX + innerDistance2,
      y: centerY + innerDistance1,
      inner,
    },
    {
      x: centerX + innerDistance3,
      y: centerY,
      inner,
    },
    {
      x: centerX + innerDistance2,
      y: centerY - innerDistance1,
      inner,
    },
    {
      x: centerX + innerDistance1,
      y: centerY - innerDistance2,
      inner,
    },
    {
      x: centerX,
      y: centerY - innerDistance3,
      inner,
    },
    {
      x: centerX - innerDistance1,
      y: centerY - innerDistance2,
      inner,
    },
    {
      x: centerX - innerDistance2,
      y: centerY - innerDistance1,
      inner,
    },
    {
      x: centerX - innerDistance3,
      y: centerY,
      inner,
    },
    {
      x: centerX - innerDistance2,
      y: centerY + innerDistance1,
      inner,
    },
    {
      x: centerX - innerDistance1,
      y: centerY + innerDistance2,
      inner,
    },
  ];
}

function moveTowardsOrigin(obs) {
  const stationRadius = 0.099;
  const calculatedStationRadius = 0.3;
  const extendLength = -0.01; // how much station is moved per cycle

  const result2 = obs.map((item, index1) => {
    const nearest = { ...item };

    if (nearest.calculated) {
      return nearest;
    }

    let collideFree = true;
    let distanceAchieved = false;
    let counter = 0;

    // move every item in distance order closer to their original point
    while (collideFree && counter < 25 && !distanceAchieved) {
      counter += 1;

      const distance = distanceBetween(
        obs.at(0).lon,
        obs.at(0).lat,
        nearest.lonForMap,
        nearest.latForMap
      );

      if (
        distance <
        calculatedStationRadius + stationRadius + nearest.distance * 0.005
      ) {
        distanceAchieved = true;
      }

      collideFree = !obs.some((ob, index2) => {
        if (index1 === index2) {
          return false;
        }

        const collision =
          checkCollision(
            nearest.lonForMap,
            nearest.latForMap,
            nearest.calculated ? calculatedStationRadius : stationRadius,
            ob.lonForMap,
            ob.latForMap,
            ob.calculated ? calculatedStationRadius : stationRadius
          ) === true;
        return collision;
      });

      if (collideFree) {
        const extendedLine = extendVector(
          obs.at(0).lon,
          obs.at(0).lat,
          nearest.lonForMap,
          nearest.latForMap,
          extendLength
        );
        nearest.lonForMap = extendedLine.x2Ext;
        nearest.latForMap = extendedLine.y2Ext;
      }
    }
    return nearest;
  });
  return result2;
}

export { addCoordinatesForMap };
