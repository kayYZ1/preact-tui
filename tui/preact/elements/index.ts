import type { Instance, ElementHandler } from "../src/types";
import { boxElement } from "./box";
import { textElement } from "./text";

type InstanceType = Instance["type"];

const elements: Record<InstanceType, ElementHandler<Instance>> = {
	box: boxElement as ElementHandler<Instance>,
	text: textElement as ElementHandler<Instance>,
};

export function getElement(type: InstanceType): ElementHandler {
	const element = elements[type];
	if (!element) {
		throw new Error(`No element found for type: ${type}`);
	}
	return element;
}

export function registerElement(type: string, element: ElementHandler): void {
	(elements as Record<string, ElementHandler>)[type] = element;
}

export { boxElement, textElement };
