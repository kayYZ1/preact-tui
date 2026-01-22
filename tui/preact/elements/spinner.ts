import type { ElementHandler, Position, SpinnerInstance } from "../types/index";
import type { LayoutHandler } from "./index";

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export const SpinnerLayout: LayoutHandler<SpinnerInstance> = (instance) => {
	instance.yogaNode.setWidth(1);
	instance.yogaNode.setHeight(1);
};

export const SpinnerElement: ElementHandler<SpinnerInstance> = (instance, context): Position[] => {
	const x = context.parentX + instance.yogaNode.getComputedLeft();
	const y = context.parentY + instance.yogaNode.getComputedTop();

	const { color = "white", interval = 80 } = instance.props;
	const frameIndex = Math.floor(Date.now() / interval) % BRAILLE_FRAMES.length;
	const frame = BRAILLE_FRAMES[frameIndex];

	const baseColor = Bun.color(color, "ansi") ?? "\x1b[37m";
	const resetCode = "\x1b[0m";

	return [
		{
			x: Math.round(x),
			y: Math.round(y),
			text: `${baseColor}${frame}${resetCode}`,
		},
	];
};
