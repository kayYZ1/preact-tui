import { formatText } from "@/tui/core/primitives/format-text";
import { wrapText } from "@/tui/core/primitives/wrap-text";
import type { ElementHandler, Position, TextInstance } from "../types/index";
import type { LayoutHandler } from "./index";

export const textLayout: LayoutHandler<TextInstance> = (instance) => {
	const { width, height, flex } = instance.props;

	if (flex) instance.yogaNode.setFlex(Number(flex));
	if (width) instance.yogaNode.setWidth(width);

	if (height !== undefined) {
		instance.yogaNode.setHeight(height);
	} else {
		instance.yogaNode.setMeasureFunc((availableWidth) => {
			const text = instance.props.children || "";
			const w = Math.floor(availableWidth);
			if (w <= 0 || !Number.isFinite(availableWidth)) {
				return { width: text.length, height: 1 };
			}
			const lines = wrapText(text, w);
			const maxLineWidth = Math.max(...lines.map((l) => l.length));
			return { width: maxLineWidth, height: lines.length };
		});
	}
};

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
