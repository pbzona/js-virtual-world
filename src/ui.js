import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";

export function initializeUI(graph, canvas, ctx) {
  const addRandomPointButton = document.getElementById("addRandomPoint");
  const addRandomSegmentButton = document.getElementById("addRandomSegment");
  const removeRandomSegmentButton = document.getElementById(
    "removeRandomSegment",
  );
  const removeRandomPointButton = document.getElementById("removeRandomPoint");

  addRandomPointButton.addEventListener("click", () =>
    addRandomPoint(graph, canvas, ctx),
  );
  addRandomSegmentButton.addEventListener("click", () =>
    addRandomSegment(graph, canvas, ctx),
  );
  removeRandomSegmentButton.addEventListener("click", () =>
    removeRandomSegment(graph, canvas, ctx),
  );
  removeRandomPointButton.addEventListener("click", () =>
    removeRandomPoint(graph, canvas, ctx),
  );
}

function addRandomPoint(graph, canvas, ctx, retries = 3) {
  const success = graph.tryAddPoint(
    new Point(Math.random() * canvas.width, Math.random() * canvas.height),
  );

  if (!success && retries > 0) {
    addRandomPoint(graph, canvas, ctx, retries - 1);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}

function addRandomSegment(graph, canvas, ctx, retries = 5) {
  if (graph.points.length < 2) {
    console.error("Not enough points to create a segment");
    return;
  }

  const index1 = Math.floor(Math.random() * graph.points.length);
  const index2 = Math.floor(Math.random() * graph.points.length);

  const success = graph.tryAddSegment(
    new Segment(graph.points[index1], graph.points[index2]),
  );

  if (!success && retries > 0) {
    addRandomSegment(graph, canvas, ctx, retries - 1);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}

function removeRandomSegment(graph, canvas, ctx) {
  if (graph.segments.length === 0) {
    console.warn("No segments in this graph");
    return;
  }

  const index = Math.floor(Math.random() * graph.segments.length);
  graph.removeSegment(graph.segments[index]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}

function removeRandomPoint(graph, canvas, ctx) {
  if (graph.points.length === 0) {
    console.warn("No points in this graph");
    return;
  }

  const index = Math.floor(Math.random() * graph.points.length);
  graph.removePoint(graph.points[index]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}
