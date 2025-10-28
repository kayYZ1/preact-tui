import type { Instance } from "../src/types";

export function renderText(instance: Instance): Array<{ x: number; y: number; text: string }> {
	let text = instance.props.children || "";
	if (typeof instance.props.color === "string") {
		let colorInput = instance.props.color;
		let isBg = false;
		if (colorInput.startsWith("bg")) {
			isBg = true;
			colorInput = colorInput.slice(2).toLowerCase();
		}
		const ansi = Bun.color(colorInput, "ansi");
		if (ansi) {
			if (isBg) {
				// Change foreground to background: 38 -> 48
				const bgAnsi = ansi.replace(/\x1b\[38/, "\x1b[48");
				text = `${bgAnsi}${text}\x1b[0m`;
			} else {
				text = `${ansi}${text}\x1b[0m`;
			}
		}
	}
	if (instance.props.bold) text = `\x1b[1m${text}\x1b[22m`;
	if (instance.props.italic) text = `\x1b[3m${text}\x1b[23m`;
	if (instance.props.underline) text = `\x1b[4m${text}\x1b[24m`;
	if (instance.props.strikethrough) text = `\x1b[9m${text}\x1b[29m`;
	return [
		{
			x: Math.round(instance.yogaNode.getComputedLeft()),
			y: Math.round(instance.yogaNode.getComputedTop()),
			text,
		},
	];
}
