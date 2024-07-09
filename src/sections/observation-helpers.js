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
function addCoordinatesForMap(obs, _this) {
  const allObs = [...obs];

  const centerX = allObs.at(0).lonForMap;
  const centerY = allObs.at(0).latForMap;

  const allPositions = getAllSlots({
    centerX,
    centerY,
  });

  let availableSlots = [...allPositions];
  const fixedObservations = allObs.map((observation, index) => {
    const copy = { ...observation };

    const coordinates = findFreeSlot(
      observation.lonForMap,
      observation.latForMap,
      availableSlots
    );

    copy.lonForMap = coordinates.x;
    copy.latForMap = coordinates.y;

    availableSlots = availableSlots.map((slot, index2) => {
      const slotCopy = { ...slot };
      if (slot.x === copy.lonForMap && slot.y === copy.latForMap) {
        slotCopy.free = false;
      }
      if (index > 5 && index2 <= 12) {
        slotCopy.free = false;
      }

      return slotCopy;
    });

    return copy;
  });

  const result = addCoordinatesForMap2(fixedObservations, _this);

  return result;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} allSlots e.g. [{24.3, 60.4}, {24.1, 60.1},..]
 */
function findFreeSlot(x, y, allSlots) {
  let minDistance = 999;
  const initValueForNearest = { x: 99, y: 99 };

  return allSlots.reduce((nearest, current) => {
    const distance = distanceBetween(x, y, current.x, current.y);
    if (current.free && distance < minDistance) {
      minDistance = distance;
      return current;
    }

    return nearest;
  }, initValueForNearest);
}

function getAllSlots(params) {
  const slots = getSlots({
    centerX: params.centerX,
    centerY: params.centerY,
  });

  return slots.map((item) => {
    return { ...item, free: true };
  });
}

/**
 *
 * @param {*} params
 * @returns
 */
function getSlots(params) {
  const stationRadius = 0.11;
  const calculatedStationRadius = 0.31;

  const innerCircleRadius = stationRadius + calculatedStationRadius + 0.07;

  const innerDistance1 = 0.5 * innerCircleRadius;
  const innerDistance2 = 0.866 * innerCircleRadius;
  const innerDistance3 = innerCircleRadius;

  const outerCircleRadius = 3 * stationRadius + calculatedStationRadius + 0.09;
  const outerDistance1 = 0.5 * outerCircleRadius;
  const outerDistance2 = 0.866 * outerCircleRadius;
  const outerDistance3 = outerCircleRadius;

  const centerSlot = { x: params.centerX, y: params.centerY };

  const innerCircleSlots = getSlots2(
    params,
    innerDistance3,
    innerDistance1,
    innerDistance2
  );

  const outerCircleSlots = getSlots2(
    params,
    outerDistance3,
    outerDistance1,
    outerDistance2
  );

  return [centerSlot, ...innerCircleSlots, ...outerCircleSlots];
}

function getSlots2(params, innerDistance3, innerDistance1, innerDistance2) {
  return [
    {
      x: params.centerX,
      y: params.centerY + innerDistance3,
    },
    {
      x: params.centerX + innerDistance1,
      y: params.centerY + innerDistance2,
    },
    {
      x: params.centerX + innerDistance2,
      y: params.centerY + innerDistance1,
    },
    {
      x: params.centerX + innerDistance3,
      y: params.centerY,
    },
    {
      x: params.centerX + innerDistance2,
      y: params.centerY - innerDistance1,
    },
    {
      x: params.centerX + innerDistance1,
      y: params.centerY - innerDistance2,
    },
    {
      x: params.centerX,
      y: params.centerY - innerDistance3,
    },
    {
      x: params.centerX - innerDistance1,
      y: params.centerY - innerDistance2,
    },
    {
      x: params.centerX - innerDistance2,
      y: params.centerY - innerDistance1,
    },
    {
      x: params.centerX - innerDistance3,
      y: params.centerY,
    },
    {
      x: params.centerX - innerDistance2,
      y: params.centerY + innerDistance1,
    },
    {
      x: params.centerX - innerDistance1,
      y: params.centerY + innerDistance2,
    },
  ];
}

function addCoordinatesForMap2(obs) {
  const calculated = obs.at(0);
  const observations = obs.map((item) => {
    const copy = { ...item };
    if (item.distance < 10) {
      const extendedLine = extendVector(
        calculated.lon,
        calculated.lat,
        item.lonForMap,
        item.latForMap,
        -0.07
      );
      copy.lonForMap = extendedLine.x2Ext;
      copy.lanForMap = extendedLine.y2Ext;
    } else if (item.distance < 20) {
      const extendedLine = extendVector(
        calculated.lon,
        calculated.lat,
        item.lonForMap,
        item.latForMap,
        -0.03
      );
      copy.lonForMap = extendedLine.x2Ext;
      copy.lanForMap = extendedLine.y2Ext;
    }
    return copy;
  });

  const stationRadius = 0.12;
  const calculatedStationRadius = 0.28;
  const extendLength = -0.01; // how much station is moved per cycle

  const result2 = observations.map((item, index1) => {
    const copy = { ...item };

    let collideFree = true;

    let counter = 0;

    // move every item in distance order closer to their original point
    while (collideFree && counter < 100) {
      counter += 1;
      collideFree = !observations.some((ob, index2) => {
        if (index1 === index2) {
          return false;
        }

        const collision =
          checkCollision(
            copy.lonForMap,
            copy.latForMap,
            copy.calculated ? calculatedStationRadius : stationRadius,
            ob.lonForMap,
            ob.latForMap,
            ob.calculated ? calculatedStationRadius : stationRadius
          ) === true;
        if (collision) {
          console.log('collision', copy, ob);
        }
        return collision;
      });

      if (collideFree) {
        const extendedLine = extendVector(
          copy.lon,
          copy.lat,
          copy.lonForMap,
          copy.latForMap,
          extendLength
        );
        copy.lonForMap = extendedLine.x2Ext;
        copy.latForMap = extendedLine.y2Ext;
      }
    }
    return copy;
  });
  return result2;
}

export { addCoordinatesForMap };
