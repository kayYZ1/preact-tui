import { signal } from "@preact/signals";
import { run } from "@/tui/preact";
import { Box, Text } from "@/tui/preact/components";

function AgentInterface() {
	const messages = signal<Array<{ role: "user" | "agent"; text: string }>>([
		{
			role: "agent",
			text: "Welcome to the coding agent. Ask me anything about your codebase.",
		},
	]);

	return (
		<Box flex flexDirection="column" gap={0}>
			{/* Header */}
			<Box border="single" borderColor="cyan" padding={1} borderLabel="Agent" borderLabelColor="cyan">
				<Text color="cyan" bold>
					Coding Agent
				</Text>
			</Box>

			{/* Messages Area */}
			<Box flex flexDirection="column" padding={1} gap={1}>
				{messages.value.map((msg) => (
					<Box flexDirection="column" gap={0}>
						<Text color={msg.role === "user" ? "green" : "blue"} bold>
							{msg.role === "user" ? "You:" : "Agent:"}
						</Text>
						<Text color={msg.role === "user" ? "white" : "gray"} width={76}>
							{msg.text}
						</Text>
					</Box>
				))}
			</Box>

			{/* Input Area */}
			<Box border="single" borderColor="green" padding={1}>
				<Text color="gray">Press Ctrl+C to exit</Text>
			</Box>
		</Box>
	);
}

run(() => <AgentInterface />);
