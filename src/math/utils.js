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

/**
 *
 * @param {Point} p1 First point
 * @param {Point} p2 Second point
 * @returns {number} Linear distance between two Points
 */
function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 *
 * @param {Point} p1 First point
 * @param {Point} p2 Second point
 * @returns {number} Vector sum of two Points
 */
export function add(p1, p2) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

/**
 *
 * @param {Point} p1 First point
 * @param {Point} p2 Second point
 * @returns {number} Vector difference between two Points
 */
export function subtract(p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

/**
 *
 * @param {Point} vector Vector
 * @param {number} scalar Number to scale the vector by
 * @returns {Point} Vector scaled by a number
 */
export function scale(vector, scalar) {
  return new Point(vector.x * scalar, vector.y * scalar);
}

/**
 * @param {number} loc Location of the point to translate from
 * @param {number} angle Angle from which to translate
 * @param {number} offset Distance from the point to translate
 * @returns {Point} Point that is translated from the original input
 */
export function translate(loc, angle, offset) {
  return new Point(
    loc.x + Math.cos(angle) * offset,
    loc.y + Math.sin(angle) * offset,
  );
}

/**
 * Returns the angle of the provided 2D vector (Point)
 * @param {Point} p
 * @returns {number} Angle of the provided vector/point
 */
export function angle(p) {
  return Math.atan2(p.y, p.x);
}
