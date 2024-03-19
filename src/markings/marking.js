import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Envelope } from "../primitives/envelope";

import { translate, angle } from "../math/utils";

export class Marking {
  /**
   * Stop marking to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */
  constructor(center, directionVector, width, height) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2),
    );

    this.poly = new Envelope(this.support, width, 0).poly;

    this.border = this.poly.segments[2];
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    this.poly.draw(ctx);
  }
}
