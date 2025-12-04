import type { Instance, Position, RenderContext, ElementRenderer } from "../src/types";

type BoxInstance = Extract<Instance, { type: "box" }>;

export const renderBox: ElementRenderer<BoxInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();

	return instance.children.flatMap((child) => context.renderInstance(child, x, y));
};
