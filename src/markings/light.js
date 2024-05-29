import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";
import { add, lerp2D, perpendicular, scale } from "../math/utils";

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

    const green = lerp2D(line.p1, line.p2, 0.25);
    const yellow = lerp2D(line.p1, line.p2, 0.5);
    const red = lerp2D(line.p1, line.p2, 0.75);

    new Segment(red, green).draw(ctx, {
      width: 18,
      cap: "round",
    });

    green.draw(ctx, { color: "#2d4", size: this.height * 0.16 });
    yellow.draw(ctx, { color: "#fd2", size: this.height * 0.16 });
    red.draw(ctx, { color: "#e44", size: this.height * 0.16 });
  }
}
