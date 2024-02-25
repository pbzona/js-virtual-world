import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";

import { getFake3dPoint, lerp, lerp2D, translate } from "../math/utils";

export class Tree {
  /**
   * Create a new tree
   * @param {Point} center Center of the tree
   * @param {number} size Size (diameter) of the base of the tree
   * @param {number} height Max height in pixels
   */
  constructor(center, size, height = 160) {
    this.center = center;
    this.size = size;
    this.height = height;

    this.base = this.#generateLevel(center, size);
  }

  /**
   * Create the shape of an individual tree level using pseudo-random values to fuzz the radius
   * @param {Point} point Point to use as the basis for the level
   * @param {number} size Diameter of the level
   * @returns {Polygon} Shape of the level
   */
  #generateLevel(point, size) {
    const points = [];
    const radius = size / 2;

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 20) {
      // Generates a "pseudo-random" number that will remain constant for the same tree
      const pseudoRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius * lerp(0.7, 1, pseudoRandom);

      points.push(translate(point, a, noisyRadius));
    }

    return new Polygon(points);
  }

  /**
   * Draw the Tree instance
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} viewPoint Inverse of the viewport offset; distance from the center of the viewport
   */
  draw(ctx, viewPoint) {
    const top = getFake3dPoint(this.center, viewPoint, this.height);
    const levelCount = 7;

    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount === 0 ? levelCount : levelCount - 1);
      const point = lerp2D(this.center, top, t);

      const color = `rgb(30,${lerp(80, 200, t)},100)`;
      const size = lerp(this.size, 20, t);

      // point.draw(ctx, { size, color });
      const poly = this.#generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: "rgb(0,0,0,0)" });
    }
  }
}
