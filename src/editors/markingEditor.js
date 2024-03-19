import { Viewport } from "../lib/viewport";
import { World } from "../lib/world";
import { Stop } from "../markings/stop";

import { getNearestSegment } from "../math/utils";

const SELECTION_SENSITIVITY = 15;

export class MarkingEditor {
  /**
   * Create a new StopEditor
   * @param {Viewport} viewport Viewport
   * @param {World} world World in which the stop editor operates
   */
  constructor(viewport, world, targetSegments) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;
    this.intent = null;

    this.targetSegments = targetSegments;

    this.markings = world.markings;
  }

  // To be overwritten
  createMarking(center, directionVector) {
    return center;
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
  #handleMouseDown(event) {
    if (event.button === 0) {
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }
  }

  /**
   * @param {MouseEvent} event - Movement of the mouse cursor
   */
  #handleMouseMove(event) {
    this.mouse = this.viewport.getMouse(event, true);
    const seg = getNearestSegment(
      this.mouse,
      this.targetSegments,
      SELECTION_SENSITIVITY * this.viewport.zoom,
    );

    if (seg) {
      // Add a point at the mouse location along the segment
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = this.createMarking(proj.point, seg.directionVector());
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
