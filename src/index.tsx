import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";

const root = document.getElementById("root");

const reactRoot = createRoot(root);

reactRoot.render(
  <Router>
    <App />
  </Router>
);
