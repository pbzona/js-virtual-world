import { Graph } from "./math/graph";
import { GraphEditor } from "./lib/graphEditor";
import { Viewport } from "./lib/viewport";
import { initializeUI } from "./ui/ui";

/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("myCanvas");
canvas.width = 600;
canvas.height = 600;

// Load existing graph from localstorage if it exists
const savedGraph = window.localStorage.getItem("graph");
const graphInfo = savedGraph ? JSON.parse(savedGraph) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);

document.onload = initializeUI(graphEditor);
animate();

function animate() {
  viewport.reset();
  graphEditor.display();

  requestAnimationFrame(animate);
}
