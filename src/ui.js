import { Point } from "./primitives/point";

export function initializeUI(graph, canvas, ctx) {
  const addRandomPointButton = document.getElementById("addRandomPoint");

  addRandomPointButton.addEventListener("click", () =>
    addRandomPoint(graph, canvas, ctx),
  );
}

function addRandomPoint(graph, canvas, ctx) {
  const success = graph.tryAddPoint(
    new Point(Math.random() * canvas.width, Math.random() * canvas.height),
  );

  console.log(success);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}
