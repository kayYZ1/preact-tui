import { formatText } from "@/tui/core/primitives/format-text";
import type { ElementHandler, Instance, Position } from "../src/types";

type TextInstance = Extract<Instance, { type: "text" }>;

export const textElement: ElementHandler<TextInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();

	return [
		{
			x: Math.round(x),
			y: Math.round(y),
			text: formatText(instance),
		},
	];
};
