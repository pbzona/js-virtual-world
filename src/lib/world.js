import { Graph } from "../math/graph";
import { Envelope } from "../primitives/envelope";
import { Polygon } from "../primitives/polygon";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Tree } from "../items/tree";
import { add, scale, lerp, distance, getNearestPoint } from "../math/utils";
import { Building } from "../items/building";
import { Marking } from "../markings/marking";
import { Light } from "../markings/light";

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
    treeSize = 140,
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = treeSize;

    /** @type {Envelope[]} */
    this.envelopes = [];
    /** @type {Segment[]} */
    this.roadBorders = [];

    /** @type {Building[]} */
    this.buildings = [];

    /**@type {Tree[]} */
    this.trees = [];

    /**@type {Segment[]} */
    this.laneGuides = [];

    /**@type {Marking[]} */
    this.markings = [];

    this.frameCount = 0;

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

    // Divide longer building guides into multiple buildings
    const supports = [];
    for (const seg of guides) {
      const len = seg.length() + this.spacing;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing),
      );
      const buildingLength = len / buildingCount - this.spacing;

      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = add(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      // Generate all buildings in a line if the guide is long enough to support it
      for (let i = 2; i <= buildingCount; i++) {
        q1 = add(q2, scale(dir, this.spacing));
        q2 = add(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    /**@type {Polygon[]} */
    const bases = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    const epsilon = 0.001; // Fixes floating point number issue
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].intersectsPoly(bases[j]) ||
          bases[i].distanceToPoint(bases[j]) < this.spacing - epsilon
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases.map((b) => new Building(b));
  }

  /**
   * @param {number} count Total number of trees to generate
   * @returns {Point[]} Array of Points representing the location of trees
   */
  #generateTrees(count = 10) {
    const points = [
      ...this.roadBorders.flatMap((s) => [s.p1, s.p2]),
      ...this.buildings.flatMap((b) => b.base.points),
    ];

    // How far past the below "area" trees can be generated
    const addedSpace = this.treeSize * 2;

    // The leftmost, rightmost, topmost, and bottommost points of the set of roads & buildings, plus extra space
    const left = Math.min(...points.map((p) => p.x)) - addedSpace;
    const right = Math.max(...points.map((p) => p.x)) + addedSpace;
    const top = Math.min(...points.map((p) => p.y)) - addedSpace;
    const bottom = Math.max(...points.map((p) => p.y)) + addedSpace;

    // Areas trees should not be placed
    const illegalPolys = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.poly),
    ];

    const trees = [];

    // Counts tree generation attempts, up to the max value
    let tryCount = 0;
    const maxTries = 30;

    while (tryCount < maxTries) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random()),
      );

      let keep = true;
      for (const poly of illegalPolys) {
        if (
          poly.containsPoint(p) ||
          poly.distanceToPoint(p) < this.treeSize / 2 // Indirect check for intersection with buildings and roads
        ) {
          keep = false;
          break;
        }
      }

      // Skip trees that are too close to each other
      if (keep) {
        for (const tree of trees) {
          if (distance(tree.center, p) < this.treeSize * 1.1) {
            keep = false;
            break;
          }
        }
      }

      // Skip trees that are too far away from roads and buildings
      if (keep) {
        let closeToSomething = false;
        for (const poly of illegalPolys) {
          if (poly.distanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      if (keep) {
        trees.push(new Tree(p, this.treeSize));
        tryCount = 0;
      }

      tryCount++;
    }
    return trees;
  }

  #generateLaneGuides() {
    const tmpEnvelopes = [];
    // Create new larger envelopes around the graph (roadways)
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(seg, this.roadWidth / 2, this.roadRoundness),
      );
    }

    const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
    return segments;
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
    this.trees = this.graph.hasSegments() ? this.#generateTrees() : [];

    if (this.graph.hasSegments()) {
      this.laneGuides.length = 0;
      this.laneGuides.push(...this.#generateLaneGuides());
    }
  }

  /**
   * Returns all points in the graph with a degree > 2
   * @returns {Point[]}
   */
  #getIntersections() {
    const subset = [];

    for (const point of this.graph.points) {
      let degree = 0;
      for (const seg of this.graph.segments) {
        if (seg.includes(point)) {
          degree++;
        }
      }

      if (degree > 2) {
        subset.push(point);
      }
    }

    if (subset.length > 0) {
      return subset;
    }
    // If there are no intersections just return the graph points
    return this.graph.points;
  }

  /**
   * Recalculate the state of traffic lights
   * @returns {void}
   */
  #updateLights() {
    const lights = this.markings.filter((m) => m instanceof Light);
    const controlCenters = [];

    // Find the closest graph point for each light
    for (const light of lights) {
      const p = getNearestPoint(light.center, this.#getIntersections());
      let controlCenter = controlCenters.find((c) => c.equals(p));

      if (!controlCenter) {
        controlCenter = new Point(p.x, p.y);
        controlCenter.lights = [light];
        controlCenters.push(controlCenter);
      } else {
        controlCenter.lights.push(light);
      }
    }

    // Time to display each light color
    const duration = {
      green: 3,
      yellow: 2,
    };

    for (const center of controlCenters) {
      center.ticks = center.lights.length * (duration.green + duration.yellow);
    }

    const tick = Math.floor(this.frameCount / 60);
    for (const center of controlCenters) {
      const cTick = tick % center.ticks;
      const greenYellowIndex = Math.floor(
        cTick / (duration.green + duration.yellow),
      );
      const greenYellowState =
        cTick % (duration.green + duration.yellow) < duration.green
          ? "green"
          : "yellow";

      for (let i = 0; i < center.lights.length; i++) {
        if (i === greenYellowIndex) {
          center.lights[i].state = greenYellowState;
        } else {
          center.lights[i].state = "red";
        }
      }
    }

    this.frameCount++;
  }

  /**
   * Draws envelopes that were created by generate()
   * @param {CanvasRenderingContext2D} ctx Context on which to draw
   * @param {Point} viewPoint Inverse of the camera offset for calculating perspective
   * @returns {void}
   */
  draw(ctx, viewPoint) {
    this.#updateLights();

    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#bbb", stroke: "#bbb", lineWidth: 16 });
    }

    for (const marking of this.markings) {
      marking.draw(ctx);
    }

    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "white", width: 4 });
    }

    const items = [...this.buildings, ...this.trees];

    if (this.graph.hasSegments()) {
      items.sort((a, b) => {
        return (
          b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
        );
      });

      for (const item of items) {
        item.draw(ctx, viewPoint);
      }

      // Debug laneGuides
      // for (const seg of this.laneGuides) {
      //   seg.draw(ctx, { color: "red" });
      // }
    }
  }
}
