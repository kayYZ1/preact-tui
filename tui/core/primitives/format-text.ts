import type { Instance } from "@/tui/preact/types/index.ts";
import { toAnsi } from "./color.ts";

export const formatText = (instance: Instance): string => {
	if (instance.type !== "text") return "";

	let text = instance.props.children || "";

	if (typeof instance.props.color === "string") {
		const ansi = toAnsi(instance.props.color);
		if (ansi) {
			text = `${ansi}${text}\x1b[0m`;
		}
	}
	if (instance.props.bold) text = `\x1b[1m${text}\x1b[22m`;
	if (instance.props.italic) text = `\x1b[3m${text}\x1b[23m`;
	if (instance.props.underline) text = `\x1b[4m${text}\x1b[24m`;
	if (instance.props.strikethrough) text = `\x1b[9m${text}\x1b[29m`;

	return text;
};
