import { Point } from "../primitives/point";
import { Marking } from "./marking";

import { angle } from "../math/utils";

export class Start extends Marking {
  /**
   * Stop marking to be placed on a road segment
   * @param {Point} center Center point of the marking
   * @param {Point} directionVector Directional vector of the segment on which the marking sits
   * @param {number} width Width of the marking polygon
   * @param {number} height Height of the marking polygon
   */
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.img = new Image();
    this.img.src = new URL("../img/car.png", import.meta.url);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);

    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

    ctx.restore();
  }
}
