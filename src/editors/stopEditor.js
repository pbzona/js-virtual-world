import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Stop } from "../markings/stop";

import { getNearestSegment } from "../math/utils";

const SELECTION_SENSITIVITY = 15;

export class StopEditor {
  /**
   * Create a new StopEditor
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;
    this.intent = null;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
  }

  #addEventListeners() {
    // Need to store these as attributes so they can be properly removed
    // eg need to keep a reference to the bound functions
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundContextMenu = (event) => event.preventDefault();

    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }

  /**
   * @param {Event} event - Pressing down of a button on the mouse
   */
  #handleMouseDown(event) {}

  /**
   * @param {MouseEvent} event - Movement of the mouse cursor
   */
  #handleMouseMove(event) {
    this.mouse = this.viewport.getMouse(event, true);
    const seg = getNearestSegment(
      this.mouse,
      this.world.laneGuides,
      SELECTION_SENSITIVITY * this.viewport.zoom,
    );

    if (seg) {
      // Add a point at the mouse location along the segment
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = new Stop(
          proj.point,
          seg.directionVector(),
          this.world.roadWidth / 2,
          this.world.roadWidth / 2,
          this.ctx,
        );
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}
