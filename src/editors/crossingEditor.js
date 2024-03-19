import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Crossing } from "../markings/crossing";
import { MarkingEditor } from "./markingEditor";

export class CrossingEditor extends MarkingEditor {
  /**
   * Create a new CrossingEditor
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the crossing editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.graph.segments);
  }

  createMarking(center, directionVector) {
    return new Crossing(
      center,
      directionVector,
      this.world.roadWidth,
      this.world.roadWidth / 2,
    );
  }
}
