import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Envelope } from "../primitives/envelope";

import { add, translate, angle, perpendicular, scale } from "../math/utils";

export class Crossing {
  /**
   * Crossing marking to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */
  constructor(center, directionVector, width, height, ctx) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2),
    );

    this.poly = new Envelope(this.support, width, 0).poly;

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
