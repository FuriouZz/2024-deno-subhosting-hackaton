import * as React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";

if (import.meta.env.SSR) {
  hydrateRoot(
    document.querySelector("main") as HTMLElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  createRoot(document.querySelector("main")!).render(<App />);
}
