import { Point } from "../primitives/point";
import { add, subtract, scale } from "../math/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export class Viewport {
  /**
   * @param {HTMLCanvasElement} canvas - The canvas to control with the viewport
   * @param {*} options - Options to control zoom and offset when loading from storage
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  /**
   * @param {*} info Object to be serialized and used to create the new viewport
   * @param {HTMLCanvasElement} canvas Canvas used to create the new viewport
   */
  static load(info, canvas) {
    const viewport = new Viewport(canvas);

    const { zoom, offset } = info;
    viewport.zoom = zoom;
    viewport.offset = new Point(offset.x, offset.y);

    return viewport;
  }

  /**
   * @param {MouseEvent} event Mouse event to evaluate as a coordinate pair
   * @param {boolean} subtractDragOffset Whether to subtract the mouse offset while dragging
   * @returns {Point}
   */
  getMouse(event, subtractDragOffset = false) {
    const p = new Point(
      (event.offsetX - this.center.x) * this.zoom - this.offset.x,
      (event.offsetY - this.center.y) * this.zoom - this.offset.y,
    );

    return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  /**
   * @returns Cumulative offset between the current overall position (with offset) and the current drag offset
   */
  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  /**
   * Reset the viewport, apply all translations and zoom operations so the graph can prepare to re-render
   */
  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);

    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  /**
   * Set everything back to starting values
   */
  clear() {
    this.zoom = 1;
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.reset();
  }

  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this),
    );
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
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

  /**
   *
   * @param {MouseEvent} event Mouse down event
   */
  #handleMouseDown(event) {
    // Middle button
    if (event.button === 1) {
      this.drag.start = this.getMouse(event);
      this.drag.active = true;
    }
  }

  /**
   *
   * @param {MouseEvent} event Mouse move event
   */
  #handleMouseMove(event) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(event);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
      document.body.style.cursor = "move";
    } else {
      document.body.style.cursor = "default";
    }
  }

  /**
   *
   * @param {MouseEvent} event Mouse up event
   */
  #handleMouseUp(event) {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }
}
