import type { Instance, ElementRenderer } from "../src/types";
import { renderBox } from "./box";
import { renderText } from "./text";

type InstanceType = Instance["type"];

const renderers: Record<InstanceType, ElementRenderer> = {
	box: renderBox,
	text: renderText,
};

export function getRenderer(type: InstanceType): ElementRenderer {
	const renderer = renderers[type];
	if (!renderer) {
		throw new Error(`No renderer found for element type: ${type}`);
	}
	return renderer;
}

export function registerRenderer(type: string, renderer: ElementRenderer): void {
	(renderers as Record<string, ElementRenderer>)[type] = renderer;
}

export { renderBox, renderText };
