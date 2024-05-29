import { Viewport } from "../lib/viewport";

// Get UI buttons
const disposeBtn = document.getElementById("disposeBtn");
const saveBtn = document.getElementById("saveBtn");

/**
 *
 * @param {Object} tools Object containing various UI tools
 * @param {Object} tools.graph
 * @param {Object} tools.graph.editor
 * @param {Object} tools.graph.button
 * @param {Object} tools.stop
 * @param {Object} tools.stop.editor
 * @param {Object} tools.stop.button
 * @param {Object} tools.crossing
 * @param {Object} tools.crossing.editor
 * @param {Object} tools.crossing.button
 * @param {Object} tools.start
 * @param {Object} tools.start.editor
 * @param {Object} tools.start.button
 * @param {Object} tools.parking
 * @param {Object} tools.parking.editor
 * @param {Object} tools.parking.button
 * @param {Object} tools.light
 * @param {Object} tools.light.editor
 * @param {Object} tools.light.button
 * @param {Object} tools.target
 * @param {Object} tools.target.editor
 * @param {Object} tools.target.button
 * @param {Object} tools.yield
 * @param {Object} tools.yield.editor
 * @param {Object} tools.yield.button
 * @param {Viewport} viewport Viewport that will be affected by the UI
 */
export const initializeUI = (tools, viewport) => {
  const {
    graph,
    stop,
    crossing,
    start,
    parking,
    light,
    target,
    yield: yieldSign,
  } = tools;

  // UI Actions
  const disposeGraph = () => {
    graph.editor.dispose();
    viewport.clear();
  };

  const saveGraph = () => {
    window.localStorage.setItem("graph", JSON.stringify(graph.editor.graph));

    const { zoom, offset } = viewport;
    window.localStorage.setItem("viewport", JSON.stringify({ zoom, offset }));
  };

  const setMode = (mode) => {
    disableEditors();
    tools[mode].button.style.backgroundColor = "white";
    tools[mode].button.style.filter = "";
    tools[mode].editor.enable();
  };

  const disableEditors = () => {
    for (const tool of Object.values(tools)) {
      tool.button.style.backgroundColor = "gray";
      tool.button.style.filter = "grayscale(100%)";
      tool.editor.disable();
    }
  };

  // Prepare the buttons
  disposeBtn.addEventListener("click", () =>
    disposeGraph(graph.editor, viewport),
  );
  saveBtn.addEventListener("click", () => saveGraph(graph, viewport));
  graph.button.addEventListener("click", () => setMode("graph"));
  stop.button.addEventListener("click", () => setMode("stop"));
  crossing.button.addEventListener("click", () => setMode("crossing"));
  start.button.addEventListener("click", () => setMode("start"));
  parking.button.addEventListener("click", () => setMode("parking"));
  target.button.addEventListener("click", () => setMode("target"));
  yieldSign.button.addEventListener("click", () => setMode("yield"));
  light.button.addEventListener("click", () => setMode("light"));

  // Initial state
  setMode("graph");
};
