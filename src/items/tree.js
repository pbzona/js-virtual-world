import { Point } from "../primitives/point";

export class Tree {
  /**
   * Create a new tree
   * @param {Point} center Center of the tree
   * @param {number} size Size (diameter) of the base of the tree
   */
  constructor(center, size) {
    this.center = center;
    this.size = size;
  }

  draw(ctx) {
    this.center.draw(ctx, { size: this.size, color: "darkgreen" });
  }
}
