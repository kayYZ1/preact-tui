import { run } from "@/tui/preact";
import { Box, Text, TextInput } from "@/tui/preact/components";
import { useSignal, useVimInput, type VimMode } from "@/tui/preact/hooks";

function TextInputDemo() {
	const value = useSignal("");
	const cursorPosition = useSignal(0);
	const mode = useSignal<VimMode>("NORMAL");

	useVimInput({
		value,
		cursorPosition,
		mode,
		focused: true,
	});

	return (
		<Box flex flexDirection="column" gap={1}>
			<Box border="bold" borderColor="cyan" padding={1}>
				<Text color="cyan" bold>
					Vim Text Input
				</Text>
			</Box>
			<Box border="single" borderLabel={mode.value} padding={1} flexDirection="column" gap={1}>
				<Text color="gray">Type something:</Text>
				<TextInput
					value={value.value}
					placeholder="Press 'i' to insert..."
					placeholderColor="gray"
					color="white"
					width={30}
					focused={true}
					cursorPosition={cursorPosition.value}
				/>
			</Box>
			<Box flexDirection="row" gap={1}>
				<Text color="gray">Value:</Text>
				<Text color="yellow">{value.value || "(empty)"}</Text>
			</Box>
			<Box flexDirection="row" gap={1}>
				<Text color="gray">Cursor:</Text>
				<Text color="cyan">{cursorPosition.value}</Text>
			</Box>
		</Box>
	);
}

run(() => <TextInputDemo />);
