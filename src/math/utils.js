import { Point } from "../primitives/point";

/**
 *
 * @param {Point} loc Location to compare against a set of points
 * @param {Point[]} points Set of points to compare against a location
 * @param {number} threshold Max distance in pixels to consider a given point "near"
 * @returns {Point} The closest point to the given location, and also closer than the given threshold
 */
export function getNearestPoint(
  loc,
  points,
  threshold = Number.MAX_SAFE_INTEGER,
) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const point of points) {
    const d = distance(point, loc);
    if (d < minDistance && d < threshold) {
      minDistance = d;
      nearest = point;
    }
  }

  return nearest;
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
