import { GraphEditor } from "../lib/graphEditor";
import { Viewport } from "../lib/viewport";

/**
 *
 * @param {GraphEditor} graphEditor Graph editor whose operation will be affected by the UI
 * @param {Viewport} viewport Viewport that will be affected by the UI
 */
export const initializeUI = (graphEditor, viewport) => {
  document
    .getElementById("disposeBtn")
    .addEventListener("click", () => disposeGraph(graphEditor, viewport));
  document
    .getElementById("saveBtn")
    .addEventListener("click", () => saveGraph(graphEditor.graph, viewport));
};

const disposeGraph = (graphEditor, viewport) => {
  graphEditor.dispose();
  viewport.clear();
};

const saveGraph = (graph, viewport) => {
  window.localStorage.setItem("graph", JSON.stringify(graph));

  const { zoom, offset } = viewport;
  window.localStorage.setItem("viewport", JSON.stringify({ zoom, offset }));
};
