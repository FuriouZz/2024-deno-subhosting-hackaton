import { render } from "preact";
import App from "./App.tsx";

window.onload = () => {
  render(App(), document.querySelector("main") as HTMLElement);
};

if (__USE_LIVE_RELOAD) {
  import("./lib/live-reload.ts").then((md) => md.default());
}
