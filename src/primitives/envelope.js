import { Polygon } from "./polygon";
import { Segment } from "./segment";
import { translate, angle, subtract } from "../math/utils";

export class Envelope {
  /**
   * @param {Segment} skeleton Segment/skeleton around which to draw the envelope
   * @param {number} width Width in pixels between the sides of the envelope
   * @param {number} roundness Smoothness of curve on the end of the skeleton
   */
  constructor(skeleton, width, roundness = 1) {
    this.skeleton = skeleton;
    this.poly = this.#generatePolygon(width, roundness);
  }

  /**
   * @param {number} width Distance from the skeleton to generate points
   * @param {number} roundness Smoothness of the curves on the ends of the skeleton
   * @returns {Polygon}
   */
  #generatePolygon(width, roundness) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = angle(subtract(p1, p2)); // Angle of the segment

    // +/- 90deg offset from the angle
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    // Generate rounded ends
    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const epsilon = step / 2; // Avoids floating point errors where `i` doesn't quite reach alpha_cw

    for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + epsilon; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   * @param {*} options Object containing options to use when drawing the polygon
   */
  draw(ctx, options) {
    this.poly.draw(ctx, options);
  }
}
