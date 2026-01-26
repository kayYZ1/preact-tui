import { useSignal, useSignalEffect } from "./hooks/signals.ts";
import type { BoxProps, SpinnerProps, TextInputProps, TextProps } from "./types/index.ts";

const SPINNER_FRAME_COUNT = 10;

export function Box(props: BoxProps) {
	return <box {...props} />;
}

export function Text(props: TextProps) {
	return <text {...props} />;
}

export function TextInput(props: TextInputProps) {
	return <textInput {...props} />;
}

export function Spinner(props: SpinnerProps) {
	const frame = useSignal(0);
	const interval = props.interval ?? 80;

	useSignalEffect(() => {
		const timer = setInterval(() => {
			frame.value = (frame.value + 1) % SPINNER_FRAME_COUNT;
		}, interval);
		return () => clearInterval(timer);
	});

	return <spinner {...props} frame={frame.value} />;
}
