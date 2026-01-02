import type { ElementHandler, Instance, Position } from "../src/types";

type TextInputInstance = Extract<Instance, { type: "textInput" }>;

interface CursorInfo {
	x: number;
	y: number;
	visible: boolean;
}

let pendingCursor: CursorInfo | null = null;

export function getPendingCursor(): CursorInfo | null {
	return pendingCursor;
}

export function clearPendingCursor() {
	pendingCursor = null;
}

export const textInputElement: ElementHandler<TextInputInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();
	const width = instance.yogaNode.getComputedWidth();

	const value = instance.props.value || "";
	const placeholder = instance.props.placeholder || "";
	const displayText = value || placeholder;
	const isPlaceholder = !value && placeholder;
	const cursorPos = instance.props.cursorPosition ?? value.length;

	let formattedText = displayText.slice(0, width).padEnd(width, " ");

	const colorToUse = isPlaceholder ? instance.props.placeholderColor : instance.props.color;
	if (colorToUse) {
		const ansi = Bun.color(colorToUse, "ansi");
		if (ansi) {
			formattedText = `${ansi}${formattedText}\x1b[0m`;
		}
	}

	if (instance.props.focused) {
		pendingCursor = {
			x: Math.round(x) + Math.min(cursorPos, width - 1),
			y: Math.round(y),
			visible: true,
		};
	}

	return [
		{
			x: Math.round(x),
			y: Math.round(y),
			text: formattedText,
		},
	];
};
