import { Point } from "../primitives/point";
import { Marking } from "./marking";

import { angle } from "../math/utils";

export class Light extends Marking {
  /**
   * Stop marking to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.border = this.poly.segments[2];
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    this.border.draw(ctx, { width: 5, color: "white" });

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);
    ctx.scale(1, 2);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold ${this.height * 0.3}px Arial`;
    ctx.fillText("LITE", 0, 0);
    ctx.restore();
  }
}
