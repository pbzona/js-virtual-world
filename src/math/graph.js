import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Graph {
  /**
   *
   * @param {Point[]} points - Points/nodes for the graph
   * @param {Segment[]} segments - Segments/edges for the graph
   */
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  /**
   * Construct a new Graph from an object representation retrieved from localStorage
   * @param {*} info An object representing the points and segments in a graph
   * @returns {Graph}
   */
  static load(info) {
    const points = info.points.map((p) => new Point(p.x, p.y));
    const segments = info.segments.map(
      (s) =>
        new Segment(
          points.find((p) => p.equals(s.p1)),
          points.find((p) => p.equals(s.p2)),
        ),
    );

    return new Graph(points, segments);
  }

  addPoint(point) {
    this.points.push(point);
  }

  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  removePoint(point) {
    const segs = this.getSegmentsWithPoint(point);
    for (const seg of segs) {
      this.removeSegment(seg);
    }

    this.points.splice(this.points.indexOf(point), 1);
  }

  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  addSegment(seg) {
    this.segments.push(seg);
  }

  tryAddSegment(seg) {
    if (!this.containsSegment(seg)) {
      this.addSegment(seg);
      return true;
    }
    return false;
  }

  removeSegment(seg) {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }

  containsSegment(seg) {
    return this.segments.find((s) => s.equals(seg));
  }

  getSegmentsWithPoint(point) {
    return this.segments.filter((seg) => seg.includes(point));
  }

  dispose() {
    // Setting lengths to zero instead of reassigning [] keeps the same array object, in case it's referenced elsewhere
    this.segments.length = 0;
    this.points.length = 0;
  }

  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}
