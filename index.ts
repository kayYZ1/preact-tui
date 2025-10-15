import { h } from "preact";
import { render } from "./preact/renderer";
import { Terminal } from "./core/terminal";

const App = () =>
	h("box", { flexDirection: "row" }, [
		h("text", { color: "green" }, "Hello"),
		h("text", { bold: true }, "World"),
	]);

const term = new Terminal();
render(h(App, {}), term);

// Wait for 2 seconds to keep output visible
await new Promise((resolve) => setTimeout(resolve, 2000));
