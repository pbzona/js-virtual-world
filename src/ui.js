import { Point } from "./primitives/point";

export function initializeUI(graph, canvas, ctx) {
  const addRandomPointButton = document.getElementById("addRandomPoint");

  addRandomPointButton.addEventListener("click", () =>
    addRandomPoint(graph, canvas, ctx),
  );
}

function addRandomPoint(graph, canvas, ctx) {
  graph.addPoint(
    new Point(Math.random() * canvas.width, Math.random() * canvas.height),
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}
