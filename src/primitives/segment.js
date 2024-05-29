import { Point } from "./point";
import {
  add,
  distance,
  dot,
  magnitude,
  normalize,
  scale,
  subtract,
} from "../math/utils";

export class Segment {
  /**
   * Creates a new Segment
   * @param {Point} p1 Starting point for the current segment
   * @param {Point} p2 Ending point for the current segment
   */
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  /**
   * @returns {number} Linear distance between the ends of the segment
   */
  length() {
    return distance(this.p1, this.p2);
  }

  /**
   * @returns {number} Angle of the normalized vector (does not include magnitude)
   */
  directionVector() {
    return normalize(subtract(this.p2, this.p1));
  }

  /**
   * Returns a boolean describing whether the current segment is equal to the argument. Points are considered unordered in this operation, i.e. new Segment(p1, p2).equals(new Segment(p2, p1)) = true
   * @param {Segment} seg Segment to compare against this one
   * @returns boolean
   */
  equals(seg) {
    return this.includes(seg.p1) && this.includes(seg.p2);
  }

  /**
   * @param {Point} point Point to check for inclusion in this
   * @returns {boolean}
   */
  includes(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  /**
   *
   * @param {Point} point Point to check against
   * @returns {number} Scalar minimum distance from the given point to the closest point on the segment
   */
  distanceToPoint(point) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }

    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);

    return Math.min(distToP1, distToP2);
  }

  /**
   * @param {Point} point Point to project to
   * @returns {*} Point along the current segment that aligns perpendicular to the given Point
   */
  projectPoint(point) {
    const a = subtract(point, this.p1);
    const b = subtract(this.p2, this.p1);
    const normB = normalize(b);
    const scalar = dot(a, normB);

    return {
      point: add(this.p1, scale(normB, scalar)),
      offset: scalar / magnitude(b),
    };
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context with which to render the segment
   * @param {*} config Object that describes the segment's properties
   * @param {number} config.width How wide the segment should be drawn
   * @param {string} config.color Color of the segment
   * @param {number[]} config.dash Array of values to use in the segment's lineDash
   * @param {"butt"|"rounded"|"square"} config.cap Style to use for the segment's lineCap
   */
  draw(ctx, { width = 2, color = "#222", dash = [], cap = "butt" } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();

    // Reset dash
    ctx.setLineDash([]);
  }
}
