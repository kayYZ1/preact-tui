import { formatText } from "../../core/utils/format-text";
import type { Instance } from "../src/types";

export function renderText(instance: Instance): Array<{ x: number; y: number; text: string }> {
	const formattedText = formatText(instance);

	return [
		{
			x: Math.round(instance.yogaNode.getComputedLeft()),
			y: Math.round(instance.yogaNode.getComputedTop()),
			text: formattedText,
		},
	];
}
