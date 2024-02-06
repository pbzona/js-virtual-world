import { Point } from "../primitives/point";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export class Viewport {
  /**
   * @param {HTMLCanvasElement} canvas - The canvas to control with the viewport
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.zoom = 1;

    this.#addEventListeners();
  }

  /**
   * @param {MouseEvent} event Mouse event to evaluate as a coordinate pair
   * @returns {Point}
   */
  getMouse(event) {
    return new Point(event.offsetX * this.zoom, event.offsetY * this.zoom);
  }

  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this),
    );
  }

  /**
   * @param {MouseEvent} event Mouse wheel event to use as a control
   */
  #handleMouseWheel(event) {
    const dir = Math.sign(event.deltaY);
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.zoom));
  }
}
