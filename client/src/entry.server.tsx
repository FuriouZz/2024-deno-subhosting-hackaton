import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";

export function render() {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return { head: "", html };
}
