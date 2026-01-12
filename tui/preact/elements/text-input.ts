import { splitText } from "@/tui/core/primitives/wrap-text";
import type { ElementHandler, Instance, Position } from "../types/index";

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
	const widthNum = instance.yogaNode.getComputedWidth();
	const height = instance.yogaNode.getComputedHeight();
	const width = Math.ceil(widthNum);

	const value = instance.props.value || "";
	const placeholder = instance.props.placeholder || "";
	const displayText = value || placeholder;
	const isPlaceholder = !value && placeholder;
	const cursorPos = instance.props.cursorPosition ?? value.length;

	// Calculate cursor line and column based on width
	const cursorLine = Math.floor(cursorPos / width);
	const cursorCol = cursorPos % width;

	// Split text into lines based on width (character-based for inputs)
	const textToSplit = displayText || "";
	const lines = splitText(textToSplit, width);

	// Trim or pad lines to fit height
	const displayLines = lines.slice(0, height);
	while (displayLines.length < height) {
		displayLines.push("");
	}

	const positions: Position[] = [];

	for (let lineIdx = 0; lineIdx < displayLines.length; lineIdx++) {
		const line = displayLines[lineIdx] ?? "";

		let formattedText = line.slice(0, width).padEnd(width, " ");

		const colorToUse = isPlaceholder ? instance.props.placeholderColor : instance.props.color;
		if (colorToUse) {
			const ansi = Bun.color(colorToUse, "ansi");
			if (ansi) {
				formattedText = `${ansi}${formattedText}\x1b[0m`;
			}
		}

		positions.push({
			x: Math.round(x),
			y: Math.round(y) + lineIdx,
			text: formattedText,
		});
	}

	// Set cursor position if focused and within visible area
	if (instance.props.focused && cursorLine < height) {
		pendingCursor = {
			x: Math.round(x) + cursorCol,
			y: Math.round(y) + cursorLine,
			visible: true,
		};
	}

	return positions;
};
