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

  draw(ctx, width = 2, color = "#222") {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}
