import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";

import { add, perpendicular, scale } from "../math/utils";

export class Crossing extends Marking {
  /**
   * Crossing marking to be placed on a road segment
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
   *
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2)),
    );
    line.draw(ctx, {
      width: this.height,
      color: "white",
      dash: [11, 11],
    });
  }
}
