import { formatText } from "../../core/utils/format-text";
import type { Instance, Position, RenderContext, ElementRenderer } from "../src/types";

type TextInstance = Extract<Instance, { type: "text" }>;

export const renderText: ElementRenderer<TextInstance> = (instance, context): Position[] => {
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
