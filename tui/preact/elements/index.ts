import type { ElementHandler, Instance } from "../src/types";
import { boxElement } from "./box";
import { textElement } from "./text";
import { textInputElement } from "./text-input";

type InstanceType = Instance["type"];

const elements: Record<InstanceType, ElementHandler<Instance>> = {
	box: boxElement as ElementHandler<Instance>,
	text: textElement as ElementHandler<Instance>,
	textInput: textInputElement as ElementHandler<Instance>,
};

export function getElement(type: string): ElementHandler {
	const element = (elements as Record<string, ElementHandler>)[type];
	if (!element) {
		throw new Error(`No element found for type: ${type}`);
	}
	return element;
}

export function registerElement(type: string, element: ElementHandler): void {
	(elements as Record<string, ElementHandler>)[type] = element;
}

export { boxElement, textElement, textInputElement };
