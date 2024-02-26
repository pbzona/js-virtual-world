import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { getNearestPoint } from "../math/utils";
import { Graph } from "../math/graph";
import { Viewport } from "./viewport";

const SELECTION_SENSITIVITY = 15;

export class GraphEditor {
  /**
   * @param {Viewport} viewport - Viewport to use for editing the graph
   * @param {Graph} graph - Graph to edit and render
   */
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.ctx = this.canvas.getContext("2d");

    /** @type {Point} */
    this.selected = null;
    /** @type {Point} */
    this.hovered = null;
    this.dragging = false;

    this.mouse = null;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
    this.selected = false;
    this.hovered = false;
  }

  #addEventListeners() {
    // Need to store these as attributes so they can be properly removed
    // eg need to keep a reference to the bound functions
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundMouseUp = () => (this.dragging = false);
    this.boundContextMenu = (event) => event.preventDefault();

    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("mouseup", this.boundMouseUp);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("mouseup", this.boundMouseUp);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }

  /**
   * @param {Event} event - Pressing down of a button on the mouse
   */
  #handleMouseDown(event) {
    // Right click
    if (event.button === 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }

    // Left click
    if (event.button === 0) {
      this.hovered = getNearestPoint(
        this.mouse,
        this.graph.points,
        SELECTION_SENSITIVITY * this.viewport.zoom,
      );

      if (this.hovered) {
        this.#selectPoint(this.hovered);
        this.dragging = true;
        return;
      }

      this.graph.addPoint(this.mouse);

      this.#selectPoint(this.mouse);
      this.hovered = this.mouse;
    }
  }

  /**
   * @param {MouseEvent} event - Movement of the mouse cursor
   */
  #handleMouseMove(event) {
    this.mouse = this.viewport.getMouse(event, true);
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      SELECTION_SENSITIVITY * this.viewport.zoom,
    );

    if (this.dragging && this.selected) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  /**
   * @param {Point} point - Point object to select, ie set as this.selected
   */
  #selectPoint(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }

    this.selected = point;
  }

  /**
   * @param {Point} point Point to remove from the graph
   */
  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  /**
   * Draws the graph to the canvas for its current state
   */
  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });

      const intent = this.hovered ? this.hovered : this.mouse;
      new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
    }
  }

  /**
   * Dispose of the graph data and reset selected/hovered nodes
   */
  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }
}
