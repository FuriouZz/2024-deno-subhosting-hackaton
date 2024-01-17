import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";

hydrateRoot(
  document.querySelector("main") as HTMLElement,
  <StrictMode>
    <App />
  </StrictMode>,
);
