import { wrapText } from "@/tui/core/primitives/wrap-text";
import { formatText } from "@/tui/core/primitives/format-text";
import type { ElementHandler, Instance, Position } from "../types/index";

type TextInstance = Extract<Instance, { type: "text" }>;

export const textElement: ElementHandler<TextInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();
	const width = instance.yogaNode.getComputedWidth();
	const height = instance.yogaNode.getComputedHeight();
	const text = instance.props.children || "";

	// Wrap text to available width
	const lines = wrapText(text, Math.ceil(width));

	const positions: Position[] = [];
	// Limit to height constraint
	const displayLines = lines.slice(0, height);

	for (let i = 0; i < displayLines.length; i++) {
		const line = displayLines[i];
		const formattedLine = formatText({
			...instance,
			props: { ...instance.props, children: line },
		});

		positions.push({
			x: Math.round(x),
			y: Math.round(y) + i,
			text: formattedLine,
		});
	}

	return positions;
};
