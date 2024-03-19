import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Stop } from "../markings/stop";
import { MarkingEditor } from "./markingEditor";

export class StopEditor extends MarkingEditor {
  /**
   * Create a new StopEditor
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(center, directionVector) {
    return new Stop(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
    );
  }
}
