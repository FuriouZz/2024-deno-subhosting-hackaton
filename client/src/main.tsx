import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.onload = () => {
  createRoot(document.querySelector("main") as HTMLElement).render(<App />);
};
