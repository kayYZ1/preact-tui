import type { BoxProps, TextProps } from "./src/types";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			box: BoxProps;
			text: TextProps;
		}
	}
}

export function Box(props: BoxProps) {
	return <box {...props} />;
}

export function Text(props: TextProps) {
	return <text {...props} />;
}
