import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/fraunces/opsz.css"; // opsz axis: display cut at large optical sizes
// Font-tester candidates (remove the unused ones once a font is chosen):
import "@fontsource-variable/newsreader/index.css";
import "@fontsource/instrument-serif/index.css";
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
