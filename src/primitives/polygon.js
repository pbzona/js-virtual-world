import { Point } from "./point";
import { Segment } from "./segment";
import { average, getIntersection } from "../math/utils";
import { getRandomColor } from "../lib/utils";

export class Polygon {
  /**
   * @param {Point[]} points List of points to draw around
   */
  constructor(points) {
    this.points = points;
    this.segments = [];

    for (let i = 1; i <= points.length; i++) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static union(polys) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;

        for (let j = 0; j < polys.length; j++) {
          if (i !== j) {
            if (polys[j].containsSegment(seg)) {
              keep = false;
              break;
            }
          }
        }

        if (keep) {
          keptSegments.push(seg);
        }
      }
    }
    return keptSegments;
  }

  /**
   * Breaks multiple polygons into segments where they intersect
   * @param {Polygon[]} polys Array of polygons
   * @returns {void}
   */
  static multiBreak(polys) {
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  /**
   *
   * @param {Polygon} poly1 First polygon
   * @param {Polygon} poly2 Second polygon
   * @returns {void}
   */
  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;

    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const int = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2,
        );

        if (int && int.offset !== 1 && int.offset !== 0) {
          const point = new Point(int.x, int.y);

          // Break at intersections
          let aux = segs1[i].p2; // Previous p2
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));

          aux = segs2[j].p2; // Previous p2
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  /**
   * @param {Polygon} poly Polygon to check for intersections
   * @returns {boolean} Boolean indicator of whether the polygons intersect
   */
  intersectsPoly(poly) {
    for (const s1 of this.segments) {
      for (const s2 of poly.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if the given segment's *midpoint* is contained within the shape
   * @param {Segment} seg Segment to check for containment
   * @returns {boolean}
   */
  containsSegment(seg) {
    const midpoint = average(seg.p1, seg.p2);
    return this.containsPoint(midpoint);
  }

  /**
   * Returns a boolean indicating whether a given Point is within the bounds of the current polygon
   * @param {Point} point
   * @returns {boolean}
   */
  containsPoint(point) {
    // This needs to be far away from the point to be tested
    const outerPoint = new Point(-1000, -1000);

    let intersectionCount = 0;
    for (const seg of this.segments) {
      const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
      if (int) {
        intersectionCount++;
      }
    }

    // If the line from inner point to outerpoint has an odd number of intersections, the point is contained in the polygon
    return intersectionCount % 2 === 1;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, {
        // color: getRandomColor(),
        width: 4,
      });

      // seg.p1.draw(ctx, { size: 12 });
      // seg.p2.draw(ctx, { size: 12 });
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx Context to draw
   * @param {*} options Object that defines the polygon's `stroke`, `lineWidth`, and `fill`
   */
  draw(
    ctx,
    { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3)" } = {},
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;

    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
