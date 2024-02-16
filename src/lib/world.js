import { Graph } from "../math/graph";
import { Envelope } from "../primitives/envelope";
import { Polygon } from "../primitives/polygon";

export class World {
  /**
   *
   * @param {Graph} graph Graph to use as the basis for road structures
   * @param {number} roadWidth Width of road in pixels
   * @param {number} roadRoundness Number of segments to use when drawing rounded end of envelopes
   */
  constructor(graph, roadWidth = 100, roadRoundness = 6) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    /** @type {Envelope[]} */
    this.envelopes = [];
    /** @type {Segment[]} */
    this.roadBorders = [];

    this.generate();
  }

  /**
   * Create envelopes for each segment of the graph
   * @returns {void}
   */
  generate() {
    this.envelopes.length = 0;

    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roadRoundness),
      );
    }

    // Find all intersections between envelopes
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
  }

  /**
   * Draws envelopes that were created by generate()
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   * @returns {void}
   */
  draw(ctx) {
    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#bbb", stroke: "#bbb", lineWidth: 16 });
    }

    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "white", width: 4 });
    }
  }
}
