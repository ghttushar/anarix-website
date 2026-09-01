// Admin CMS — a standalone SPA, deliberately separate from the public
// marketing site's TanStack Start app (own index.html, own React root, own
// bundle). No auth layer yet: this is scoped for local/internal use only —
// add a real auth gate here before any real deployment.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
