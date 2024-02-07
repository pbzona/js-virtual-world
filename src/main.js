import { Graph } from "./math/graph";
import { GraphEditor } from "./lib/graphEditor";
import { Viewport } from "./lib/viewport";
import { Envelope } from "./primitives/envelope";
import { initializeUI } from "./ui/ui";

/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("myCanvas");
canvas.width = 600;
canvas.height = 600;

// Load existing graph from localstorage if it exists
const savedGraph = window.localStorage.getItem("graph");
const graphInfo = savedGraph ? JSON.parse(savedGraph) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

// Load existing viewport from localstorage if it exists
const savedViewport = window.localStorage.getItem("viewport");
const viewportInfo = savedViewport ? JSON.parse(savedViewport) : null;
const viewport = viewportInfo
  ? Viewport.load(viewportInfo, canvas)
  : new Viewport(canvas);

const graphEditor = new GraphEditor(viewport, graph);

document.onload = initializeUI(graphEditor, viewport);
animate();

function animate() {
  viewport.reset();
  graphEditor.display();

  for (const seg of graph.segments) {
    new Envelope(seg, 80, 10).draw(canvas.getContext("2d"));
  }

  requestAnimationFrame(animate);
}
