import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";

export function initializeUI(graph, canvas, ctx) {
  const addRandomPointButton = document.getElementById("addRandomPoint");
  const addRandomSegmentButton = document.getElementById("addRandomSegment");

  addRandomPointButton.addEventListener("click", () =>
    addRandomPoint(graph, canvas, ctx),
  );
  addRandomSegmentButton.addEventListener("click", () =>
    addRandomSegment(graph, canvas, ctx),
  );
}

function addRandomPoint(graph, canvas, ctx, retries = 3) {
  const success = graph.tryAddPoint(
    new Point(Math.random() * canvas.width, Math.random() * canvas.height),
  );

  if (!success && retries > 0) {
    addRandomPoint(graph, canvas, ctx, retries - 1);
  }

  console.log("Add random point:", success);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}

function addRandomSegment(graph, canvas, ctx, retries = 5) {
  const index1 = Math.floor(Math.random() * graph.points.length);
  const index2 = Math.floor(Math.random() * graph.points.length);

  const success = graph.tryAddSegment(
    new Segment(graph.points[index1], graph.points[index2]),
  );

  if (!success && retries > 0) {
    addRandomSegment(graph, canvas, ctx, retries - 1);
  }

  console.log("Add random segment:", success);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}
