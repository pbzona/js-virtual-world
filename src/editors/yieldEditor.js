import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Yield } from "../markings/yield";
import { MarkingEditor } from "./markingEditor";

export class YieldEditor extends MarkingEditor {
  /**
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(center, directionVector) {
    return new Yield(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
    );
  }
}
