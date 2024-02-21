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
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 6,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;

    /** @type {Envelope[]} */
    this.envelopes = [];
    /** @type {Segment[]} */
    this.roadBorders = [];

    this.buildings = [];

    this.generate();
  }

  /**
   * Generates the buildings by calculating distance around road and which
   * roads should have buildings along them
   * @returns {Envelope[]}
   */
  #generateBuildings() {
    const tmpEnvelopes = [];
    // Create new larger envelopes around the graph (roadways)
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness,
        ),
      );
    }

    // Get the outline of the larger envelopes, to be used in placing buildings
    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    return guides;
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
    this.buildings = this.#generateBuildings();
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

    for (const building of this.buildings) {
      building.draw(ctx);
    }
  }
}
