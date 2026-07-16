import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/index.css";
// Full axis set (wght, opsz, SOFT, WONK): the hero's cursor-proximity wonk
// effect needs SOFT/WONK, which the opsz-only subset doesn't carry.
import "@fontsource-variable/fraunces/full.css";
// Font-tester candidates (remove the unused ones once a font is chosen):
import "@fontsource-variable/newsreader/index.css";
import "@fontsource-variable/space-grotesk/index.css";
import "@fontsource-variable/outfit/index.css";
import "./styles/global.css";
import App from "./App";
import { initTheme } from "./theme";

initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
