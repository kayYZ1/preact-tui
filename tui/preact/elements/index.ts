import { type BaseInstance, type ElementHandler, ElementType } from "../types/index";
import { boxElement, boxLayout } from "./box";
import { textElement, textLayout } from "./text";
import { textInputElement, textInputLayout } from "./text-input";

export { ElementType };

/** Layout function applies Yoga properties to an instance */
export type LayoutHandler<T extends BaseInstance = BaseInstance> = (instance: T) => void;

interface ElementDefinition {
	render: ElementHandler<any>;
	layout: LayoutHandler<any>;
	/** If true, children are processed (like box). If false, children stay in props (like text) */
	hasChildren: boolean;
}

const elements = new Map<string, ElementDefinition>();

/** Register a new element type */
export function registerElement(
	type: string,
	definition: {
		render: ElementHandler<any>;
		layout: LayoutHandler<any>;
		hasChildren?: boolean;
	},
): void {
	elements.set(type, {
		render: definition.render,
		layout: definition.layout,
		hasChildren: definition.hasChildren ?? true,
	});
}

/** Get element definition by type */
export function getElement(type: string): ElementDefinition {
	const element = elements.get(type);
	if (!element) {
		throw new Error(`No element registered for type: ${type}`);
	}
	return element;
}

/** Check if element type is registered */
export function hasElement(type: string): boolean {
	return elements.has(type);
}

// Register built-in elements
registerElement(ElementType.BOX, {
	render: boxElement,
	layout: boxLayout,
	hasChildren: true,
});

registerElement(ElementType.TEXT, {
	render: textElement,
	layout: textLayout,
	hasChildren: false,
});

registerElement(ElementType.TEXT_INPUT, {
	render: textInputElement,
	layout: textInputLayout,
	hasChildren: false,
});

export { boxElement, textElement, textInputElement };
