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

  draw(ctx, size = 18, color = "#222") {
    const radius = size / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
