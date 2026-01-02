import { Box, run, Text, TextInput, useSignal, useTextInput } from "../index"; //That neeeds to be split

function TextInputDemo() {
	const value = useSignal("");
	const cursorPosition = useSignal(0);

	useTextInput({
		value,
		cursorPosition,
		focused: true,
	});

	return (
		<Box flex flexDirection="column" gap={1}>
			<Box border="bold" borderColor="cyan" padding={1}>
				<Text color="cyan" bold>
					Text Input Example
				</Text>
			</Box>
			<Box border="single" borderColor="white" padding={1} flexDirection="column" gap={1}>
				<Text color="gray">Type something:</Text>
				<TextInput
					value={value.value}
					placeholder="Enter text here..."
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
			<Text color="gray">(Ctrl+A: start, Ctrl+E: end, Ctrl+C: exit)</Text>
		</Box>
	);
}

run(() => <TextInputDemo />);
