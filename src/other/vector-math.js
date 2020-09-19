/**
 * Calculate new endpoints for extended line.
 * https://math.stackexchange.com/questions/3346085/extend-line-in-xy-plane-when-start-endpoint-and-direction-is-known
 *
 *
 * (x2`,y2`       (x2,y2)          (x1,y1)      (x1`,y1`)
 *     +             +----------------+            +
 *
 * @param {Number} x1 - original endpoint of line
 * @param {Number} y1 - original endpoint of line
 * @param {Number} x2 - original endpoint of line
 * @param {Number} y2 - original endpoint of line
 *
 * @returns { Object } - new extended line endpoints
 */
function extendVector(x1, y1, x2, y2, extendLength) {
  const vectorNorm = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const x1Ext = x1 - ((x2 - x1) * extendLength) / vectorNorm;
  const y1Ext = y1 - ((y2 - y1) * extendLength) / vectorNorm;

  const x2Ext = x2 + ((x2 - x1) * extendLength) / vectorNorm;
  const y2Ext = y2 + ((y2 - y1) * extendLength) / vectorNorm;

  return { x1Ext, y1Ext, x2Ext, y2Ext };
}

function checkCollision(p1x, p1y, r1, p2x, p2y, r2) {
  return (r1 + r2) ** 2 > (p1x - p2x) ** 2 + (p1y - p2y) ** 2;
}

export { checkCollision, extendVector };
