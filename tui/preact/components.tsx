import { useSignal, useSignalEffect } from "./hooks/signals";
import type { BoxProps, SpinnerProps, TextInputProps, TextProps } from "./types/index";

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
	const tick = useSignal(0);
	const interval = props.interval ?? 80;

	useSignalEffect(() => {
		const timer = setInterval(() => {
			tick.value = (tick.value + 1) % SPINNER_FRAME_COUNT;
		}, interval);
		return () => clearInterval(timer);
	});

	return <spinner {...props} />;
}
