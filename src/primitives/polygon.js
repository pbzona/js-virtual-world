import { Point } from "./point";

export class Polygon {
  /**
   *
   * @param {Point[]} points List of points to draw around
   */
  constructor(points) {
    this.points = points;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx Context to draw
   * @param {*} options Object that defines the polygon's `stroke`, `lineWidth`, and `fill`
   */
  draw(
    ctx,
    { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3" } = {},
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;

    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
