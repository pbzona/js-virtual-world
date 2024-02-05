import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { getNearestPoint } from "../math/utils";

const SELECTION_SENSITIVITY = 15;

export class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;
    this.ctx = this.canvas.getContext("2d");

    this.selected = null;
    this.hovered = null;
    this.dragging = false;

    this.mouse = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      // Right click
      if (event.button === 2) {
        if (this.hovered) {
          this.#removePoint(this.hovered);
        } else {
          this.selected = null;
        }
      }

      // Left click
      if (event.button === 0) {
        this.hovered = getNearestPoint(
          this.mouse,
          this.graph.points,
          SELECTION_SENSITIVITY,
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
    });

    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse = new Point(event.offsetX, event.offsetY);
      this.hovered = getNearestPoint(
        this.mouse,
        this.graph.points,
        SELECTION_SENSITIVITY,
      );

      if (this.dragging && this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  #selectPoint(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }

    this.selected = point;
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

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
}
