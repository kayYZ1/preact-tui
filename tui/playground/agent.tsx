import { run } from "@/tui/preact";
import { Box, Text, TextInput } from "@/tui/preact/components";
import { useSignal } from "@/tui/preact/hooks/signals";
import { useTextInput, type VimMode } from "@/tui/preact/hooks/text-input";

interface Message {
	role: "user" | "agent";
	content: string;
}

function Agent() {
	const input = useSignal("");
	const cursor = useSignal(0);
	const mode = useSignal<VimMode>("INSERT");
	const messages = useSignal<Message[]>([
		{ role: "agent", content: "Hello! I'm your coding assistant. How can I help you today?" },
	]);

	const handleSubmit = (value: string) => {
		if (!value.trim()) return;

		messages.value = [
			...messages.value,
			{ role: "user", content: value },
			{ role: "agent", content: `You said: "${value}"` },
		];

		input.value = "";
		cursor.value = 0;
	};

	useTextInput({
		value: input,
		cursorPosition: cursor,
		mode,
		focused: true,
		onSubmit: handleSubmit,
	});

	const visibleMessages = messages.value.slice(-8);

	return (
		<Box flex flexDirection="column" padding={1} gap={1}>
			<Box border="round" borderColor="cyan" padding={1} borderLabel=" Agent " borderLabelColor="cyan">
				<Text color="white" bold>
					Coding Agent
				</Text>
			</Box>

			<Box flex flexDirection="column" gap={1} padding={1}>
				{visibleMessages.map((msg) => (
					<Box flexDirection="row" gap={1}>
						<Text color={msg.role === "user" ? "green" : "blue"} bold>
							{msg.role === "user" ? ">" : "•"}
						</Text>
						<Text color={msg.role === "user" ? "white" : "gray"} width={70}>
							{msg.content}
						</Text>
					</Box>
				))}
			</Box>

			<Box
				border="single"
				borderColor={mode.value === "INSERT" ? "green" : "yellow"}
				borderLabel={` ${mode.value} `}
				borderLabelColor={mode.value === "INSERT" ? "green" : "yellow"}
				padding={1}
			>
				<TextInput
					value={input.value}
					cursorPosition={cursor.value}
					placeholder="Type a message..."
					placeholderColor="gray"
					height={1}
					focused
				/>
			</Box>

			<Box>
				<Text color="gray" italic>
					Enter to send • i/Esc to toggle mode • Ctrl+C to exit
				</Text>
			</Box>
		</Box>
	);
}

run(() => <Agent />);
