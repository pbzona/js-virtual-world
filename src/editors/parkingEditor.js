import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Parking } from "../markings/parking";
import { MarkingEditor } from "./markingEditor";

export class ParkingEditor extends MarkingEditor {
  /**
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(center, directionVector) {
    return new Parking(
      center,
      directionVector,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2,
    );
  }
}
