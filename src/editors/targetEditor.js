import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Target } from "../markings/target";
import { MarkingEditor } from "./markingEditor";

export class TargetEditor extends MarkingEditor {
  /**
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(center, directionVector) {
    return new Target(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
    );
  }
}
