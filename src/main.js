import { Graph } from "./math/graph";

import { GraphEditor } from "./lib/graphEditor";
import { Viewport } from "./lib/viewport";
import { World } from "./lib/world";

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

const world = new World(graph);
const graphEditor = new GraphEditor(viewport, graph);

document.onload = initializeUI(graphEditor, viewport);
animate();

function animate() {
  const ctx = canvas.getContext("2d");

  viewport.reset();
  world.generate();
  world.draw(ctx);
  graphEditor.display();

  requestAnimationFrame(animate);
}
