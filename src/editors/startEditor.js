import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Start } from "../markings/start";
import { MarkingEditor } from "./markingEditor";

export class StartEditor extends MarkingEditor {
  /**
   * Create a new StartEditor
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the start editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(center, directionVector) {
    return new Start(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
    );
  }
}
