import type { BoxProps, TextInputProps, TextProps } from "./src/types";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			box: BoxProps;
			text: TextProps;
			textInput: TextInputProps;
		}
	}
}

export function Box(props: BoxProps) {
	return <box {...props} />;
}

export function Text(props: TextProps) {
	return <text {...props} />;
}

export function TextInput(props: TextInputProps) {
	return <textInput {...props} />;
}
