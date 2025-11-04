import { h } from "preact";
import { render } from "./preact/renderer";
import { Terminal } from "./core/terminal";

const App = () =>
	h("box", { flex: true, flexDirection: "column" }, [
		h("text", { color: "red", strikethrough: true }, "Hello"),
		h("text", { bold: true, italic: true }, "World"),
		h("box", { flex: true, flexDirection: "row", justifyContent: "center", gap: 4 }, [
			h("text", { color: "orange", underline: true }, "Within"),
			h("text", { color: "yellow" }, "a box"),
		]),
	]);

const term = new Terminal();
render(h(App, {}), term);

process.on("SIGINT", () => {
	term.clear();
	process.exit();
});
process.stdin.resume();
