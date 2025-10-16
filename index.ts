import { h } from "preact";
import { render } from "./preact/renderer";
import { Terminal } from "./core/terminal";

const App = () =>
	h("box", { flexDirection: "row" }, [
		h("text", { color: "red" }, "Hello"),
		h("text", { bold: true }, "World"),
	]);

const term = new Terminal();
render(h(App, {}), term);

process.on('SIGINT', () => {
  term.clear();
  process.exit();
})
process.stdin.resume();
