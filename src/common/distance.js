/* Formula from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates */

// Converts numeric degrees to radians
function _toRadian(degrees) {
  return (degrees * Math.PI) / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = _toRadian(lat2 - lat1);
  const dLon = _toRadian(lon2 - lon1);
  const latitude1 = _toRadian(lat1);
  const latitude2 = _toRadian(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(latitude1) *
      Math.cos(latitude2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export { distance };
