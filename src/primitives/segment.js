import { Point } from "./point";

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
   * @param {CanvasRenderingContext2D} ctx Context with which to render the segment
   * @param {*} param1 Object that describes the segment's `width`, `color`, and `dash` properties
   */
  draw(ctx, { width = 2, color = "#222", dash = [] } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();

    // Reset dash
    ctx.setLineDash([]);
  }
}
