import { Point } from "../primitives/point";
import { Marking } from "./marking";

import { angle } from "../math/utils";

export class Parking extends Marking {
  /**
   * Parking spot to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.borders = [this.poly.segments[0], this.poly.segments[2]];
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    for (const border of this.borders) {
      border.draw(ctx, { width: 5, color: "white" });
    }

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector));

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold ${this.height * 0.7}px Arial`;
    ctx.fillText("P", 0, 2.3);
    ctx.restore();
  }
}
