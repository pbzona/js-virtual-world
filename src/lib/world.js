import { Envelope } from "../primitives/envelope";

export class World {
  constructor(graph, roadWidth = 100, roadRoundness = 6) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    this.envelopes = [];

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
  }

  /**
   * Draws envelopes that were created by generate()
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   * @returns {void}
   */
  draw(ctx) {
    for (const env of this.envelopes) {
      env.draw(ctx);
    }
  }
}
