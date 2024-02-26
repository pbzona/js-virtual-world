import { GraphEditor } from "../editors/graphEditor";
import { Viewport } from "../lib/viewport";

// Get UI buttons
const disposeBtn = document.getElementById("disposeBtn");
const saveBtn = document.getElementById("saveBtn");
const graphBtn = document.getElementById("graphBtn");
const stopBtn = document.getElementById("stopBtn");

/**
 *
 * @param {GraphEditor} graphEditor Graph editor whose operation will be affected by the UI
 * @param {Viewport} viewport Viewport that will be affected by the UI
 */
export const initializeUI = (graphEditor, stopEditor, viewport) => {
  // UI Actions
  const disposeGraph = () => {
    graphEditor.dispose();
    viewport.clear();
  };

  const saveGraph = () => {
    window.localStorage.setItem("graph", JSON.stringify(graphEditor.graph));

    const { zoom, offset } = viewport;
    window.localStorage.setItem("viewport", JSON.stringify({ zoom, offset }));
  };

  const setMode = (mode) => {
    disableEditors();

    switch (mode) {
      case "graph":
        graphBtn.style.backgroundColor = "white";
        graphBtn.style.filter = "";
        graphEditor.enable();
        break;
      case "stop":
        stopBtn.style.backgroundColor = "white";
        stopBtn.style.filter = "none";
        stopEditor.enable();
        break;
    }
  };

  const disableEditors = () => {
    graphBtn.style.backgroundColor = "gray";
    graphBtn.style.filter = "grayscale(100%)";
    graphEditor.disable();

    stopBtn.style.backgroundColor = "gray";
    stopBtn.style.filter = "grayscale(100%)";
    stopEditor.disable();
  };

  // Prepare the buttons
  disposeBtn.addEventListener("click", () =>
    disposeGraph(graphEditor, viewport),
  );
  saveBtn.addEventListener("click", () =>
    saveGraph(graphEditor.graph, viewport),
  );
  graphBtn.addEventListener("click", () => setMode("graph"));
  stopBtn.addEventListener("click", () => setMode("stop"));

  // Initial state
  setMode("graph");
};
