import { Graph } from "./math/graph";

import { GraphEditor } from "./editors/graphEditor";
import { StopEditor } from "./editors/stopEditor";
import { CrossingEditor } from "./editors/crossingEditor";
import { StartEditor } from "./editors/startEditor";
import { TargetEditor } from "./editors/targetEditor";
import { ParkingEditor } from "./editors/parkingEditor";
import { LightEditor } from "./editors/lightEditor";
import { YieldEditor } from "./editors/yieldEditor";
import { Viewport } from "./lib/viewport";
import { World } from "./lib/world";

import { initializeUI } from "./ui/ui";
import { scale } from "./math/utils";

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

const graphBtn = document.getElementById("graphBtn");
const stopBtn = document.getElementById("stopBtn");
const crossingBtn = document.getElementById("crossingBtn");
const startBtn = document.getElementById("startBtn");
const parkingBtn = document.getElementById("parkingBtn");
const lightBtn = document.getElementById("lightBtn");
const targetBtn = document.getElementById("targetBtn");
const yieldBtn = document.getElementById("yieldBtn");

const tools = {
  graph: { editor: new GraphEditor(viewport, graph), button: graphBtn },
  stop: { editor: new StopEditor(viewport, world), button: stopBtn },
  crossing: {
    editor: new CrossingEditor(viewport, world),
    button: crossingBtn,
  },
  start: { editor: new StartEditor(viewport, world), button: startBtn },
  target: { editor: new TargetEditor(viewport, world), button: targetBtn },
  parking: { editor: new ParkingEditor(viewport, world), button: parkingBtn },
  light: { editor: new LightEditor(viewport, world), button: lightBtn },
  yield: { editor: new YieldEditor(viewport, world), button: yieldBtn },
};

document.onload = initializeUI(tools, viewport);

// Only regenerate graph if it has changed
let oldGraphHash = graph.hash();

animate();

function animate() {
  const ctx = canvas.getContext("2d");

  viewport.reset();
  if (graph.hash() !== oldGraphHash) {
    world.generate();
    oldGraphHash = graph.hash();
  }

  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(ctx, viewPoint);

  ctx.globalAlpha = 0.3;

  for (const tool of Object.values(tools)) {
    tool.editor.display();
  }

  requestAnimationFrame(animate);
}
