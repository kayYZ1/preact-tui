import { h } from "preact";
import { render } from "./preact/renderer";

const App = () => {
  return h(
    "div",
    null,
    "Hello World!",
    h("div", null, "This is a minimal Preact TUI"),
    h("div", null, "Built with Preact reconciliation"),
  );
};

const app = h(App, null);
render(app as any);

setTimeout(() => {
  process.exit(0);
}, 3000);
