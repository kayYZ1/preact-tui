import { h } from "preact";
import { render } from "./preact/renderer";
import { Terminal } from "./core/terminal";

const App = () =>
	h("box", { flex: true, flexDirection: "row", gap: 2 }, [
		h("text", { color: "red", strikethrough: true }, "Hello"),
		h("text", { bold: true, italic: true }, "World"),
	]);

const term = new Terminal();
render(h(App, {}), term);

process.on("SIGINT", () => {
	term.clear();
	process.exit();
});
process.stdin.resume();
