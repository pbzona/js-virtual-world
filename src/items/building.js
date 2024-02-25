import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";

export class Building {
  /**
   * Creates a new Building
   * @param {Polygon} base The shape of the base of the building
   * @param {number} heightCoefficient Scalar used for calculating height
   */
  constructor(base, heightCoefficient = 0.4) {
    this.base = base;
    this.heightCoefficient = heightCoefficient;
  }

  /**
   * Draw the current instance of Building to the canvas
   * @param {CanvasRenderingContext2D} ctx Context to draw with
   * @param {Point} viewPoint Inverse camera offset for calculating perspective
   */
  draw(ctx, viewPoint) {
    this.base.draw(ctx, { fill: "white", stroke: "#aaa" });
  }
}
