import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";

import { add, scale, subtract } from "../math/utils";

export class Building {
  /**
   * Creates a new Building
   * @param {Polygon} base The shape of the base of the building
   * @param {number} heightCoefficient Scalar used for calculating height
   */
  constructor(base, heightCoefficient = 0.35) {
    this.base = base;
    this.heightCoefficient = heightCoefficient;
  }

  /**
   * Draw the current instance of Building to the canvas
   * @param {CanvasRenderingContext2D} ctx Context to draw with
   * @param {Point} viewPoint Inverse camera offset for calculating perspective
   */
  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoefficient)),
    );
    const ceiling = new Polygon(topPoints);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length; // Last point will have the first point as "next"

      const poly = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);

      sides.push(poly);
    }

    // Draw sides farthest from the viewpoint first to avoid weird overlap
    sides.sort((a, b) => {
      return b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint);
    });

    const buildingColor = "hsl(110 15% 85%)";
    const buildingStroke = "hsl(100 10% 75%)";

    this.base.draw(ctx, { fill: buildingColor, stroke: buildingStroke });
    for (const side of sides) {
      side.draw(ctx, { fill: buildingColor, stroke: buildingStroke });
    }
    ceiling.draw(ctx, { fill: buildingColor, stroke: buildingStroke });
  }
}
