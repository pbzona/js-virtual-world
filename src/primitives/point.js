export class Point {
  /**
   * Creates a new Point
   * @param {number} x coordinate for the point on x axis
   * @param {number} y coordinate for the point on y axis
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a boolean value representing whether another point's coordinates are equivalent to this object's coordinates
   * @param {Point} point - Another point object to compare to this one
   * @returns {boolean}
   */
  equals(point) {
    return this.x === point.x && this.y === point.y;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx - Context with which to render updates
   * @param {*} param1 Object describing the `size`, `color`, `outline`, and `fill` properties of this point
   */
  draw(ctx, { size = 18, color = "#222", outline = false, fill = false } = {}) {
    const radius = size / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, radius * 1.05, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}
