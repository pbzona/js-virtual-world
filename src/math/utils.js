import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

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
 * @param {Point} loc Location to compare against a set of segments
 * @param {Segment[]} segments Set of segments to compare against a location
 * @param {number} threshold Max distance in pixels to consider a given point "near"
 * @returns {Point} The closest point to the given location, and also closer than the given threshold
 */
export function getNearestSegment(
  loc,
  segments,
  threshold = Number.MAX_SAFE_INTEGER,
) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const seg of segments) {
    const d = seg.distanceToPoint(loc);
    if (d < minDistance && d < threshold) {
      minDistance = d;
      nearest = seg;
    }
  }

  return nearest;
}

/**
 * @param {Point} p1 First point
 * @param {Point} p2 Second point
 * @returns {number} Linear distance between two Points
 */
export function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Point} Average of two points
 */
export function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

/**
 *
 * @param {Point} p1 First point/vector
 * @param {Point} p2 Second point/vector
 * @returns {number} Dot product of two Points/vectors
 */
export function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

/**
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
 * @param {Point} p Vector for which to return its normalized form
 * @returns {Point} Vector with same angle as input, but magnitude scaled to 1
 */
export function normalize(p) {
  return scale(p, 1 / magnitude(p));
}

/**
 * @param {Point} p Vector for which to measure magnitude
 * @returns {number} The magnitude of the vector/Point
 */
export function magnitude(p) {
  return Math.hypot(p.x, p.y);
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

export function perpendicular(p) {
  return new Point(-p.y, p.x);
}

/**
 * Returns the angle of the provided 2D vector (Point)
 * @param {Point} p
 * @returns {number} Angle of the provided vector/point
 */
export function angle(p) {
  return Math.atan2(p.y, p.x);
}

// Todo - consolidate functions into the Intersection class
class Intersection {
  /**
   *
   * @param {number} x X coordinate of the intersecting point
   * @param {number} y Y coordinate of the intersecting point
   * @param {number} offset Decimal representing distance along the original line A->B
   */
  constructor(x, y, offset) {
    this.x = x;
    this.y = y;
    this.offset = offset;
  }
}

/**
 * Get the point of intersection between two lines, if it exists
 * @param {Point} A First point on line 1
 * @param {Point} B Second point on line 1
 * @param {Point} C First point on line 2
 * @param {Point} D Second point on line 2
 * @returns {(Intersection|null)}
 */
export function getIntersection(A, B, C, D) {
  const t = calculateOffsets(A, B, C, D);
  const u = calculateOffsets(C, D, A, B);
  if (t && u) {
    return new Intersection(lerp(A.x, B.x, t), lerp(A.y, B.y, t), t);
  }
  return null;
}

// Calculate the offset of the intersection point, ie distance along A->B expressed as a decimal
function calculateOffsets(A, B, C, D) {
  const top = (D.y - C.y) * (A.x - C.x) - (D.x - C.x) * (A.y - C.y);
  const bottom = (D.x - C.x) * (B.y - A.y) - (D.y - C.y) * (B.x - A.x);

  const epsilon = 0.0001;
  if (Math.abs(bottom) > epsilon) {
    const offset = top / bottom;
    if (offset >= 0 && offset <= 1) {
      return offset;
    }
  }
  return null;
}

// Linear interpolation between two points a & b, at a distance (offset) of t between them
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Returns a linearly interpolated Point in 2D space at an offset between two Points
 * @param {Point} A First point
 * @param {Point} B Second point
 * @param {number} t Offset to interpolate to (from A to B)
 * @returns {Point} Point representing the interpolated 2D position from A to B
 */
export function lerp2D(A, B, t) {
  return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

/**
 * Calculate a "fake 3d point" based on the height it is meant to be above the base point, as well
 * as the angle it is being viewed at (calculated from viewPoint)
 * @param {Point} point Base point to calculate from
 * @param {Point} viewPoint Inverse of distance from camera to input Point
 * @param {number} height Height in pixels to use when calculating "3d" height
 * @returns {Point} Point representing the perspective height based on actual height and viewing angle
 */
export function getFake3dPoint(point, viewPoint, height) {
  // Direction of the line between point and viewpoint
  const dir = normalize(subtract(point, viewPoint));

  // Distance between the viewpoint center for clamping
  const dist = distance(point, viewPoint);

  // Normalizes on [0,1], tells how much to scale
  const scalar = Math.atan(dist / 300) / (Math.PI / 2);

  // How much of the height is contributed to the perspective vector
  return add(point, scale(dir, height * scalar));
}
