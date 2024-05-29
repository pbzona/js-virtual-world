import { Point } from "../primitives/point";
import { Marking } from "./marking";

import { angle } from "../math/utils";

export class Target extends Marking {
  /**
   * Target marking to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */

  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    this.center.draw(ctx, { color: "red", size: 30 });
    this.center.draw(ctx, { color: "white", size: 20 });
    this.center.draw(ctx, { color: "red", size: 10 });
  }
}
