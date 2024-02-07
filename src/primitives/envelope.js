import { Polygon } from "./polygon";
import { Segment } from "./segment";
import { translate, angle, subtract } from "../math/utils";

export class Envelope {
  /**
   * @param {Segment} skeleton Segment/skeleton around which to draw the envelope
   * @param {number} width Width in pixels between the sides of the envelope
   */
  constructor(skeleton, width) {
    this.skeleton = skeleton;
    this.poly = this.#generatePolygon(width);
  }

  #generatePolygon(width) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = angle(subtract(p1, p2)); // Angle of the segment

    // +/- 90deg offset from the angle
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    // Generate points adjacent by 90deg on either side of the points at a distance of `radius`
    const p1_ccw = translate(p1, alpha_ccw, radius);
    const p2_ccw = translate(p2, alpha_ccw, radius);
    const p2_cw = translate(p2, alpha_cw, radius);
    const p1_cw = translate(p1, alpha_cw, radius);

    return new Polygon([p1_ccw, p2_ccw, p2_cw, p1_cw]);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   */
  draw(ctx) {
    this.poly.draw(ctx);
  }
}
