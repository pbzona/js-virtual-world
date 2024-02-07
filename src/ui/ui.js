import { GraphEditor } from "../lib/graphEditor";

/**
 *
 * @param {GraphEditor} graphEditor Graph editor whose operation will be affected by the UI
 */
export const initializeUI = (graphEditor) => {
  document
    .getElementById("disposeBtn")
    .addEventListener("click", () => disposeGraph(graphEditor));
  document
    .getElementById("saveBtn")
    .addEventListener("click", () => saveGraph(graphEditor.graph));
};

const disposeGraph = (graphEditor) => {
  graphEditor.dispose();
};

const saveGraph = (graph) => {
  window.localStorage.setItem("graph", JSON.stringify(graph));
};
