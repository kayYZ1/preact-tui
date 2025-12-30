import type { ElementHandler, Instance, Position } from "../src/types";
import { drawBox } from "@/tui/core/primitives/draw-box";

type BoxInstance = Extract<Instance, { type: "box" }>;

export const boxElement: ElementHandler<BoxInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();
	const positions: Position[] = [];

	if (instance.props.border) {
		const w = instance.yogaNode.getComputedWidth();
		const h = instance.yogaNode.getComputedHeight();
		positions.push(...drawBox(x, y, w, h, instance.props.border, instance.props.borderColor));
	}

	positions.push(...instance.children.flatMap((child) => context.renderInstance(child, x, y)));

	return positions;
};
