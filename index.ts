import { h } from "preact";
import { render } from "./preact/renderer";
import { Terminal } from "./core/terminal";

const App = () =>
	h("box", { flex: true, gap: 5, flexDirection: "row" }, [
		h("text", { color: "red" }, "Hello"),
		h("text", { bold: true, italic: true }, "World"),
	]);

const term = new Terminal();
render(h(App, {}), term);

process.on("SIGINT", () => {
	term.clear();
	process.exit();
});
process.stdin.resume();
