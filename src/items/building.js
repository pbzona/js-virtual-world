import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";

import { add, average, getFake3dPoint, scale, subtract } from "../math/utils";

export class Building {
  /**
   * Creates a new Building
   * @param {Polygon} base The shape of the base of the building
   * @param {number} height Max height in pixels
   */
  constructor(base, height = 200) {
    this.base = base;
    this.height = height;
  }

  /**
   * Draw the current instance of Building to the canvas
   * @param {CanvasRenderingContext2D} ctx Context to draw with
   * @param {Point} viewPoint Inverse camera offset for calculating perspective
   */
  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      // add(p, scale(subtract(p, viewPoint), this.heightCoefficient * 0.7)),
      getFake3dPoint(p, viewPoint, this.height * 0.6),
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

    // Calculate midpoints for drawing the angled roof
    const baseMidpoints = [
      average(this.base.points[0], this.base.points[1]),
      average(this.base.points[2], this.base.points[3]),
    ];

    const topMidpoints = baseMidpoints.map((p) =>
      getFake3dPoint(p, viewPoint, this.height),
    );

    // Create the roof polygons
    const roofPolys = [
      new Polygon([
        ceiling.points[0],
        ceiling.points[3],
        topMidpoints[1],
        topMidpoints[0],
      ]),
      new Polygon([
        ceiling.points[2],
        ceiling.points[1],
        topMidpoints[0],
        topMidpoints[1],
      ]),
    ].sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint),
    );

    // Draw polygons that comprise the building
    const buildingColor = "hsl(110 15% 85%)";
    const buildingStroke = "hsl(100 10% 75%)";

    const roofColor = "hsl(350 45% 50%)";
    const roofStroke = "hsl(350 45% 48%)";

    this.base.draw(ctx, {
      fill: buildingColor,
      stroke: "rgb(0, 0, 0, 0.10",
      lineWidth: 24,
    });

    for (const side of sides) {
      side.draw(ctx, {
        fill: buildingColor,
        stroke: buildingStroke,
        lineWidth: 3,
      });
    }

    ceiling.draw(ctx, {
      fill: buildingColor,
      stroke: buildingColor,
      lineWidth: 6,
    });

    for (const poly of roofPolys) {
      poly.draw(ctx, {
        fill: roofColor,
        stroke: roofStroke,
        lineWidth: 8,
        join: "round",
      });
    }
  }
}
